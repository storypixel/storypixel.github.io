import { Suspense, useEffect, useMemo, useRef } from 'react';
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

function CameraRig() {
  const { camera } = useThree();
  const base = useRef(new THREE.Vector3(130, 82, -170));
  const target = useRef(new THREE.Vector3(-38, 62, -8));

  useEffect(() => {
    camera.position.copy(base.current);
    camera.lookAt(target.current);
    camera.updateProjectionMatrix();
  }, [camera]);

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

function Billboard3D() {
  const photoTexture = useTexture(MAN_PHOTO_URL);
  const welcomeTexture = useMemo(() => makeWelcomeTexture(), []);
  const messageTexture = useMemo(() => makeMessageTexture(), []);

  useEffect(() => {
    photoTexture.colorSpace = THREE.SRGBColorSpace;
    photoTexture.anisotropy = 8;
    photoTexture.needsUpdate = true;
  }, [photoTexture]);

  return (
    <group position={[103.5, 66.2, -144]} rotation={[0, 2.36, -0.015]} scale={0.72}>
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

function TickerverseScene() {
  return (
    <Canvas
      camera={{ position: [130, 82, -170], fov: 44, near: 0.1, far: 2200 }}
      gl={{ alpha: false, antialias: true, powerPreference: 'high-performance' }}
      dpr={[1, 1.5]}
      shadows
    >
      <color attach="background" args={['#b9b18f']} />
      <fog attach="fog" args={['#b9b18f', 260, 1650]} />
      <CameraRig />
      <ambientLight intensity={0.34} color="#d2c9aa" />
      <hemisphereLight args={['#e0d4ac', '#302825', 1.08]} />
      <directionalLight position={[30, 72, -18]} intensity={2.4} color="#ffe0ae" />
      <directionalLight position={[-36, 24, 28]} intensity={0.52} color="#8fc7df" />
      <pointLight position={[105, 68, -144]} intensity={18} distance={54} color="#f0d29a" />
      <Suspense fallback={null}>
        <WallStreetBackdrop />
        <RooftopForeground />
        <Billboard3D />
      </Suspense>
    </Canvas>
  );
}

useGLTF.preload(WALL_STREET_SCENE_URL);
useTexture.preload(MAN_PHOTO_URL);

export default function TickerversePromo() {
  useEffect(() => {
    const prev = document.title;
    document.title = 'Tickerverse';
    return () => {
      document.title = prev;
    };
  }, []);

  return (
    <main className="tv-root" aria-label="Tickerverse">
      <div className="tv-skyline" aria-hidden="true">
        <TickerverseScene />
      </div>
      <div className="tv-atmosphere" aria-hidden="true" />
      <div className="tv-grain" aria-hidden="true" />
      <p className="tv-visually-hidden">
        Tickerverse is a destination for both passive and active traders to hone their skills.
      </p>
    </main>
  );
}
