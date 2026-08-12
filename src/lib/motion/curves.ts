export const curves = {
    easeOutQuint: [0.22, 1, 0.36, 1] as const,
    easeInOutCubic: [0.65, 0, 0.35, 1] as const,
    sharp: [0.4, 0, 0.2, 1] as const,
    standard: [0.2, 0, 0, 1] as const,
};

export const springs = {
    gentle: { stiffness: 120, damping: 14 },
    snappy: { stiffness: 300, damping: 24 },
    bouncy: { stiffness: 400, damping: 10 },
};
