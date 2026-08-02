'use client';

import { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';

function Particles() {
    const ref = useRef<any>();
    const [sphere] = useState(() => {
        // Optimized 800 points instead of 3000 for smooth 60fps performance on mobile
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
            // Cap delta to prevent huge jumps after tab switching
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
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsMobile(window.innerWidth < 768);
        }
    }, []);

    // Disable 3D WebGL context completely on mobile to save CPU/battery and eliminate UI lag
    if (isMobile) {
        return (
            <div className="absolute inset-0 bg-gradient-to-b from-[#FF0036]/5 via-transparent to-transparent pointer-events-none" />
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
