'use client';

import { useReducedMotion as useFramerReducedMotion } from 'framer-motion';

export function useReducedMotion(): boolean {
    const shouldReduceMotion = useFramerReducedMotion();
    return Boolean(shouldReduceMotion);
}
