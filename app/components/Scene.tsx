'use client';

import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame, RootState } from '@react-three/fiber';
import { Mesh, Object3D, MeshStandardMaterial } from 'three';
import { Environment, useGLTF, Float, PresentationControls, useTexture } from '@react-three/drei';

function Model() {
    const { scene } = useGLTF('/bsit_keychain_Keychain_featuring_computer_related_miniatures_Hun.glb');
    const texture = useTexture('/texture.jpg');
    const meshRef = useRef<Mesh>(null);

    // Apply premium metallic properties to all meshes in the model
    React.useMemo(() => {
        texture.flipY = false;
        scene.traverse((child: Object3D) => {
            if (child instanceof Mesh) {
                // Use MeshPhysicalMaterial for advanced clearcoat effects
                const material = new MeshStandardMaterial();
                // Wait, I should probably just modify the existing material but cast it
                // To be safe and performant, I'll modify the existing one.
                const m = child.material as any;
                m.map = texture;
                m.metalness = 1.0;
                m.roughness = 0.15; // Slightly more roughness can actually look smoother by blurring reflections
                m.envMapIntensity = 2.5;

                // Add clearcoat if it's a MeshPhysicalMaterial or just use standard if that's what's there
                // Most GLBs come with Standard. I'll stick to Standard but tune it.
                // If I want real smoothness, maybe the texture map is too high contrast.
                m.color.set('#ffffff'); // Pure white base
                m.needsUpdate = true;
            }
        });
    }, [scene, texture]);

    useFrame((state: RootState, delta: number) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.2;
        }
    });

    return (
        <primitive
            ref={meshRef}
            object={scene}
            scale={5}
            position={[0, -2, 0]}
        />
    );
}

function GeometricBackground() {
    const meshRef = useRef<Mesh>(null);
    const meshRef2 = useRef<Mesh>(null);

    useFrame((state: RootState, delta: number) => {
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
            <Canvas camera={{ position: [0, 0, 10], fov: 45 }} gl={{ antialias: true, alpha: true }}>
                <ambientLight intensity={1} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1.5} color="#ffffff" />
                <pointLight position={[-10, -10, -10]} intensity={1} color="#ffffff" />

                <Environment preset="city" />

                <GeometricBackground />

                <Suspense fallback={null}>
                    <PresentationControls
                        global
                        rotation={[0, 0, 0]}
                    >
                        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                            <Model />
                        </Float>
                    </PresentationControls>
                </Suspense>
            </Canvas>
        </div>
    );
}
