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
  dark_gothic: { base: '#403b35', accent: '#675f52', kind: 'stone' },
};

const BUILDING_LOOKS = {
  limestone_fed: { wall: '#d8ceb6', frame: '#766844', cols: 6, rows: 6 },
  limestone_nyse: { wall: '#cbbfa9', frame: '#746542', cols: 7, rows: 13 },
  beige_stone: { wall: '#b9a880', frame: '#66573d', cols: 7, rows: 12 },
  brick_red: { wall: '#80523c', frame: '#3d281d', cols: 6, rows: 10 },
  brick_warm: { wall: '#9a6b49', frame: '#4c3021', cols: 7, rows: 11 },
};

const SIMPLE_SCENE_PROP_PATTERN =
  /^(car_|lamp_|smoke_|awning_|trolley_|flag_|grate_|manhole_|hydrant_|mailbox_|trash_|ped_walk_)/;

const VIEWPOINTS = {
  rooftop: {
    id: 'rooftop',
    label: 'Roof',
    eyebrow: 'Welcome',
    position: [130, 82, -170],
    target: [-38, 62, -8],
    fov: 44,
  },
  canyon: {
    id: 'canyon',
    label: 'Street',
    eyebrow: 'Trade floor',
    position: [92, 52, -106],
    target: [-20, 28, -12],
    fov: 56,
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

const VIEWPOINT_SEQUENCE = ['rooftop', 'canyon', 'exchange', 'skyline'];

const HOTSPOTS = [
  { id: 'rooftop', label: 'Roof', position: [100, 71, -139], color: '#9ecfe4' },
  { id: 'canyon', label: 'Street', position: [22, 12, -42], color: '#e3c777' },
  { id: 'exchange', label: 'Exchange', position: [-128, 31, 8], color: '#d9b26c' },
  { id: 'skyline', label: 'Skyline', position: [-8, 112, 42], color: '#a9d2d7' },
];

function vectorFromArray(value) {
  return new THREE.Vector3(value[0], value[1], value[2]);
}

function easeTrackProgress(value) {
  const t = THREE.MathUtils.clamp(value, 0, 1);
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function makeCameraRail({ fromPosition, toPosition, fromTarget, toTarget, fromFov, toFov }) {
  const travel = fromPosition.distanceTo(toPosition);
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

  const positionCurve = new THREE.CubicBezierCurve3(
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

  const targetLift = THREE.MathUtils.clamp(travel * 0.045, 3, 13);
  const targetCurve = new THREE.CubicBezierCurve3(
    fromTarget.clone(),
    fromTarget.clone().lerp(toTarget, 0.34).add(new THREE.Vector3(0, targetLift, 0)),
    fromTarget.clone().lerp(toTarget, 0.7).add(new THREE.Vector3(0, targetLift * 0.4, 0)),
    toTarget.clone(),
  );

  return {
    elapsed: 0,
    duration: THREE.MathUtils.clamp(1.8 + travel / 115, 2.35, 4.9),
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
  ctx.globalAlpha = 0.18;
  ctx.lineWidth = kind === 'cobble' ? 1.6 : 1;
  const step = kind === 'cobble' ? 34 : 76;

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
  ctx.globalAlpha = 1;

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

function makeWindowTexture({ wall, frame, cols, rows }) {
  const canvas = document.createElement('canvas');
  canvas.width = 768;
  canvas.height = 768;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = wall;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < 8500; i += 1) {
    const shade = Math.random() > 0.5 ? 255 : 0;
    ctx.fillStyle = `rgba(${shade}, ${shade}, ${shade}, ${Math.random() * 0.08})`;
    ctx.fillRect(Math.random() * 768, Math.random() * 768, 2, 2);
  }

  const gap = 10;
  const cellW = (768 - gap * (cols + 1)) / cols;
  const cellH = (768 - gap * (rows + 1)) / rows;

  for (let row = 1; row < rows - 1; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const x = gap + col * (cellW + gap);
      const y = gap + row * (cellH + gap);
      const lit = Math.random() < 0.035;

      ctx.fillStyle = frame;
      ctx.fillRect(x, y, cellW, cellH);
      ctx.fillStyle = lit ? '#e8c880' : '#11100e';
      ctx.fillRect(x + 5, y + 5, cellW - 10, cellH - 10);
      ctx.fillStyle = frame;
      ctx.fillRect(x + cellW / 2 - 1, y + 5, 2, cellH - 10);
      ctx.fillRect(x + 5, y + cellH / 2 - 1, cellW - 10, 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.38)';
      ctx.fillRect(x - 1, y + cellH + 2, cellW + 2, 2);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
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
  const { camera } = useThree();
  const lookAt = useRef(vectorFromArray(VIEWPOINTS.rooftop.target));
  const mounted = useRef(false);
  const transition = useRef(null);
  const view = VIEWPOINTS[activeView] || VIEWPOINTS.rooftop;

  useEffect(() => {
    const goalPosition = vectorFromArray(view.position);
    const goalTarget = vectorFromArray(view.target);

    if (mounted.current) return;

    camera.position.copy(goalPosition);
    lookAt.current.copy(goalTarget);
    camera.fov = view.fov;
    camera.lookAt(lookAt.current);
    camera.updateProjectionMatrix();
    mounted.current = true;
  }, [camera, view]);

  useEffect(() => {
    if (!mounted.current) return;

    const goalPosition = vectorFromArray(view.position);
    const goalTarget = vectorFromArray(view.target);

    transition.current = makeCameraRail({
      fromPosition: camera.position.clone(),
      toPosition: goalPosition,
      fromTarget: lookAt.current.clone(),
      toTarget: goalTarget,
      fromFov: camera.fov,
      toFov: view.fov,
    });
  }, [activeView, camera, view]);

  useFrame((_, delta) => {
    if (transition.current) {
      const rail = transition.current;
      rail.elapsed += delta;

      const rawProgress = Math.min(rail.elapsed / rail.duration, 1);
      const easedProgress = easeTrackProgress(rawProgress);

      camera.position.copy(rail.positionCurve.getPoint(easedProgress));
      lookAt.current.copy(rail.targetCurve.getPoint(easedProgress));
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
    const materialTint = new THREE.Color('#c2b783');
    const textureBank = {};

    Object.entries(BUILDING_LOOKS).forEach(([name, look]) => {
      textureBank[name] = makeWindowTexture(look);
    });
    Object.entries(SURFACE_MATERIALS).forEach(([name, look]) => {
      textureBank[name] = makeSurfaceTexture(look);
    });
    Object.values(textureBank).forEach((texture) => {
      texture.anisotropy = gl.capabilities.getMaxAnisotropy?.() || 8;
    });

    const prepareMaterial = (material, object) => {
      const materialName = material.name || '';
      const generatedTexture = textureBank[materialName]?.clone();
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
        const verticalRepeat = Math.max(1, Math.round(size.y / 52));
        const horizontalRepeat = materialName === 'cobblestone_granite'
          ? Math.max(2, Math.round(Math.max(size.x, size.z) / 30))
          : 1;

        generatedTexture.wrapS = THREE.RepeatWrapping;
        generatedTexture.wrapT = THREE.RepeatWrapping;
        generatedTexture.repeat.set(
          BUILDING_MATERIALS.has(materialName) ? 1 : horizontalRepeat,
          BUILDING_MATERIALS.has(materialName) ? verticalRepeat : horizontalRepeat,
        );
        generatedTexture.needsUpdate = true;
        next.map = generatedTexture;
        if (next.color) next.color.set('#ffffff');
      }

      if ('roughness' in next) next.roughness = Math.max(next.roughness ?? 0.8, 0.88);
      if ('metalness' in next) next.metalness = Math.min(next.metalness ?? 0, 0.08);
      if ('envMapIntensity' in next) next.envMapIntensity = 0.04;
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

      if (Array.isArray(object.material)) {
        object.material = object.material.map((material) => prepareMaterial(material, object));
      } else if (object.material) {
        object.material = prepareMaterial(object.material, object);
      }

      if (object.name.startsWith('ped_walk_')) {
        animatedWalkers.push({
          mesh: object,
          axis: object.name.includes('ped_walk_EW_') ? 'x' : 'z',
          speed: 1 + Math.random() * 0.55,
          direction: Math.random() < 0.5 ? -1 : 1,
          phase: Math.random() * Math.PI * 2,
          originY: object.position.y,
        });
      }
    });

    nodesToRemove.forEach((object) => object.parent?.remove(object));

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
  const welcomeTexture = useMemo(() => makeWelcomeTexture(), []);
  const messageTexture = useMemo(() => makeMessageTexture(), []);

  useEffect(() => {
    photoTexture.colorSpace = THREE.SRGBColorSpace;
    photoTexture.anisotropy = 8;
    photoTexture.needsUpdate = true;
  }, [photoTexture]);

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
          <meshBasicMaterial map={photoTexture} toneMapped={false} side={THREE.DoubleSide} />
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

function ViewMarker({ hotspot, isActive, onSelectView }) {
  const group = useRef(null);
  const ringMaterial = useMemo(
    () => new THREE.MeshBasicMaterial({
      color: hotspot.color,
      transparent: true,
      opacity: 0.42,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
    [hotspot.color],
  );
  const discMaterial = useMemo(
    () => new THREE.MeshBasicMaterial({
      color: isActive ? '#f4e7bd' : hotspot.color,
      transparent: true,
      opacity: isActive ? 0.92 : 0.72,
      depthWrite: false,
    }),
    [hotspot.color, isActive],
  );
  const { camera, gl } = useThree();

  useFrame(({ clock }) => {
    if (!group.current) return;
    group.current.lookAt(camera.position);
    const pulse = Math.sin(clock.elapsedTime * 2.4) * 0.08;
    group.current.scale.setScalar((isActive ? 1.32 : 1) + pulse);
  });

  return (
    <group
      ref={group}
      position={hotspot.position}
      onClick={(event) => {
        event.stopPropagation();
        onSelectView(hotspot.id);
      }}
      onPointerOver={(event) => {
        event.stopPropagation();
        gl.domElement.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        gl.domElement.style.cursor = '';
      }}
    >
      <mesh material={ringMaterial}>
        <ringGeometry args={[1.55, 1.88, 36]} />
      </mesh>
      <mesh material={discMaterial} position={[0, 0, 0.02]}>
        <circleGeometry args={[0.64, 36]} />
      </mesh>
      <mesh position={[0, -1.4, -0.02]}>
        <boxGeometry args={[0.12, 2.8, 0.12]} />
        <meshBasicMaterial color="#241d1a" transparent opacity={0.62} depthWrite={false} />
      </mesh>
    </group>
  );
}

function ViewMarkers({ activeView, onSelectView }) {
  return HOTSPOTS.map((hotspot) => (
    <ViewMarker
      key={hotspot.id}
      hotspot={hotspot}
      isActive={hotspot.id === activeView}
      onSelectView={onSelectView}
    />
  ));
}

function RooftopForeground() {
  return (
    <group position={[112, 58.8, -151]} rotation={[0, -0.8, 0]}>
      <mesh receiveShadow>
        <boxGeometry args={[52, 0.42, 25]} />
        <meshStandardMaterial color="#5c5748" roughness={0.95} metalness={0.02} />
      </mesh>
      <mesh position={[0, 1.1, -11.2]} receiveShadow castShadow>
        <boxGeometry args={[53.5, 2.2, 1.05]} />
        <meshStandardMaterial color="#776e5b" roughness={0.9} metalness={0.02} />
      </mesh>
      <mesh position={[0, 2.38, -11.2]} receiveShadow castShadow>
        <boxGeometry args={[54.2, 0.28, 1.32]} />
        <meshStandardMaterial color="#a0ad9f" roughness={0.76} metalness={0.05} />
      </mesh>
      <mesh position={[-17, 0.72, 4.7]} receiveShadow castShadow>
        <boxGeometry args={[5.4, 1.05, 4.2]} />
        <meshStandardMaterial color="#4a443a" roughness={0.92} metalness={0.02} />
      </mesh>
      <mesh position={[18, 0.72, 2.4]} receiveShadow castShadow>
        <boxGeometry args={[3.4, 1.05, 3.4]} />
        <meshStandardMaterial color="#6a604d" roughness={0.9} metalness={0.02} />
      </mesh>
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
      <CameraRig activeView={activeView} />
      <ambientLight intensity={0.34} color="#d2c9aa" />
      <hemisphereLight args={['#e0d4ac', '#302825', 1.08]} />
      <directionalLight position={[30, 72, -18]} intensity={2.4} color="#ffe0ae" />
      <directionalLight position={[-36, 24, 28]} intensity={0.52} color="#8fc7df" />
      <pointLight position={[105, 68, -144]} intensity={18} distance={54} color="#f0d29a" />
      <Suspense fallback={null}>
        <WallStreetBackdrop />
        <RooftopForeground />
        <Billboard3D onSelectView={onSelectView} />
        <ViewMarkers activeView={activeView} onSelectView={onSelectView} />
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
