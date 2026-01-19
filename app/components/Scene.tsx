'use client';

import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader, MathUtils, Mesh } from 'three';
import { Suspense, useRef } from 'react';
import { Float, Sparkles } from '@react-three/drei';

function Logo() {
    const texture = useLoader(TextureLoader, '/crossblazersjumpstart.png');
    const meshRef = useRef<Mesh>(null);

    useFrame((state) => {
        if (!meshRef.current) return;

        // Mouse coordinates are normalized (-1 to 1)
        const targetX = state.mouse.x * 0.4; // Rotation sensitivity X
        const targetY = state.mouse.y * 0.4; // Rotation sensitivity Y

        // Smoothly interpolate rotation to target
        meshRef.current.rotation.y = MathUtils.lerp(meshRef.current.rotation.y, targetX, 0.1);
        meshRef.current.rotation.x = MathUtils.lerp(meshRef.current.rotation.x, -targetY, 0.1);
    });

    // 800x600 -> 8x6 units approximately fitting in view
    return (
        <Float speed={2} rotationIntensity={0} floatIntensity={0.5} floatingRange={[-0.2, 0.2]}>
            <mesh ref={meshRef}>
                <planeGeometry args={[9, 6.75]} />
                <meshBasicMaterial map={texture} transparent toneMapped={false} />
            </mesh>
        </Float>
    );
}

export default function Scene() {
    return (
        <div className="w-full h-full absolute inset-0 z-0">
            <Canvas camera={{ position: [0, 0, 12], fov: 45 }} gl={{ antialias: true, alpha: true }}>
                <ambientLight intensity={1} />
                {/* Add some subtle 3D sparkles for "scene" feel */}
                <Sparkles count={50} scale={12} size={4} speed={0.4} opacity={0.5} color="#d40000" />
                <Suspense fallback={null}>
                    <Logo />
                </Suspense>
                {/* OrbitControls removed as it conflicts with mouse-following behavior */}
            </Canvas>
        </div>
    );
}
