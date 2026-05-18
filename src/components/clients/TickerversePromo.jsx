import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import './TickerversePromo.css';

const WALL_STREET_SCENE_URL = '/models/tickerverse/wall-street-1928.glb';
const MAN_PHOTO_URL = '/images/tickerverse/tickerville-man-photo.png';

const BUILDING_MATERIALS = new Set([
  'limestone_fed',
  'limestone_nyse',
  'beige_stone',
  'brick_red',
  'brick_warm',
]);

const SURFACE_MATERIALS = {
  cobblestone_granite: { base: '#6f6b5f', accent: '#9a927b', kind: 'cobble' },
  sidewalk_bluestone: { base: '#8c9186', accent: '#b6b39c', kind: 'slab' },
  dark_gothic: { base: '#5c513f', accent: '#887757', kind: 'stone' },
};

const BUILDING_LOOKS = {
  limestone_fed: { wall: '#d8ceb6', trim: '#8b7a55', glass: '#171714', cols: 4, rows: 6 },
  limestone_nyse: { wall: '#cbbfa9', trim: '#85724e', glass: '#151412', cols: 4, rows: 7 },
  beige_stone: { wall: '#b9a880', trim: '#756545', glass: '#141512', cols: 4, rows: 7 },
  brick_red: { wall: '#80523c', trim: '#4d3123', glass: '#131312', cols: 5, rows: 7 },
  brick_warm: { wall: '#9a6b49', trim: '#5c3c2a', glass: '#141413', cols: 5, rows: 7 },
};

const TRINITY_OBJECT_PATTERN = /^Trinity_/;
const TRINITY_TEXTURE_KEY = 'trinity_brownstone';
const TRINITY_STONE_LOOK = { base: '#74664d', accent: '#b29a6c', kind: 'gothic' };
const GLASS_MATERIALS = new Set(['window_glass', 'storefront_glass', 'car_glass']);

const SIMPLE_SCENE_PROP_PATTERN =
  /^(car_|lamp_|smoke_|awning_|trolley_|flag_|grate_|manhole_|hydrant_|mailbox_|trash_|ped_walk_)/;

const VIEWPOINTS = {
  rooftop: {
    id: 'rooftop',
    label: 'Roof',
    eyebrow: 'Welcome',
    position: [106, 80.5, -164],
    target: [-18, 132, -74],
    fov: 50,
  },
  canyon: {
    id: 'canyon',
    label: 'Street',
    eyebrow: 'Trade floor',
    position: [92, 52, -106],
    target: [-20, 28, -12],
    fov: 56,
  },
  steeple: {
    id: 'steeple',
    label: 'Steeple',
    eyebrow: 'Church street',
    position: [-95, 8, -172],
    target: [-90, 68, 0],
    fov: 52,
  },
  exchange: {
    id: 'exchange',
    label: 'Exchange',
    eyebrow: 'Market hub',
    position: [12, 82, -118],
    target: [-96, 48, -18],
    fov: 47,
  },
  skyline: {
    id: 'skyline',
    label: 'Skyline',
    eyebrow: 'Outlook',
    position: [36, 142, -246],
    target: [-30, 58, 4],
    fov: 38,
  },
};

const VIEWPOINT_SEQUENCE = ['rooftop', 'canyon', 'steeple', 'exchange', 'skyline'];

const AUTHORED_VIEW_NAMES = {
  rooftop: 'Rooftop_Lookup',
  canyon: 'Street_Canyon',
  steeple: 'Steeple_View',
  exchange: 'Exchange_View',
  skyline: 'Skyline_View',
};

const AUTHORED_PATH_SEGMENTS = [
  { from: 'rooftop', to: 'canyon', name: 'Rooftop_to_Canyon' },
  { from: 'canyon', to: 'steeple', name: 'Canyon_to_Steeple' },
  { from: 'steeple', to: 'exchange', name: 'Steeple_to_Exchange' },
  { from: 'exchange', to: 'skyline', name: 'Exchange_to_Skyline' },
];

function vectorFromArray(value) {
  return new THREE.Vector3(value[0], value[1], value[2]);
}

function seededUnitValue(seed) {
  let hash = 2166136261;
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) / 4294967295;
}

