/* eslint-disable react/no-unknown-property */
import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, useTexture, Environment, Stage, Float } from '@react-three/drei';
import * as THREE from 'three';

const PhoneModel = ({ screenshots }) => {
    const group = useRef();
    const [index, setIndex] = useState(0);
    const [isSpinning, setIsSpinning] = useState(false);
    const spinProgress = useRef(0);

    // Load model and texture
    const { scene } = useGLTF('/models/iphone.glb');

    // Determine current texture
    const textureUrl = screenshots && screenshots.length > 0 ? screenshots[index] : null;

    // Use a placeholder if no texture, but try-catch in case of load error?
    // useTexture will suspend.
    const texture = useTexture(textureUrl || '/images/calcuweighter-main.png');

    // Set texture properties immediately
    if (texture) {
        texture.flipY = true;
        texture.center.set(0, 0);
        texture.rotation = 0;
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.needsUpdate = true;
    }

    // Cycle screenshots
    useEffect(() => {
        if (!screenshots || screenshots.length === 0) return;
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % screenshots.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [screenshots]);

    // Apply material logic
    useEffect(() => {
        if (!scene) return;

        scene.traverse((child) => {
            if (child.isMesh) {
                const name = child.name ? child.name.toLowerCase() : '';
                const matName = child.material && child.material.name ? child.material.name : '';

                // Log for debugging if needed (check console)
                // console.log('Traverse:', name, matName);

                // Screen detection logic
                if (
                    name.includes('scr_') ||
                    name.includes('screen') ||
                    name.includes('display') ||
                    name.includes('object.010') ||
                    matName === 'material_10'
                ) {
                    // Use MeshBasicMaterial for unlit screen - no lighting affects it
                    const screenMat = new THREE.MeshBasicMaterial({
                        map: texture,
                        color: new THREE.Color(1.0, 1.0, 1.0) // Pure white multiplier
                    });
                    screenMat.toneMapped = false; // Bypass any tone mapping
                    child.material = screenMat;
                }
                // Body detection logic for better PBR
                else if (
                    name.includes('body') ||
                    name.includes('alu') ||
                    name.includes('bezel') ||
                    name.includes('object.001') ||
                    name.includes('object.006')
                ) {
                    child.material.toneMapped = false;
                    child.material.roughness = 0.2;
                    child.material.metalness = 1.0;
                    child.material.color.set(0x1c1c1e);
                    child.material.envMapIntensity = 1.5;
                }
            }
        });
    }, [scene, texture]);

    // Animation loop
    useFrame((state) => {
        if (!group.current) return;
        const time = state.clock.elapsedTime;

        // Base rotation
        const baseTiltX = -0.15;
        const baseTiltY = Math.PI - 0.3;
        const baseTiltZ = Math.PI;

        // Floating
        const floatX = Math.sin(time * 0.5) * 0.05;
        const floatY = Math.sin(time * 0.7) * 0.1;
        const floatZ = Math.sin(time * 0.3) * 0.02;

        if (isSpinning) {
            spinProgress.current += 0.02;
            const spinY = Math.sin(spinProgress.current * Math.PI) * Math.PI * 2;
            if (spinProgress.current >= 1) {
                setIsSpinning(false);
                spinProgress.current = 0;
            }
            group.current.rotation.set(baseTiltX + floatX, baseTiltY + floatY + spinY, baseTiltZ + floatZ);
        } else {
            group.current.rotation.set(baseTiltX + floatX, baseTiltY + floatY, baseTiltZ + floatZ);
        }
    });

    const handleClick = () => {
        if (!isSpinning) {
            setIsSpinning(true);
            spinProgress.current = 0;
        }
    };

    return (
        <group ref={group} onClick={handleClick} dispose={null}>
            {/* 
                Scale adjustment: usually iPhone models are in unknown units. 
                Stage will handle normalization, but we need to ensure orientation is correct.
             */}
            <primitive object={scene} rotation={[-Math.PI / 2, 0, 0]} />
        </group>
    );
};

const Phone3D = ({ screenshots }) => {
    // If no screenshots, don't crash, just show what we have
    if (!screenshots && !window.location.href.includes('localhost')) return null;

    return (
        <div style={{ width: '100%', height: '100%', minHeight: '600px', cursor: 'grab' }}>
            <Canvas
                gl={{
                    preserveDrawingBuffer: true,
                    alpha: true,
                    toneMapping: THREE.NoToneMapping
                }}
                dpr={[1, 2]}
            >
                <Suspense fallback={null}>
                    {/* Stage creates a nice studio environment and centers/scales the model */}
                    <Stage environment="city" intensity={1.0} adjustCamera={1.2}>
                        <PhoneModel screenshots={screenshots} />
                    </Stage>
                </Suspense>
            </Canvas>
        </div>
    );
};

useGLTF.preload('/models/iphone.glb');

export default Phone3D;
