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
                primary: {
                    50: '#FFF1F0',
                    100: '#FFE0DD',
                    200: '#FFC7C2',
                    300: '#FFA099',
                    400: '#FF6B6B',
                    500: '#E53935',
                    600: '#C62828',
                    700: '#A31D1D',
                    800: '#7F1515',
                    900: '#5C1010',
                    950: '#3A0808',
                },
                gold: {
                    50: '#FFFBEB',
                    100: '#FFF3C4',
                    200: '#FFE68A',
                    300: '#FFD54F',
                    400: '#FFCA28',
                    500: '#FFB300',
                    600: '#FF8F00',
                    700: '#E65100',
                    800: '#BF360C',
                    900: '#8D2000',
                    950: '#5F1500',
                },
                accent: {
                    50: '#E3F2FD',
                    100: '#BBDEFB',
                    200: '#90CAF9',
                    300: '#64B5F6',
                    400: '#42A5F5',
                    500: '#1E88E5',
                    600: '#1565C0',
                    700: '#0D47A1',
                    800: '#0A3678',
                    900: '#072550',
                    950: '#041428',
                },
                success: {
                    50: '#E8F5E9',
                    400: '#66BB6A',
                    500: '#4CAF50',
                    600: '#2E7D32',
                },
                warning: {
                    50: '#FFF8E1',
                    400: '#FFCA28',
                    500: '#FFC107',
                    600: '#F9A825',
                },
                danger: {
                    50: '#FFEBEE',
                    400: '#EF5350',
                    500: '#F44336',
                    600: '#D32F2F',
                },
                dark: {
                    800: '#1a1a2e',
                    850: '#151525',
                    900: '#10101e',
                    950: '#0a0a16',
                },
            },
            fontFamily: {
                sans: [
                    'Inter',
                    'Noto Sans SC',
                    '-apple-system',
                    'BlinkMacSystemFont',
                    'PingFang SC',
                    'Microsoft YaHei',
                    'SimHei',
                    'sans-serif',
                ],
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out forwards',
                'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
                'fade-in-down': 'fadeInDown 0.4s ease-out forwards',
                'slide-up': 'slideUp 0.5s ease-out forwards',
                'slide-in-right': 'slideInRight 0.5s ease-out forwards',
                'scale-in': 'scaleIn 0.4s ease-out forwards',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
                'float': 'float 6s ease-in-out infinite',
                'shimmer': 'shimmer 2s linear infinite',
                'count-up': 'countUp 0.8s ease-out forwards',
                'glow': 'glow 2s ease-in-out infinite alternate',
                'spin-slow': 'spin 8s linear infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(24px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                fadeInDown: {
                    '0%': { opacity: '0', transform: 'translateY(-16px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(40px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideInRight: {
                    '0%': { opacity: '0', transform: 'translateX(40px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                scaleIn: {
                    '0%': { opacity: '0', transform: 'scale(0.9)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-12px)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
                glow: {
                    '0%': { boxShadow: '0 0 20px rgba(229,57,53,0.3)' },
                    '100%': { boxShadow: '0 0 40px rgba(229,57,53,0.6)' },
                },
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
                'hero-pattern': 'linear-gradient(135deg, #E53935 0%, #C62828 25%, #1E88E5 75%, #0D47A1 100%)',
                'gold-gradient': 'linear-gradient(135deg, #FFB300 0%, #FF8F00 50%, #E65100 100%)',
                'card-gradient': 'linear-gradient(135deg, rgba(229,57,53,0.05) 0%, rgba(30,136,229,0.05) 100%)',
            },
            boxShadow: {
                'glass': '0 8px 32px rgba(0,0,0,0.12)',
                'glass-lg': '0 16px 48px rgba(0,0,0,0.15)',
                'neon-red': '0 0 30px rgba(229,57,53,0.25)',
                'neon-blue': '0 0 30px rgba(30,136,229,0.25)',
                'neon-gold': '0 0 30px rgba(255,179,0,0.25)',
                'inner-glow': 'inset 0 1px 0 rgba(255,255,255,0.1)',
            },
        },
    },
    plugins: [],
};

export default config;