function easeTrackProgress(value) {
  const t = THREE.MathUtils.clamp(value, 0, 1);
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function getObjectWorldPosition(object) {
  const position = new THREE.Vector3();
  object.getWorldPosition(position);
  return position;
}

function vectorFromUserData(value) {
  if (!Array.isArray(value) || value.length < 3) return null;
  const vector = value.map(Number);
  if (vector.some((component) => !Number.isFinite(component))) return null;
  return new THREE.Vector3(vector[0], vector[1], vector[2]);
}

function extractAuthoredCameraData(scene) {
  scene.updateMatrixWorld(true);

  const viewpoints = {};
  const pathSegments = {};

  VIEWPOINT_SEQUENCE.forEach((viewId) => {
    const fallback = VIEWPOINTS[viewId];
    const authoredName = AUTHORED_VIEW_NAMES[viewId];
    const cameraEmpty = scene.getObjectByName(`Camera_${authoredName}`);
    const targetEmpty = scene.getObjectByName(`Target_${authoredName}`);
    const userDataTarget = vectorFromUserData(cameraEmpty?.userData?.threejs_target);
    const userDataFov = Number(cameraEmpty?.userData?.fov);

    viewpoints[viewId] = {
      ...fallback,
      position: cameraEmpty ? getObjectWorldPosition(cameraEmpty) : vectorFromArray(fallback.position),
      target: targetEmpty
        ? getObjectWorldPosition(targetEmpty)
        : userDataTarget || vectorFromArray(fallback.target),
      fov: Number.isFinite(userDataFov) ? userDataFov : fallback.fov,
      isAuthored: Boolean(cameraEmpty),
    };
  });

  AUTHORED_PATH_SEGMENTS.forEach(({ from, to, name }) => {
    const waypoints = [];
    for (let index = 0; ; index += 1) {
      const waypoint = scene.getObjectByName(`Wp_${name}_${index}`);
      if (!waypoint) break;
      waypoints.push(getObjectWorldPosition(waypoint));
    }
    if (waypoints.length > 0) {
      pathSegments[`${from}:${to}`] = waypoints;
    }
  });

  return { viewpoints, pathSegments };
}

function getPathSegment(pathSegments, fromId, toId) {
  const forward = pathSegments[`${fromId}:${toId}`];
  if (forward) return forward.map((point) => point.clone());

  const reverse = pathSegments[`${toId}:${fromId}`];
  if (reverse) return [...reverse].reverse().map((point) => point.clone());

  return [];
}

function makeRouteWaypoints({ fromId, toId, authoredData }) {
  const fromIndex = VIEWPOINT_SEQUENCE.indexOf(fromId);
  const toIndex = VIEWPOINT_SEQUENCE.indexOf(toId);

  if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) {
    return { positionWaypoints: [], targetWaypoints: [] };
  }

  const direction = Math.sign(toIndex - fromIndex);
  const positionWaypoints = [];
  const targetWaypoints = [];

  for (let index = fromIndex; index !== toIndex; index += direction) {
    const stepFrom = VIEWPOINT_SEQUENCE[index];
    const stepTo = VIEWPOINT_SEQUENCE[index + direction];

    positionWaypoints.push(...getPathSegment(authoredData.pathSegments, stepFrom, stepTo));

    if (index + direction !== toIndex) {
      const waypointView = authoredData.viewpoints[stepTo];
      positionWaypoints.push(waypointView.position.clone());
      targetWaypoints.push(waypointView.target.clone());
    }
  }

  return { positionWaypoints, targetWaypoints };
}

