'use client';

import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame, RootState, useThree } from '@react-three/fiber';
import { Mesh, Object3D, MeshStandardMaterial, MeshPhysicalMaterial } from 'three';
import { Environment, useGLTF, Float, PresentationControls } from '@react-three/drei';

function Model() {
    const { scene } = useGLTF('/bsit_keychain_Keychain_featuring_computer_related_miniatures_Hun.glb');
    const { viewport } = useThree();
    const meshRef = useRef<Mesh>(null);

    // Responsive scaling based on viewport width
    const responsiveScale = Math.min(viewport.width / 4, 4);

    // Apply premium chrome properties to all meshes in the model
    React.useMemo(() => {
        scene.traverse((child: Object3D) => {
            if (child instanceof Mesh) {
                // Use MeshPhysicalMaterial for a high-end chrome finish
                const newMaterial = new MeshPhysicalMaterial({
                    color: '#ffffff',
                    metalness: 1.0,
                    roughness: 0.02,      // Mirror-like smoothness
                    envMapIntensity: 4.0, // Brighter reflections
                    clearcoat: 1.0,       // Outer smooth layer
                    clearcoatRoughness: 0.0,
                    flatShading: false
                });

                // If there was a texture, we skip applying it to the map 
                // to maintain the clean silver look from the Blender reference.
                child.material = newMaterial;
            }
        });
    }, [scene]);

    useFrame((state: RootState, delta: number) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.2;
        }
    });

    return (
        <primitive
            ref={meshRef}
            object={scene}
            scale={responsiveScale}
            position={[0, -1.5, 0]}
        />
    );
}


export default function Scene() {
    return (
        <div className="w-full h-full absolute inset-0 z-0">
            <Canvas camera={{ position: [0, 0, 10], fov: 45 }} gl={{ antialias: true, alpha: true }}>
                <ambientLight intensity={1.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} color="#ffffff" />
                <pointLight position={[-10, -10, -10]} intensity={1.5} color="#ffffff" />

                <Environment preset="city" />


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
