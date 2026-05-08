'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Check, ShieldCheck } from 'lucide-react';
import Image from 'next/image';

import { ChineseLoader } from '@/components/ui/ChineseLoader';

export default function GatePage() {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        // Any password or even empty will work now as requested
        
        setLoading(true);
        setError(false);

        try {
            // We still call the API to set the cookie, but the API is now permissive
            const res = await fetch('/api/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password: password || 'bypass' }),
            });

            const data = await res.json();

            if (data.success) {
                // Show the cool Chinese loading animation first
                setTimeout(() => {
                    setLoading(false);
                    setIsSuccess(true);
                    
                    // Final redirect after showing the success state
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 1500);
                }, 1200); // Give the Chinese loader some time to shine
            } else {
                setError(true);
                setPassword('');
                setLoading(false);
            }
        } catch (err) {
            setError(true);
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
                    unoptimized
                    fill
                    className="object-cover opacity-80"
                    priority
                />
                <div className="absolute inset-0 bg-slate-800/20 backdrop-blur-[2px]"></div>
                <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.5)] z-10"></div>
            </div>

            {/* Centered Login Box */}
            <div className="relative z-20 w-full max-w-sm px-4">
                <div
                    className={`relative flex items-center bg-white/95 backdrop-blur-md rounded-full shadow-2xl overflow-hidden transition-all duration-300 border ${error ? 'border-red-400 max-w-sm mx-auto animate-shake' : 'border-emerald-400/30'
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
                        placeholder={error ? "密码错误, 请重试" : "系统已解锁, 点击进入"}
                        disabled={loading}
                        className={`w-full bg-transparent border-none py-4 pl-6 pr-12 text-base md:text-lg outline-none disabled:opacity-50 transition-colors ${error ? 'text-red-500 placeholder:text-red-400/70' : 'text-slate-800 placeholder:text-emerald-600/60'
                            } font-bold tracking-widest`}
                    />

                    {/* Submit Button */}
                    <button
                        type="button"
                        onClick={() => handleSubmit()}
                        disabled={loading}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center bg-emerald-600 hover:bg-emerald-500 text-white rounded-full transition-all shadow-lg active:scale-90"
                    >
                        <Check className="w-5 h-5 stroke-[3px]" />
                    </button>

                    {/* Chinese Loading Overlay */}
                    {loading && (
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-md flex items-center justify-center transition-all duration-500">
                           <div className="scale-50">
                               <ChineseLoader />
                           </div>
                        </div>
                    )}
                </div>

                {/* Telegram Hint */}
                <div className="text-center mt-6 text-white/50 text-xs font-bold tracking-widest uppercase">
                    PROUDLY POWERED BY <span className="text-emerald-400">CNVerifyHub</span>
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
                    @keyframes fade-in {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    .animate-fade-in {
                        animation: fade-in 0.5s ease-out forwards;
                    }
                `}</style>
            </div>

            {/* Cool Success Overlay */}
            {isSuccess && (
                <div className="absolute inset-0 z-[110] flex flex-col items-center justify-center bg-slate-900/95 backdrop-blur-2xl animate-fade-in text-white">
                    <div className="mb-12">
                         <ChineseLoader />
                    </div>
                    
                    <div className="text-3xl font-black tracking-[0.5em] text-emerald-400 uppercase animate-pulse">授权成功</div>
                    <div className="text-[10px] opacity-40 mt-4 font-mono tracking-[0.3em]">
                        DATA DECRYPTION COMPLETE · REDIRECTING...
                    </div>
                </div>
            )}
        </div>
    );
}
