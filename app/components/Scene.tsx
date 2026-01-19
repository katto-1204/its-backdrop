'use client';

import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader, MathUtils, Mesh, Group, Color } from 'three';
import { Suspense, useRef, useMemo } from 'react';
import { Float, ScrollControls, useScroll, Icosahedron, Environment, ContactShadows } from '@react-three/drei';

function ThickLogo() {
    const texture = useLoader(TextureLoader, '/crossblazersjumpstart.png');
    const groupRef = useRef<Group>(null);
    const scrollData = useScroll();

    useFrame((state) => {
        if (!groupRef.current) return;

        // Scroll interaction
        const targetRotationY = scrollData.offset * -Math.PI;

        // Mouse interaction
        const mouseX = state.mouse.x * 0.3; // Increased sensitivity
        const mouseY = state.mouse.y * 0.3;

        // Smooth rotation
        groupRef.current.rotation.y = MathUtils.lerp(groupRef.current.rotation.y, targetRotationY + mouseX, 0.05);
        groupRef.current.rotation.x = MathUtils.lerp(groupRef.current.rotation.x, -mouseY, 0.05);
    });

    // Create layers for pseudo-thickness
    const layers = useMemo(() => {
        const layerCount = 10;
        const depth = 0.5; // Total thickness
        return Array.from({ length: layerCount }).map((_, i) => ({
            z: -(i * (depth / layerCount)),
            color: i === 0 ? 'white' : '#500000', // Front is white (original), sides/back are dark red
            isFront: i === 0
        }));
    }, []);

    return (
        <group ref={groupRef}>
            <Float speed={2} rotationIntensity={0} floatIntensity={0.5} floatingRange={[-0.2, 0.2]}>
                {layers.map((layer, index) => (
                    <mesh key={index} position={[0, 0, layer.z]}>
                        <planeGeometry args={[9, 6.75]} />
                        {layer.isFront ? (
                            // Front Face: Shiny, Metallic
                            <meshPhysicalMaterial
                                map={texture}
                                transparent
                                toneMapped={false}
                                roughness={0.2}
                                metalness={0.8}
                                envMapIntensity={1.5}
                                clearcoat={1}
                                clearcoatRoughness={0.1}
                            />
                        ) : (
                            // Side/Back Layers: Dark, matte for "thickness" look
                            <meshBasicMaterial
                                map={texture}
                                transparent
                                toneMapped={false}
                                color={layer.color}
                                opacity={0.8}
                            />
                        )}
                    </mesh>
                ))}
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
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} color="#ff0000" />
                <pointLight position={[-10, -10, -10]} intensity={1} color="#ffffff" />

                {/* Environment for shiny reflections */}
                <Environment preset="city" />

                <GeometricBackground />

                <ScrollControls pages={2} damping={0.2}>
                    <Suspense fallback={null}>
                        <ThickLogo />
                    </Suspense>
                </ScrollControls>
            </Canvas>
        </div>
    );
}