function makeCameraRail({
  fromPosition,
  toPosition,
  fromTarget,
  toTarget,
  fromFov,
  toFov,
  positionWaypoints = [],
  targetWaypoints = [],
}) {
  const travel = fromPosition.distanceTo(toPosition);
  const authoredPositionPoints = [
    fromPosition.clone(),
    ...positionWaypoints.map((point) => point.clone()),
    toPosition.clone(),
  ];
  const authoredTargetPoints = [
    fromTarget.clone(),
    ...targetWaypoints.map((point) => point.clone()),
    toTarget.clone(),
  ];
  let positionCurve;
  let targetCurve;

  if (authoredPositionPoints.length > 2) {
    positionCurve = new THREE.CatmullRomCurve3(authoredPositionPoints, false, 'centripetal', 0.35);
  } else {
    const horizontal = toPosition.clone().sub(fromPosition);
    horizontal.y = 0;

    if (horizontal.lengthSq() < 0.001) {
      horizontal.set(1, 0, 0);
    }

    horizontal.normalize();

    const side = new THREE.Vector3(-horizontal.z, 0, horizontal.x);
    const orbitDirection = toPosition.x >= fromPosition.x ? 1 : -1;
    const lateralDrift = THREE.MathUtils.clamp(travel * 0.18, 10, 42) * orbitDirection;
    const craneLift = THREE.MathUtils.clamp(travel * 0.16, 12, 38);
    const forwardPush = THREE.MathUtils.clamp(travel * 0.1, 8, 26);

    positionCurve = new THREE.CubicBezierCurve3(
      fromPosition.clone(),
      fromPosition.clone()
        .lerp(toPosition, 0.28)
        .add(side.clone().multiplyScalar(lateralDrift))
        .add(horizontal.clone().multiplyScalar(forwardPush))
        .add(new THREE.Vector3(0, craneLift, 0)),
      fromPosition.clone()
        .lerp(toPosition, 0.74)
        .add(side.clone().multiplyScalar(lateralDrift * 0.55))
        .add(new THREE.Vector3(0, craneLift * 0.45, 0)),
      toPosition.clone(),
    );
  }

  if (authoredTargetPoints.length > 2) {
    targetCurve = new THREE.CatmullRomCurve3(authoredTargetPoints, false, 'centripetal', 0.35);
  } else {
    const targetLift = THREE.MathUtils.clamp(travel * 0.045, 3, 13);
    targetCurve = new THREE.CubicBezierCurve3(
      fromTarget.clone(),
      fromTarget.clone().lerp(toTarget, 0.34).add(new THREE.Vector3(0, targetLift, 0)),
      fromTarget.clone().lerp(toTarget, 0.7).add(new THREE.Vector3(0, targetLift * 0.4, 0)),
      toTarget.clone(),
    );
  }

  return {
    elapsed: 0,
    duration: THREE.MathUtils.clamp(1.8 + positionCurve.getLength() / 115, 2.35, 8.5),
    fromFov,
    toFov,
    positionCurve,
    targetCurve,
  };
}

function makeSurfaceTexture({ base, accent, kind }) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < 4200; i += 1) {
    const alpha = Math.random() * 0.16;
    ctx.fillStyle = Math.random() > 0.5
      ? `rgba(255, 245, 205, ${alpha})`
      : `rgba(23, 20, 18, ${alpha})`;
    ctx.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
  }

  ctx.strokeStyle = accent;
  ctx.globalAlpha = kind === 'gothic' ? 0.24 : 0.18;
  ctx.lineWidth = kind === 'cobble' ? 1.6 : 1;
  const step = kind === 'cobble' ? 34 : kind === 'gothic' ? 58 : 76;

  for (let x = 0; x <= 512; x += step) {
    ctx.beginPath();
    ctx.moveTo(x + Math.sin(x) * 4, 0);
    ctx.lineTo(x - Math.cos(x) * 5, 512);
    ctx.stroke();
  }
  for (let y = 0; y <= 512; y += step * 0.72) {
    ctx.beginPath();
    ctx.moveTo(0, y + Math.cos(y) * 4);
    ctx.lineTo(512, y - Math.sin(y) * 4);
    ctx.stroke();
  }

  if (kind === 'gothic') {
    ctx.globalAlpha = 0.2;
    ctx.lineWidth = 2;
    for (let x = 34; x < 512; x += 74) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + Math.sin(x) * 2, 512);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x + 9, 0);
      ctx.lineTo(x + 7 + Math.cos(x) * 2, 512);
      ctx.stroke();
    }
    ctx.globalAlpha = 0.11;
    ctx.fillStyle = '#fff1bd';
    for (let i = 0; i < 42; i += 1) {
      ctx.fillRect(Math.random() * 512, Math.random() * 512, 2, 8 + Math.random() * 22);
    }
  }

  ctx.globalAlpha = 1;

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

