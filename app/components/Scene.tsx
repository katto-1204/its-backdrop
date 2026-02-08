'use client';

import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame, RootState, useThree } from '@react-three/fiber';
import { Mesh, Object3D, MeshStandardMaterial, MeshPhysicalMaterial, WebGLRenderer } from 'three';
import { Environment, useGLTF, Float, PresentationControls } from '@react-three/drei';

function Model({ rotationSpeed = 1.0 }: { rotationSpeed?: number }) {
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
            // Apply the rotationSpeed multiplier to the base rotation speed
            meshRef.current.rotation.y += delta * 0.2 * rotationSpeed;
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


function SceneManager({ bgMode, isRecording }: { bgMode: string, isRecording: boolean }) {
    const { gl } = useThree();

    React.useEffect(() => {
        if (bgMode === 'transparent') {
            gl.setClearColor(0xffffff, 0);
            gl.setClearAlpha(0);
        } else if (bgMode === 'green') {
            gl.setClearColor(0x00ff00, 1);
            gl.setClearAlpha(1);
        } else if (bgMode === 'white') {
            gl.setClearColor(0xffffff, 1);
            gl.setClearAlpha(1);
        } else {
            gl.setClearColor(0x000000, 1);
            gl.setClearAlpha(1);
        }
        gl.clear();
    }, [gl, bgMode]);

    return null;
}

export default function Scene({ rotationSpeed = 1.0, isRecording = false, bgMode = 'black' }: { rotationSpeed?: number, isRecording?: boolean, bgMode?: 'transparent' | 'green' | 'black' | 'white' }) {
    return (
        <div className="w-full h-full absolute inset-0 z-0">
            <Canvas
                camera={{ position: [0, 0, 10], fov: 45 }}
                gl={{
                    antialias: true,
                    alpha: true,
                    preserveDrawingBuffer: true,
                    premultipliedAlpha: false
                }}
            >
                <SceneManager bgMode={bgMode} isRecording={isRecording} />
                <ambientLight intensity={bgMode === 'white' ? 0.5 : 1.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} color="#ffffff" />
                <pointLight position={[-10, -10, -10]} intensity={bgMode === 'white' ? 0.5 : 1.5} color="#ffffff" />

                <Environment preset="city" background={false} />

                {bgMode === 'black' && !isRecording && <fog attach="fog" args={['#000000', 5, 30]} />}

                <Suspense fallback={null}>
                    <PresentationControls
                        global
                        rotation={[0, 0, 0]}
                    >
                        <Model rotationSpeed={rotationSpeed} />
                    </PresentationControls>
                </Suspense>
            </Canvas>
        </div>
    );
}
