'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export function CustomCursor() {
    const cursorDot = useRef<HTMLDivElement>(null);
    const cursorRing = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Only on desktop fine pointers
        if (typeof window === 'undefined' || window.matchMedia('(pointer: coarse)').matches) return;

        setIsVisible(true);

        const xDotTo = gsap.quickTo(cursorDot.current, "x", { duration: 0.1, ease: "none" });
        const yDotTo = gsap.quickTo(cursorDot.current, "y", { duration: 0.1, ease: "none" });
        
        const xRingTo = gsap.quickTo(cursorRing.current, "x", { duration: 0.35, ease: "power3.out" });
        const yRingTo = gsap.quickTo(cursorRing.current, "y", { duration: 0.35, ease: "power3.out" });

        const onMouseMove = (e: MouseEvent) => {
            xDotTo(e.clientX);
            yDotTo(e.clientY);
            xRingTo(e.clientX);
            yRingTo(e.clientY);
        };

        const onMouseDown = () => {
            gsap.to(cursorDot.current, { scale: 0.6, duration: 0.1 });
            gsap.to(cursorRing.current, { scale: 0.8, duration: 0.1 });
        };

        const onMouseUp = () => {
            gsap.to(cursorDot.current, { scale: 1, duration: 0.1 });
            gsap.to(cursorRing.current, { scale: 1, duration: 0.1 });
        };

        const onMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target && (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a, button, [role="button"]'))) {
                gsap.to(cursorRing.current, { 
                    scale: 1.5,
                    backgroundColor: 'rgba(255, 0, 54, 0.15)',
                    borderColor: 'rgba(255, 0, 54, 0.6)',
                    duration: 0.25,
                    overwrite: 'auto'
                });
            }
        };

        const onMouseOut = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target && (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a, button, [role="button"]'))) {
                gsap.to(cursorRing.current, { 
                    scale: 1,
                    backgroundColor: 'transparent',
                    borderColor: 'rgba(255, 0, 54, 0.4)',
                    duration: 0.25,
                    overwrite: 'auto'
                });
            }
        };

        window.addEventListener('mousemove', onMouseMove, { passive: true });
        window.addEventListener('mousedown', onMouseDown, { passive: true });
        window.addEventListener('mouseup', onMouseUp, { passive: true });
        document.addEventListener('mouseover', onMouseOver, { passive: true });
        document.addEventListener('mouseout', onMouseOut, { passive: true });

        // Hide default cursor on desktop
        document.documentElement.style.cursor = 'none';
        const style = document.createElement('style');
        style.setAttribute('id', 'custom-cursor-style');
        style.innerHTML = `a, button, [role="button"] { cursor: none !important; }`;
        document.head.appendChild(style);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mousedown', onMouseDown);
            window.removeEventListener('mouseup', onMouseUp);
            document.removeEventListener('mouseover', onMouseOver);
            document.removeEventListener('mouseout', onMouseOut);
            document.documentElement.style.cursor = 'auto';
            const existingStyle = document.getElementById('custom-cursor-style');
            if (existingStyle) existingStyle.remove();
        };
    }, []);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999]">
            <div 
                ref={cursorDot} 
                className="fixed top-0 left-0 w-2 h-2 bg-[#FF0036] rounded-full -translate-x-1/2 -translate-y-1/2 will-change-transform"
            />
            <div 
                ref={cursorRing} 
                className="fixed top-0 left-0 w-8 h-8 border-2 border-[#FF0036]/40 rounded-full -translate-x-1/2 -translate-y-1/2 will-change-transform"
            />
        </div>
    );
}

