'use client';

import { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';

function Particles() {
    const ref = useRef<any>();
    const [sphere] = useState(() => {
        // Optimized 800 points instead of 3000 for smooth 60fps performance
        const count = 800;
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 15;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 15;
        }
        return positions;
    });

    useFrame((state, delta) => {
        if (ref.current) {
            const safeDelta = Math.min(delta, 0.1);
            ref.current.rotation.y -= safeDelta / 12;
            ref.current.rotation.x -= safeDelta / 18;
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled={true}>
                <PointMaterial transparent color="#FF0036" size={0.035} sizeAttenuation={true} depthWrite={false} opacity={0.35} />
            </Points>
        </group>
    );
}

export default function ParticleBackground() {
    const [useCssMesh, setUseCssMesh] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const isMobile = window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches;
            const isLowPower = navigator.hardwareConcurrency ? navigator.hardwareConcurrency <= 4 : false;
            setUseCssMesh(isMobile || isLowPower);
        }
    }, []);

    // Low-overhead CSS radial mesh for mobile / low-power devices
    if (useCssMesh) {
        return (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,0,54,0.12),transparent_70%)] animate-pulse" style={{ animationDuration: '4s' }} />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(0,229,255,0.08),transparent_60%)]" />
                <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" />
            </div>
        );
    }

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-60">
            <Canvas camera={{ position: [0, 0, 5], fov: 60 }} gl={{ powerPreference: 'low-power', antialias: false }}>
                <Particles />
            </Canvas>
        </div>
    );
}

