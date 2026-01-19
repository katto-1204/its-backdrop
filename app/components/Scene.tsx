'use client';

import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader, MathUtils, Mesh, Group, Color } from 'three';
import { Suspense, useRef, useMemo } from 'react';
import { Float, ScrollControls, useScroll, Icosahedron } from '@react-three/drei';

function Logo() {
    const texture = useLoader(TextureLoader, '/crossblazersjumpstart.png');
    const groupRef = useRef<Group>(null);
    const scrollData = useScroll();

    useFrame((state) => {
        if (!groupRef.current) return;

        // Scroll interaction
        const targetRotationY = scrollData.offset * -Math.PI;

        // Mouse interaction
        const mouseX = state.mouse.x * 0.2;
        const mouseY = state.mouse.y * 0.2;

        // Smooth rotation
        groupRef.current.rotation.y = MathUtils.lerp(groupRef.current.rotation.y, targetRotationY + mouseX, 0.05);
        groupRef.current.rotation.x = MathUtils.lerp(groupRef.current.rotation.x, -mouseY, 0.05);
    });

    return (
        <group ref={groupRef}>
            <Float speed={2} rotationIntensity={0} floatIntensity={0.5} floatingRange={[-0.2, 0.2]}>
                <mesh>
                    <planeGeometry args={[9, 6.75]} />
                    <meshBasicMaterial map={texture} transparent toneMapped={false} />
                </mesh>
            </Float>
        </group>
    );
}

function GeometricBackground() {
    const meshRef = useRef<Mesh>(null);
    const meshRef2 = useRef<Mesh>(null);

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.x += delta * 0.05;
            meshRef.current.rotation.y += delta * 0.05;
        }
        if (meshRef2.current) {
            meshRef2.current.rotation.x -= delta * 0.03;
            meshRef2.current.rotation.y -= delta * 0.03;
        }
    });

    return (
        <>
            <color attach="background" args={['#0a0000']} />
            <fog attach="fog" args={['#0a0000', 5, 30]} />

            {/* Large Wireframe Sphere/Icosahedron */}
            <mesh ref={meshRef} scale={[20, 20, 20]}>
                <icosahedronGeometry args={[1, 2]} />
                <meshBasicMaterial wireframe color="#b91c1c" transparent opacity={0.15} />
            </mesh>

            {/* Inner Wireframe Layer */}
            <mesh ref={meshRef2} scale={[15, 15, 15]}>
                <icosahedronGeometry args={[1, 1]} />
                <meshBasicMaterial wireframe color="#ff0000" transparent opacity={0.1} />
            </mesh>
        </>
    );
}

export default function Scene() {
    return (
        <div className="w-full h-full absolute inset-0 z-0">
            <Canvas camera={{ position: [0, 0, 12], fov: 45 }} gl={{ antialias: true, alpha: true }}>
                <ambientLight intensity={1} />

                <GeometricBackground />

                <ScrollControls pages={2} damping={0.2}>
                    <Suspense fallback={null}>
                        <Logo />
                    </Suspense>
                </ScrollControls>
            </Canvas>
        </div>
    );
}
