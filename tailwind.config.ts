import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
        './src/data/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // v3 Cyber Bazaar palette
                cyber: {
                    base:     '#060B18',
                    surface:  '#0D1526',
                    elevated: '#142035',
                    border:   '#1E2D45',
                },
                neon: {
                    red:  '#FF2D55',
                    cyan: '#00E5FF',
                    gold: '#FFB800',
                },
                // Legacy — kept for backward compat
                primary: {
                    50: '#FFF1F0', 100: '#FFE0DD', 200: '#FFC7C2',
                    300: '#FFA099', 400: '#FF6B6B', 500: '#FF2D55',
                    600: '#E0193E', 700: '#B50F2E', 800: '#8B0820',
                    900: '#600514', 950: '#3A0208',
                },
                gold: {
                    50: '#FFFBEB', 100: '#FFF3C4', 200: '#FFE68A',
                    300: '#FFD54F', 400: '#FFCA28', 500: '#FFB800',
                    600: '#E09500', 700: '#B87200', 800: '#8F5200',
                    900: '#663600', 950: '#3D2000',
                },
                accent: {
                    50: '#E0FEFF', 100: '#B3FBFF', 200: '#7CF7FF',
                    300: '#3DEFFF', 400: '#00E5FF', 500: '#00C4DB',
                    600: '#009AB0', 700: '#007385', 800: '#004E5A',
                    900: '#002A30', 950: '#00161A',
                },
                success: {
                    50: '#E8F5E9', 400: '#66BB6A', 500: '#07C160', 600: '#2E7D32',
                },
                dark: {
                    800: '#142035', 850: '#0D1526', 900: '#060B18',
                    950: '#040913', 980: '#020609',
                },
                surface: {
                    glass: 'rgba(255,255,255,0.04)',
                    'glass-border': 'rgba(255,255,255,0.08)',
                },
            },
            fontFamily: {
                sans: ['DM Sans', 'Noto Sans SC', '-apple-system', 'BlinkMacSystemFont', 'PingFang SC', 'Microsoft YaHei', 'sans-serif'],
                syne: ['Syne', 'DM Sans', 'sans-serif'],
                mono: ['JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Consolas', 'monospace'],
                chinese: ['Noto Sans SC', 'PingFang SC', 'Source Han Sans CN', 'Microsoft YaHei', 'SimHei', 'sans-serif'],
            },
            animation: {
                'fade-in':        'fadeIn 0.5s ease-out forwards',
                'fade-in-up':     'fadeInUp 0.6s ease-out forwards',
                'fade-in-down':   'fadeInDown 0.4s ease-out forwards',
                'slide-up':       'slideUp 0.5s ease-out forwards',
                'slide-in-right': 'slideInRight 0.5s ease-out forwards',
                'scale-in':       'scaleIn 0.4s ease-out forwards',
                'pulse-slow':     'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
                'float':          'float 6s ease-in-out infinite',
                'float-card':     'floatCard 4s ease-in-out infinite',
                'shimmer':        'shimmer 2s linear infinite',
                'glow':           'glow 2s ease-in-out infinite alternate',
                'neon-pulse':     'neonPulse 2.5s ease-in-out infinite',
                'neon-cyan':      'neonCyan 2.5s ease-in-out infinite',
                'spin-slow':      'spin 8s linear infinite',
                'ticker-scroll':  'tickerScroll 30s linear infinite',
                'scanline':       'scanline 8s linear infinite',
                'typewriter':     'typewriter 3s steps(40) 1s forwards',
                'cursor-blink':   'cursorBlink 1s step-end infinite',
                'price-update':   'priceUpdate 0.3s ease-out forwards',
                'glow-pulse':     'glowPulse 3s ease-in-out infinite',
            },
            keyframes: {
                fadeIn:       { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
                fadeInUp:     { '0%': { opacity: '0', transform: 'translateY(24px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
                fadeInDown:   { '0%': { opacity: '0', transform: 'translateY(-16px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
                slideUp:      { '0%': { opacity: '0', transform: 'translateY(40px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
                slideInRight: { '0%': { opacity: '0', transform: 'translateX(40px)' }, '100%': { opacity: '1', transform: 'translateX(0)' } },
                scaleIn:      { '0%': { opacity: '0', transform: 'scale(0.9)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
                float:        { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-12px)' } },
                floatCard:    { '0%, 100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-8px)' } },
                shimmer:      { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
                glow:         { '0%': { boxShadow: '0 0 20px rgba(255,45,85,0.3)' }, '100%': { boxShadow: '0 0 40px rgba(255,45,85,0.6)' } },
                tickerScroll: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
                neonPulse:    { '0%, 100%': { boxShadow: '0 0 10px rgba(255,45,85,0.3)' }, '50%': { boxShadow: '0 0 25px rgba(255,45,85,0.7), 0 0 50px rgba(255,45,85,0.3)' } },
                neonCyan:     { '0%, 100%': { boxShadow: '0 0 10px rgba(0,229,255,0.2)' }, '50%': { boxShadow: '0 0 25px rgba(0,229,255,0.6), 0 0 50px rgba(0,229,255,0.25)' } },
                glowPulse:    { '0%, 100%': { opacity: '0.6' }, '50%': { opacity: '1' } },
                scanline: {
                    '0%': { transform: 'translateY(-100%)' },
                    '100%': { transform: 'translateY(100vh)' },
                },
                typewriter: {
                    '0%': { width: '0' },
                    '100%': { width: '100%' },
                },
                cursorBlink: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0' },
                },
                priceUpdate: {
                    '0%': { opacity: '0', transform: 'translateY(-8px) scale(0.95)' },
                    '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
                },
                iconBounce: {
                    '0%': { transform: 'translateY(0) scale(1)' },
                    '30%': { transform: 'translateY(-8px) scale(1.08)' },
                    '100%': { transform: 'translateY(-4px) scale(1.05)' },
                },
            },
            backgroundImage: {
                'gradient-radial':  'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic':   'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
                'cyber-grid':       "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Cpath d='M 40 0 L 0 0 0 40' fill='none' stroke='rgba(30,45,69,0.6)' stroke-width='1'/%3E%3C/svg%3E\")",
                'hero-pattern':     'linear-gradient(135deg, #FF2D55 0%, #C62828 50%, #1E88E5 100%)',
                'gold-gradient':    'linear-gradient(135deg, #FFB800 0%, #FF8F00 100%)',
                'card-shimmer':     'linear-gradient(90deg, transparent 0%, rgba(0,229,255,0.04) 50%, transparent 100%)',
            },
            boxShadow: {
                'glass':       '0 8px 32px rgba(0,0,0,0.12)',
                'glass-lg':    '0 16px 48px rgba(0,0,0,0.15)',
                'glass-heavy': '0 24px 64px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
                'neon-red':    '0 0 20px rgba(255,45,85,0.5), 0 0 40px rgba(255,45,85,0.2)',
                'neon-red-sm': '0 0 12px rgba(255,45,85,0.4)',
                'neon-cyan':   '0 0 20px rgba(0,229,255,0.4), 0 0 40px rgba(0,229,255,0.15)',
                'neon-cyan-sm':'0 0 10px rgba(0,229,255,0.35)',
                'neon-gold':   '0 0 20px rgba(255,184,0,0.4), 0 0 40px rgba(255,184,0,0.15)',
                'data-panel':  '0 1px 0 rgba(255,255,255,0.04), inset 0 0 0 1px rgba(30,45,69,1)',
                'card-hover':  '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,229,255,0.15)',
                'inner-glow':  'inset 0 1px 0 rgba(255,255,255,0.06)',
            },
        },
    },
    plugins: [],
};

export default config;
