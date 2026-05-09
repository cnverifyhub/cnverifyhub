'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export function CustomCursor() {
    const cursorDot = useRef<HTMLDivElement>(null);
    const cursorRing = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        // Only on desktop
        if (window.matchMedia('(pointer: coarse)').matches) return;

        setIsVisible(true);

        const xDotTo = gsap.quickTo(cursorDot.current, "x", { duration: 0.1, ease: "none" });
        const yDotTo = gsap.quickTo(cursorDot.current, "y", { duration: 0.1, ease: "none" });
        
        const xRingTo = gsap.quickTo(cursorRing.current, "x", { duration: 0.4, ease: "power3" });
        const yRingTo = gsap.quickTo(cursorRing.current, "y", { duration: 0.4, ease: "power3" });

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

        const onMouseEnter = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a') || target.closest('button')) {
                setIsHovered(true);
                gsap.to(cursorRing.current, { 
                    width: 48, 
                    height: 48, 
                    backgroundColor: 'rgba(255, 0, 54, 0.15)',
                    borderColor: 'rgba(255, 0, 54, 0.6)',
                    duration: 0.3 
                });
            }
        };

        const onMouseLeave = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a') || target.closest('button')) {
                setIsHovered(false);
                gsap.to(cursorRing.current, { 
                    width: 32, 
                    height: 32, 
                    backgroundColor: 'transparent',
                    borderColor: 'rgba(255, 0, 54, 0.4)',
                    duration: 0.3 
                });
            }
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mouseup', onMouseUp);
        document.addEventListener('mouseover', onMouseEnter);
        document.addEventListener('mouseout', onMouseLeave);

        // Hide default cursor
        document.documentElement.style.cursor = 'none';
        const style = document.createElement('style');
        style.innerHTML = `a, button, [role="button"] { cursor: none !important; }`;
        document.head.appendChild(style);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mousedown', onMouseDown);
            window.removeEventListener('mouseup', onMouseUp);
            document.removeEventListener('mouseover', onMouseEnter);
            document.removeEventListener('mouseout', onMouseLeave);
            document.documentElement.style.cursor = 'auto';
            document.head.removeChild(style);
        };
    }, []);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999]">
            <div 
                ref={cursorDot} 
                className="fixed top-0 left-0 w-2 h-2 bg-[#FF0036] rounded-full -translate-x-1/2 -translate-y-1/2"
            />
            <div 
                ref={cursorRing} 
                className="fixed top-0 left-0 w-8 h-8 border-2 border-[#FF0036]/40 rounded-full -translate-x-1/2 -translate-y-1/2 transition-[width,height,background-color,border-color,border-radius]"
            />
        </div>
    );
}
