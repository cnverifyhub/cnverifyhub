'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Check, ShieldCheck } from 'lucide-react';
import Image from 'next/image';

export default function GatePage() {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!password.trim()) return;

        setLoading(true);
        setError(false);

        try {
            const res = await fetch('/api/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password }),
            });

            const data = await res.json();

            if (data.success) {
                setIsSuccess(true);
                // Fast redirect after showing the cool animation
                setTimeout(() => {
                    window.location.href = '/';
                }, 1000);
            } else {
                setError(true);
                setPassword('');
            }
        } catch (err) {
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    return (
        <div className="fixed inset-0 z-[100] min-h-screen w-full flex items-center justify-center overflow-hidden bg-slate-900">
            {/* Background Image - Mountain HD style */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000&auto=format&fit=crop"
                    alt="Mountain Landscape"
                    fill
                    className="object-cover opacity-80"
                    priority
                />
                {/* Subtle blue/grey tint overlay to match the screenshot vibe */}
                <div className="absolute inset-0 bg-slate-800/20 backdrop-blur-[2px]"></div>

                {/* Vignette effect */}
                <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.5)] z-10"></div>
            </div>

            {/* Centered Login Box */}
            <div className="relative z-20 w-full max-w-sm px-4">
                <div
                    className={`relative flex items-center bg-white/90 backdrop-blur-md rounded-full shadow-2xl overflow-hidden transition-all duration-300 border ${error ? 'border-red-400 max-w-sm mx-auto animate-shake' : 'border-white/20'
                        }`}
                >
                    <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setError(false);
                        }}
                        onKeyDown={handleKeyDown}
                        placeholder={error ? "密码错误, 请重试" : "输入访问密码"}
                        disabled={loading}
                        className={`w-full bg-transparent border-none py-3.5 pl-6 pr-12 text-sm md:text-base outline-none disabled:opacity-50 transition-colors ${error ? 'text-red-500 placeholder:text-red-400/70' : 'text-slate-800 placeholder:text-emerald-600/60'
                            } font-medium tracking-widest`}
                    />

                    {/* Toggle Password Visibility / Submit */}
                    <button
                        type="button"
                        onClick={() => {
                            if (password.length > 0) {
                                // If there is a password, clicking the eye acts as a submit if they intend to, but usually it just toggles. 
                                // To exactly match the reference, we let it toggle, but we can also auto-submit on icon click if we want.
                                // Let's stick to standard behavior: click to toggle visibility.
                                setShowPassword(!showPassword);
                            }
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-slate-800 hover:text-black transition-colors rounded-full"
                    >
                        {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                        ) : (
                            <Eye className="w-5 h-5" />
                        )}
                    </button>

                    {/* Ripple Loading Effect */}
                    {loading && (
                        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center">
                            <div className="w-5 h-5 border-2 border-slate-800 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}
                </div>

                <style jsx>{`
                    @keyframes shake {
                        0%, 100% { transform: translateX(0); }
                        25% { transform: translateX(-5px); }
                        75% { transform: translateX(5px); }
                    }
                    .animate-shake {
                        animation: shake 0.3s ease-in-out;
                    }
                    @keyframes bounce-short {
                        0% { transform: scale(0.8); opacity: 0; }
                        50% { transform: scale(1.1); opacity: 1; }
                        100% { transform: scale(1); opacity: 1; }
                    }
                    .animate-bounce-short {
                        animation: bounce-short 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                    }
                `}</style>
            </div>

            {/* Cool Success Overlay */}
            {isSuccess && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/95 backdrop-blur-xl animate-fade-in text-white">
                    <div className="w-24 h-24 bg-gradient-to-tr from-emerald-400 to-emerald-600 rounded-3xl flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(16,185,129,0.5)] animate-bounce-short">
                        <ShieldCheck className="w-12 h-12 text-white" />
                    </div>
                    <div className="text-3xl font-black tracking-widest animate-fade-in-up">授权成功</div>
                    <div className="text-sm opacity-60 mt-3 font-mono animate-pulse tracking-widest">
                        ESTABLISHING SECURE CONNECTION...
                    </div>
                    
                    {/* Fast Progress Bar */}
                    <div className="w-48 h-1 bg-slate-800 rounded-full mt-6 overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full w-full animate-[slide-right_0.8s_ease-out_forwards]"></div>
                    </div>
                </div>
            )}
        </div>
    );
}
