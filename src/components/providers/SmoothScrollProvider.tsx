'use client';

import { ReactLenis } from 'lenis/react';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  const lenisRef = useRef<any>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    try {
      if (typeof window !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
      }

      const lenis = lenisRef.current?.lenis;
      if (!lenis) return;

      const updateScrollTrigger = () => {
        try {
          ScrollTrigger.update();
        } catch (_) {}
      };

      lenis.on('scroll', updateScrollTrigger);
      gsap.ticker.lagSmoothing(0);

      return () => {
        try {
          lenis.off('scroll', updateScrollTrigger);
        } catch (_) {}
      };
    } catch (err) {
      console.warn('[Lenis] Smooth scroll initialization warning:', err);
    }
  }, [isMounted]);

  // Render children normally before mount to prevent hydration mismatch or crash
  if (!isMounted) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      ref={lenisRef}
      root
      options={{
        lerp: 0.08,
        duration: 1.2,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.5,
        infinite: false,
      }}
    >
      {children}
    </ReactLenis>
  );
}
