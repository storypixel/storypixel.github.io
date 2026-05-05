import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stage, useGLTF, useTexture } from '@react-three/drei';
import * as THREE from 'three';

const DEFAULT_SCREENSHOTS = ['/images/calcuweight-main.png'];

const isScreenMesh = (mesh) => {
    const name = mesh.name?.toLowerCase() ?? '';
    const materialName = mesh.material?.name ?? '';

    return (
        name.includes('scr_') ||
        name.includes('screen') ||
        name.includes('display') ||
        name.includes('object.010') ||
        materialName === 'material_10'
    );
};

const isBodyMesh = (mesh) => {
    const name = mesh.name?.toLowerCase() ?? '';

    return (
        name.includes('body') ||
        name.includes('alu') ||
        name.includes('bezel') ||
        name.includes('object.001') ||
        name.includes('object.006')
    );
};

const prepareScreenTexture = (texture) => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;
    texture.needsUpdate = true;
};

const PhoneModel = ({ screenshots }) => {
    const group = useRef();
    const isSpinning = useRef(false);
    const [index, setIndex] = useState(0);
    const spinProgress = useRef(0);
    const screenUrls = useMemo(
        () => (screenshots?.length ? screenshots : DEFAULT_SCREENSHOTS),
        [screenshots],
    );

    const { scene } = useGLTF('/models/iphone.glb');
    const textures = useTexture(screenUrls, (loadedTextures) => {
        const loadedList = Array.isArray(loadedTextures) ? loadedTextures : Object.values(loadedTextures);
        loadedList.forEach(prepareScreenTexture);
    });
    const activeTexture = textures[index % textures.length];

    const phoneScene = useMemo(() => {
        const clone = scene.clone(true);

        clone.traverse((child) => {
            if (!child.isMesh) return;

            child.frustumCulled = false;

            if (child.material) {
                child.material = child.material.clone();
            }

            if (isBodyMesh(child) && child.material) {
                child.material.toneMapped = false;
                child.material.roughness = 0.24;
                child.material.metalness = 1;
                child.material.color.set(0x1c1c1e);
            }
        });

        return clone;
    }, [scene]);

    useEffect(() => {
        if (screenUrls.length <= 1) return undefined;

        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % screenUrls.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [screenUrls]);

    useEffect(() => {
        const screenMaterial = new THREE.MeshBasicMaterial({
            map: activeTexture,
            color: 0xffffff,
            toneMapped: false,
        });

        phoneScene.traverse((child) => {
            if (child.isMesh && isScreenMesh(child)) {
                child.material = screenMaterial;
            }
        });

        return () => screenMaterial.dispose();
    }, [activeTexture, phoneScene]);

    useFrame((state) => {
        if (!group.current) return;

        const time = state.clock.elapsedTime;

        const baseTiltX = -0.15;
        const baseTiltY = Math.PI - 0.3;
        const baseTiltZ = Math.PI;
        const floatX = Math.sin(time * 0.5) * 0.05;
        const floatY = Math.sin(time * 0.7) * 0.1;
        const floatZ = Math.sin(time * 0.3) * 0.02;

        if (isSpinning.current) {
            spinProgress.current += 0.02;

            const spinY = Math.sin(spinProgress.current * Math.PI) * Math.PI * 2;

            if (spinProgress.current >= 1) {
                isSpinning.current = false;
                spinProgress.current = 0;
            }

            group.current.rotation.set(baseTiltX + floatX, baseTiltY + floatY + spinY, baseTiltZ + floatZ);
        } else {
            group.current.rotation.set(baseTiltX + floatX, baseTiltY + floatY, baseTiltZ + floatZ);
        }
    });

    const handleClick = () => {
        if (!isSpinning.current) {
            isSpinning.current = true;
            spinProgress.current = 0;
        }
    };

    return (
        <group ref={group} onClick={handleClick} dispose={null}>
            <primitive object={phoneScene} rotation={[-Math.PI / 2, 0, 0]} scale={2.9} />
        </group>
    );
};

const Phone3D = ({ screenshots }) => {
    return (
        <div className="phone-3d" role="img" aria-label="Rotating Calcuweight app preview on an iPhone">
            <Canvas
                gl={{
                    alpha: true,
                    antialias: true,
                    powerPreference: 'high-performance',
                    toneMapping: THREE.NoToneMapping,
                }}
                dpr={[1, 1.5]}
                resize={{ debounce: 80 }}
            >
                <Suspense fallback={null}>
                    <Stage environment="city" intensity={1} adjustCamera={0.9} shadows={false}>
                        <PhoneModel screenshots={screenshots} />
                    </Stage>
                </Suspense>
            </Canvas>
        </div>
    );
};

useGLTF.preload('/models/iphone.glb');
useTexture.preload(DEFAULT_SCREENSHOTS);

export default Phone3D;
