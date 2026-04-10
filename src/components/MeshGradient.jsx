import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const GradientPlane = () => {
    const meshRef = useRef();

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uColor1: { value: new THREE.Color('#1a1a2e') },
        uColor2: { value: new THREE.Color('#4a90a4') },
        uColor3: { value: new THREE.Color('#7b68ee') },
        uColor4: { value: new THREE.Color('#20b2aa') },
        uColor5: { value: new THREE.Color('#2d1b69') },
    }), []);

    const vertexShader = `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `;

    const fragmentShader = `
        uniform float uTime;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform vec3 uColor3;
        uniform vec3 uColor4;
        uniform vec3 uColor5;
        varying vec2 vUv;

        // Simplex-style noise
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

        float snoise(vec2 v) {
            const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                               -0.577350269189626, 0.024390243902439);
            vec2 i  = floor(v + dot(v, C.yy));
            vec2 x0 = v - i + dot(i, C.xx);
            vec2 i1;
            i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
            vec4 x12 = x0.xyxy + C.xxzz;
            x12.xy -= i1;
            i = mod289(i);
            vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                + i.x + vec3(0.0, i1.x, 1.0));
            vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy),
                dot(x12.zw, x12.zw)), 0.0);
            m = m * m;
            m = m * m;
            vec3 x = 2.0 * fract(p * C.www) - 1.0;
            vec3 h = abs(x) - 0.5;
            vec3 ox = floor(x + 0.5);
            vec3 a0 = x - ox;
            m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
            vec3 g;
            g.x = a0.x * x0.x + h.x * x0.y;
            g.yz = a0.yz * x12.xz + h.yz * x12.yw;
            return 130.0 * dot(m, g);
        }

        void main() {
            float t = uTime * 0.08;

            // Layered noise for organic movement
            float n1 = snoise(vUv * 2.0 + vec2(t * 0.7, t * 0.5));
            float n2 = snoise(vUv * 3.5 + vec2(-t * 0.4, t * 0.8));
            float n3 = snoise(vUv * 1.5 + vec2(t * 0.3, -t * 0.6));

            // Blend noise into UV distortion
            vec2 distorted = vUv + vec2(n1 * 0.15, n2 * 0.15);

            // Create gradient regions
            float region1 = smoothstep(0.0, 1.0, distorted.x + n3 * 0.3);
            float region2 = smoothstep(0.0, 1.0, distorted.y + n1 * 0.3);
            float region3 = smoothstep(0.2, 0.8, sin(distorted.x * 3.14 + t) * 0.5 + 0.5);

            // Mix colors through regions
            vec3 color = mix(uColor1, uColor2, region1);
            color = mix(color, uColor3, region2 * 0.6);
            color = mix(color, uColor4, region3 * 0.4);
            color = mix(color, uColor5, (n1 * 0.5 + 0.5) * 0.3);

            // Subtle vignette
            float vignette = 1.0 - length((vUv - 0.5) * 1.2);
            vignette = smoothstep(0.0, 0.7, vignette);
            color *= 0.85 + vignette * 0.15;

            gl_FragColor = vec4(color, 1.0);
        }
    `;

    useFrame((_, delta) => {
        if (meshRef.current) {
            meshRef.current.material.uniforms.uTime.value += delta;
        }
    });

    return (
        <mesh ref={meshRef}>
            <planeGeometry args={[2, 2]} />
            <shaderMaterial
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
            />
        </mesh>
    );
};

const MeshGradient = () => {
    useEffect(() => {
        document.body.style.backgroundColor = 'transparent';
        return () => { document.body.style.backgroundColor = ''; };
    }, []);

    return (
    <div style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
    }}>
        <Canvas
            camera={{ position: [0, 0, 1], fov: 90 }}
            gl={{ antialias: false, alpha: false }}
            dpr={[1, 1.5]}
        >
            <GradientPlane />
        </Canvas>
    </div>
    );
};

export default MeshGradient;