function makeWallTexture({ wall, trim }) {
  const canvas = document.createElement('canvas');
  canvas.width = 768;
  canvas.height = 768;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = wall;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < 9500; i += 1) {
    const shade = Math.random() > 0.5 ? 255 : 0;
    ctx.fillStyle = `rgba(${shade}, ${shade}, ${shade}, ${Math.random() * 0.055})`;
    ctx.fillRect(Math.random() * 768, Math.random() * 768, 2, 2);
  }

  ctx.strokeStyle = 'rgba(43, 34, 25, 0.18)';
  ctx.lineWidth = 1;
  for (let y = 22; y < canvas.height; y += 48) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y + Math.sin(y) * 2);
    ctx.stroke();
  }

  ctx.fillStyle = trim;
  for (let y = 0; y < canvas.height; y += 168) {
    ctx.fillRect(0, y, canvas.width, 12);
    ctx.fillStyle = 'rgba(255, 242, 196, 0.13)';
    ctx.fillRect(0, y + 12, canvas.width, 2);
    ctx.fillStyle = trim;
  }
  ctx.fillStyle = 'rgba(255, 242, 196, 0.16)';
  ctx.fillRect(0, 0, canvas.width, 3);

  ctx.strokeStyle = 'rgba(40, 31, 22, 0.14)';
  for (let x = 36; x < canvas.width; x += 88) {
    ctx.beginPath();
    ctx.moveTo(x + Math.sin(x) * 2, 0);
    ctx.lineTo(x - Math.cos(x) * 2, canvas.height);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

function makeFacadeWindowTexture({ trim, glass }) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'rgba(43, 34, 25, 0.22)';
  ctx.fillRect(32, 18, 192, 2);
  ctx.fillRect(32, 228, 192, 3);

  const x = 82;
  const y = 62;
  const windowW = 92;
  const windowH = 112;

  ctx.fillStyle = 'rgba(32, 25, 18, 0.2)';
  ctx.fillRect(x - 16, y - 16, windowW + 32, windowH + 34);
  ctx.fillStyle = trim;
  ctx.fillRect(x - 10, y - 12, windowW + 20, 7);
  ctx.fillRect(x - 8, y + windowH + 6, windowW + 16, 6);
  ctx.fillRect(x - 7, y - 3, 5, windowH + 8);
  ctx.fillRect(x + windowW + 2, y - 3, 5, windowH + 8);
  ctx.fillStyle = 'rgba(255, 239, 190, 0.12)';
  ctx.fillRect(x - 8, y - 10, windowW + 18, 2);

  ctx.fillStyle = glass;
  ctx.fillRect(x, y, windowW, windowH);
  ctx.fillStyle = 'rgba(255, 245, 205, 0.08)';
  ctx.fillRect(x + 3, y + 3, windowW * 0.3, windowH - 6);
  ctx.fillStyle = trim;
  ctx.fillRect(x + windowW / 2 - 1, y + 2, 2, windowH - 4);
  ctx.fillRect(x + 4, y + windowH * 0.52, windowW - 8, 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

function createWindowFacade({ name, texture, width, height, position, rotationY }) {
  const facadeTexture = texture.clone();
  facadeTexture.wrapS = THREE.RepeatWrapping;
  facadeTexture.wrapT = THREE.RepeatWrapping;
  facadeTexture.repeat.set(
    Math.max(1, Math.round(width / 15)),
    Math.max(1, Math.round(height / 18)),
  );
  facadeTexture.needsUpdate = true;

  const material = new THREE.MeshBasicMaterial({
    map: facadeTexture,
    transparent: true,
    alphaTest: 0.035,
    depthWrite: false,
    side: THREE.DoubleSide,
    toneMapped: false,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), material);
  mesh.name = name;
  mesh.position.copy(position);
  mesh.rotation.set(0, rotationY, 0);
  mesh.renderOrder = 2;
  return mesh;
}

function addBuildingWindowFacades(root, object, lookName, windowTexture) {
  if (!windowTexture) return;

  const box = new THREE.Box3().setFromObject(object);
  const size = box.getSize(new THREE.Vector3());

  if (size.y < 18 || Math.max(size.x, size.z) < 12) return;

  const bottomInset = THREE.MathUtils.clamp(size.y * 0.08, 2.5, 7.5);
  const topInset = THREE.MathUtils.clamp(size.y * 0.14, 4, 12);
  const height = size.y - bottomInset - topInset;
  if (height < 10) return;

  const y = box.min.y + bottomInset + height / 2;
  const offset = 0.08;
  const faces = [
    {
      width: size.x,
      position: new THREE.Vector3((box.min.x + box.max.x) / 2, y, box.max.z + offset),
      rotationY: 0,
      suffix: 'south',
    },
    {
      width: size.x,
      position: new THREE.Vector3((box.min.x + box.max.x) / 2, y, box.min.z - offset),
      rotationY: Math.PI,
      suffix: 'north',
    },
    {
      width: size.z,
      position: new THREE.Vector3(box.max.x + offset, y, (box.min.z + box.max.z) / 2),
      rotationY: Math.PI / 2,
      suffix: 'east',
    },
    {
      width: size.z,
      position: new THREE.Vector3(box.min.x - offset, y, (box.min.z + box.max.z) / 2),
      rotationY: -Math.PI / 2,
      suffix: 'west',
    },
  ];

  faces.forEach((face) => {
    const cornerInset = THREE.MathUtils.clamp(face.width * 0.08, 1.8, 5.8);
    const width = face.width - cornerInset * 2;
    if (width < 8) return;

    root.add(createWindowFacade({
      name: `${object.name || lookName}_window_facade_${face.suffix}`,
      texture: windowTexture,
      width,
      height,
      position: face.position,
      rotationY: face.rotationY,
    }));
  });
}

function makeWelcomeTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 384;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#9ecfe4';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.16)';
  ctx.fillRect(0, 0, canvas.width, 82);

  ctx.strokeStyle = 'rgba(35, 43, 48, 0.12)';
  ctx.lineWidth = 2;
  for (let y = 18; y < canvas.height; y += 14) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  ctx.fillStyle = '#372820';
  ctx.font = '900 140px Impact, Haettenschweiler, Arial Narrow, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('WELCOME', canvas.width / 2, canvas.height / 2 + 18);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

function makeMessageTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#eee4c6';
  ctx.font = '700 54px Georgia, Times New Roman, serif';
  ctx.textBaseline = 'top';

  const lines = [
    'This is Tickerverse,',
    'a destination for both',
    'passive and active traders',
    'to hone their skills.',
  ];

  lines.forEach((line, index) => {
    ctx.fillText(line, 24, 42 + index * 72);
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

function CameraRig({ activeView }) {
  const { scene } = useGLTF(WALL_STREET_SCENE_URL);
  const { camera } = useThree();
  const authoredData = useMemo(() => extractAuthoredCameraData(scene), [scene]);
  const initialView = authoredData.viewpoints.rooftop || VIEWPOINTS.rooftop;
  const lookAt = useRef(initialView.target.clone());
  const mounted = useRef(false);
  const transition = useRef(null);
  const currentViewId = useRef(activeView);
  const view = authoredData.viewpoints[activeView] || authoredData.viewpoints.rooftop;

  useEffect(() => {
    const goalPosition = view.position.clone();
    const goalTarget = view.target.clone();

    if (mounted.current) return;

    camera.position.copy(goalPosition);
    lookAt.current.copy(goalTarget);
    // R3F exposes the live Three.js camera; assigning FOV is the intended imperative API.
    // eslint-disable-next-line react-hooks/immutability
    camera.fov = view.fov;
    camera.lookAt(lookAt.current);
    camera.updateProjectionMatrix();
    mounted.current = true;
    currentViewId.current = activeView;
  }, [activeView, camera, view]);

  useEffect(() => {
    if (!mounted.current) return;
    if (currentViewId.current === activeView && !transition.current) return;

    const fromId = currentViewId.current;
    const goalPosition = view.position.clone();
    const goalTarget = view.target.clone();
    const { positionWaypoints, targetWaypoints } = makeRouteWaypoints({
      fromId,
      toId: activeView,
      authoredData,
    });

    transition.current = makeCameraRail({
      fromPosition: camera.position.clone(),
      toPosition: goalPosition,
      fromTarget: lookAt.current.clone(),
      toTarget: goalTarget,
      fromFov: camera.fov,
      toFov: view.fov,
      positionWaypoints,
      targetWaypoints,
    });
    currentViewId.current = activeView;
  }, [activeView, authoredData, camera, view]);

  useFrame((_, delta) => {
    if (transition.current) {
      const rail = transition.current;
      rail.elapsed += delta;

      const rawProgress = Math.min(rail.elapsed / rail.duration, 1);
      const easedProgress = easeTrackProgress(rawProgress);

      camera.position.copy(rail.positionCurve.getPoint(easedProgress));
      lookAt.current.copy(rail.targetCurve.getPoint(easedProgress));
      // R3F exposes the live Three.js camera; assigning FOV is the intended imperative API.
      // eslint-disable-next-line react-hooks/immutability
      camera.fov = THREE.MathUtils.lerp(rail.fromFov, rail.toFov, easedProgress);

      if (rawProgress >= 1) {
        transition.current = null;
      }
    }

    camera.lookAt(lookAt.current);
    camera.updateProjectionMatrix();
  });

  return null;
}

function WallStreetBackdrop() {
  const { scene } = useGLTF(WALL_STREET_SCENE_URL);
  const gl = useThree((state) => state.gl);

  const { model, walkers } = useMemo(() => {
    const clone = scene.clone(true);
    const nodesToRemove = [];
    const animatedWalkers = [];
    const windowFacadeRequests = [];
    const materialTint = new THREE.Color('#c2b783');
    const textureBank = {};
    const windowTextureBank = {};
    clone.updateMatrixWorld(true);

    Object.entries(BUILDING_LOOKS).forEach(([name, look]) => {
      textureBank[name] = makeWallTexture(look);
      windowTextureBank[name] = makeFacadeWindowTexture(look);
    });
    Object.entries(SURFACE_MATERIALS).forEach(([name, look]) => {
      textureBank[name] = makeSurfaceTexture(look);
    });
    textureBank[TRINITY_TEXTURE_KEY] = makeSurfaceTexture(TRINITY_STONE_LOOK);
    Object.values(textureBank).forEach((texture) => {
      texture.anisotropy = gl.capabilities.getMaxAnisotropy?.() || 8;
    });
    const hasAuthoredWindowGeometry = (() => {
      let found = false;
      clone.traverse((object) => {
        if (found || !object.isMesh) return;
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        found = materials.some((material) => (
          GLASS_MATERIALS.has(material?.name || '') ||
          /^Trinity_windows_/.test(object.name || '') ||
          /^bf_.*_(win|storefront_glass)_/.test(object.name || '')
        ));
      });
      return found;
    })();

    const prepareMaterial = (material, object) => {
      const materialName = material.name || '';
      const isTrinity = TRINITY_OBJECT_PATTERN.test(object.name);
      const isTrinityStone = isTrinity && ['dark_gothic', 'Trinity_stone'].includes(materialName);
      const isGeneratedTrinityStone = isTrinity && materialName === 'dark_gothic';
      const generatedTexture = textureBank[
        isGeneratedTrinityStone ? TRINITY_TEXTURE_KEY : materialName
      ]?.clone();
      const next = material.isMeshPhysicalMaterial
        ? new THREE.MeshStandardMaterial({
            name: material.name,
            map: generatedTexture || material.map || null,
            normalMap: material.normalMap || null,
            roughnessMap: material.roughnessMap || null,
            metalnessMap: material.metalnessMap || null,
            emissiveMap: material.emissiveMap || null,
            color: material.color?.clone() || new THREE.Color('#ffffff'),
            emissive: material.emissive?.clone() || new THREE.Color('#000000'),
            emissiveIntensity: material.emissiveIntensity || 0,
            transparent: material.transparent,
            opacity: material.opacity,
            alphaTest: material.alphaTest,
            side: material.side,
          })
        : material.clone();

      if (generatedTexture) {
        const box = new THREE.Box3().setFromObject(object);
        const size = box.getSize(new THREE.Vector3());
        const faceWidth = Math.max(size.x, size.z);
        const isBuildingMaterial = BUILDING_MATERIALS.has(materialName);
        const verticalRepeat = isGeneratedTrinityStone
          ? Math.max(1, Math.round(size.y / 22))
          : isBuildingMaterial
          ? Math.max(1, Math.round(size.y / 34))
          : Math.max(1, Math.round(size.y / 52));
        const horizontalRepeat = isGeneratedTrinityStone
          ? Math.max(1, Math.round(faceWidth / 14))
          : isBuildingMaterial
          ? Math.max(1, Math.round(faceWidth / 30))
          : materialName === 'cobblestone_granite'
            ? Math.max(2, Math.round(faceWidth / 30))
            : 1;

        generatedTexture.wrapS = THREE.RepeatWrapping;
        generatedTexture.wrapT = THREE.RepeatWrapping;
        generatedTexture.repeat.set(
          horizontalRepeat,
          isBuildingMaterial || isGeneratedTrinityStone ? verticalRepeat : horizontalRepeat,
        );
        generatedTexture.needsUpdate = true;
        next.map = generatedTexture;
        if (next.color) next.color.set(isBuildingMaterial ? '#f1ead6' : '#ffffff');
      }

      if (GLASS_MATERIALS.has(materialName)) {
        next.transparent = true;
        next.opacity = material.opacity ?? 0.88;
        if ('roughness' in next) next.roughness = 0.42;
        if ('metalness' in next) next.metalness = 0;
        if ('envMapIntensity' in next) next.envMapIntensity = 0.14;
      } else if (isGeneratedTrinityStone) {
        if (next.color) next.color.set('#fff5d3');
        if ('roughness' in next) next.roughness = 0.82;
        if ('emissive' in next) next.emissive = new THREE.Color('#2a2116');
        if ('emissiveIntensity' in next) next.emissiveIntensity = 0.1;
      } else if (isTrinityStone) {
        if ('roughness' in next) next.roughness = 0.86;
        if ('emissive' in next) next.emissive = new THREE.Color('#21180f');
        if ('emissiveIntensity' in next) next.emissiveIntensity = 0.04;
      } else if ('roughness' in next) next.roughness = Math.max(next.roughness ?? 0.8, 0.88);
      if ('metalness' in next) next.metalness = Math.min(next.metalness ?? 0, 0.08);
      if ('envMapIntensity' in next && !GLASS_MATERIALS.has(materialName)) next.envMapIntensity = 0.04;
      if (next.color && !next.map) next.color.lerp(materialTint, 0.08);
      next.needsUpdate = true;
      return next;
    };

    clone.traverse((object) => {
      if (
        object.isLight ||
        object.name.startsWith('_bake_plane_') ||
        SIMPLE_SCENE_PROP_PATTERN.test(object.name)
      ) {
        nodesToRemove.push(object);
        return;
      }

      if (!object.isMesh) return;

      object.castShadow = false;
      object.receiveShadow = true;
      const materialNames = Array.isArray(object.material)
        ? object.material.map((material) => material?.name || '')
        : [object.material?.name || ''];
      const buildingMaterialName = materialNames.find((name) => BUILDING_MATERIALS.has(name));

      if (Array.isArray(object.material)) {
        object.material = object.material.map((material) => prepareMaterial(material, object));
      } else if (object.material) {
        object.material = prepareMaterial(object.material, object);
      }

      if (buildingMaterialName && !hasAuthoredWindowGeometry) {
        windowFacadeRequests.push({ object, lookName: buildingMaterialName });
      }

      if (object.name.startsWith('ped_walk_')) {
        const speedSeed = seededUnitValue(`${object.name}:speed`);
        const directionSeed = seededUnitValue(`${object.name}:direction`);
        const phaseSeed = seededUnitValue(`${object.name}:phase`);
        animatedWalkers.push({
          mesh: object,
          axis: object.name.includes('ped_walk_EW_') ? 'x' : 'z',
          speed: 1 + speedSeed * 0.55,
          direction: directionSeed < 0.5 ? -1 : 1,
          phase: phaseSeed * Math.PI * 2,
          originY: object.position.y,
        });
      }
    });

    nodesToRemove.forEach((object) => object.parent?.remove(object));
    windowFacadeRequests.forEach(({ object, lookName }) => {
      addBuildingWindowFacades(clone, object, lookName, windowTextureBank[lookName]);
    });

    return { model: clone, walkers: animatedWalkers };
  }, [gl, scene]);

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    const step = Math.min(delta, 0.05);

    walkers.forEach((walker) => {
      walker.mesh.position[walker.axis] += walker.direction * walker.speed * step;
      if (walker.axis === 'x') {
        if (walker.mesh.position.x > 305) walker.mesh.position.x = -195;
        if (walker.mesh.position.x < -195) walker.mesh.position.x = 305;
      } else {
        if (walker.mesh.position.z > 185) walker.mesh.position.z = -360;
        if (walker.mesh.position.z < -360) walker.mesh.position.z = 185;
      }
      walker.mesh.position.y = walker.originY + Math.sin(t * 4 + walker.phase) * 0.04;
    });
  });

  return <primitive object={model} />;
}

function Billboard3D({ onSelectView }) {
  const photoTexture = useTexture(MAN_PHOTO_URL);
  const preparedPhotoTexture = useMemo(() => {
    const texture = photoTexture.clone();
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    texture.needsUpdate = true;
    return texture;
  }, [photoTexture]);
  const welcomeTexture = useMemo(() => makeWelcomeTexture(), []);
  const messageTexture = useMemo(() => makeMessageTexture(), []);

  return (
    <group
      position={[103.5, 66.2, -144]}
      rotation={[0, 2.36, -0.015]}
      scale={0.72}
      onClick={(event) => {
        event.stopPropagation();
        onSelectView('rooftop');
      }}
    >
      <mesh castShadow receiveShadow>
        <boxGeometry args={[15.8, 4.15, 0.36]} />
        <meshStandardMaterial color="#302622" roughness={0.92} metalness={0.02} />
      </mesh>

      <mesh position={[0, 2.15, 0.12]} receiveShadow>
        <boxGeometry args={[16.05, 0.14, 0.26]} />
        <meshStandardMaterial color="#8fc7df" roughness={0.68} metalness={0.05} />
      </mesh>

      <group position={[-5.85, 0.42, 0.31]} rotation={[0, 0, -0.09]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[3.55, 3.28, 0.25]} />
          <meshStandardMaterial color="#211b1b" roughness={0.88} />
        </mesh>
        <mesh position={[0, 0, 0.15]}>
          <planeGeometry args={[3.08, 2.82]} />
          <meshBasicMaterial map={preparedPhotoTexture} toneMapped={false} side={THREE.DoubleSide} />
        </mesh>
      </group>

      <mesh position={[-0.8, 0.42, 0.28]} receiveShadow>
        <boxGeometry args={[6.45, 2.28, 0.16]} />
        <meshBasicMaterial map={welcomeTexture} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>

      <mesh position={[5.1, 0.1, 0.29]}>
        <planeGeometry args={[5.0, 2.55]} />
        <meshBasicMaterial
          map={messageTexture}
          transparent
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {[-5.9, 5.55].map((x) => (
        <mesh key={x} position={[x, -3.1, -0.04]} castShadow receiveShadow>
          <boxGeometry args={[0.22, 3.95, 0.22]} />
          <meshStandardMaterial color="#1f1918" roughness={0.85} />
        </mesh>
      ))}
    </group>
  );
}

function TickerverseScene({ activeView, onSelectView }) {
  return (
    <Canvas
      camera={{ position: [130, 82, -170], fov: 44, near: 0.1, far: 2200 }}
      gl={{ alpha: false, antialias: true, powerPreference: 'high-performance' }}
      dpr={[1, 1.5]}
      shadows
    >
      <color attach="background" args={['#b9b18f']} />
      <fog attach="fog" args={['#b9b18f', 260, 1650]} />
      <ambientLight intensity={0.42} color="#d2c9aa" />
      <hemisphereLight args={['#e0d4ac', '#4c3f32', 1.16]} />
      <directionalLight position={[30, 72, -18]} intensity={2.4} color="#ffe0ae" />
      <directionalLight position={[-36, 24, 28]} intensity={0.52} color="#8fc7df" />
      <directionalLight position={[-156, 104, -132]} intensity={1.12} color="#f1d09a" />
      <pointLight position={[105, 68, -144]} intensity={18} distance={54} color="#f0d29a" />
      <pointLight position={[-106, 44, -58]} intensity={64} distance={150} decay={1.55} color="#efc889" />
      <Suspense fallback={null}>
        <CameraRig activeView={activeView} />
        <WallStreetBackdrop />
        <Billboard3D onSelectView={onSelectView} />
      </Suspense>
    </Canvas>
  );
}

useGLTF.preload(WALL_STREET_SCENE_URL);
useTexture.preload(MAN_PHOTO_URL);

export default function TickerversePromo() {
  const [activeView, setActiveView] = useState('rooftop');
  const currentView = VIEWPOINTS[activeView] || VIEWPOINTS.rooftop;

  useEffect(() => {
    const prev = document.title;
    document.title = 'Tickerverse';
    return () => {
      document.title = prev;
    };
  }, []);

  return (
    <main className="tv-root" aria-label="Tickerverse">
      <div className="tv-skyline">
        <TickerverseScene activeView={activeView} onSelectView={setActiveView} />
      </div>
      <div className="tv-atmosphere" aria-hidden="true" />
      <div className="tv-grain" aria-hidden="true" />
      <nav className="tv-nav" aria-label="Tickerverse sections">
        <div className="tv-nav-status" aria-live="polite">
          <span>{currentView.eyebrow}</span>
          <strong>{currentView.label}</strong>
        </div>
        <div className="tv-nav-list">
          {VIEWPOINT_SEQUENCE.map((viewId) => {
            const view = VIEWPOINTS[viewId];
            return (
              <button
                className={`tv-section-button${viewId === activeView ? ' is-active' : ''}`}
                key={view.id}
                type="button"
                aria-pressed={viewId === activeView}
                onClick={() => setActiveView(viewId)}
              >
                <span>{view.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
      <p className="tv-visually-hidden">
        Tickerverse is a destination for both passive and active traders to hone their skills.
      </p>
    </main>
  );
}
