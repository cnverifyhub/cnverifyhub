'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Eye, EyeOff, LogIn, Mail, Lock, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

function LoginForm() {
    const searchParams = useSearchParams();
    const [mounted, setMounted] = useState(false);
    const redirectTo = searchParams.get('redirect') || '/en/account';

    useEffect(() => {
        setMounted(true);
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) window.location.href = redirectTo;
        });
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' && session) window.location.href = redirectTo;
        });
        return () => subscription.unsubscribe();
    }, [redirectTo]);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (!mounted) return null;

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!email || !password) { setError('Please fill in all fields'); return; }
        
        setLoading(true);
        try {
            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email: email.trim(),
                password
            });

            if (authError) {
                setError(authError.message === 'Invalid login credentials' ? 'Invalid email or password' : authError.message);
                return;
            }

            if (data.session) window.location.href = redirectTo;
        } catch (err) {
            setError('Login failed, please try again');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="w-full max-w-md"
            >
                <div className="text-center mb-8">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-600 to-indigo-500 rounded-2xl flex items-center justify-center mb-5 shadow-xl shadow-blue-500/30">
                        <LogIn className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Welcome Back</h1>
                    <p className="text-slate-500">Log in to your CNWePro account</p>
                </div>

                <div className="glass-card p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl">
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                <Mail className="w-4 h-4 inline mr-1.5" /> Email Address
                            </label>
                            <input
                                type="email"
                                required
                                placeholder="your@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-dark-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                <Lock className="w-4 h-4 inline mr-1.5" /> Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3.5 pr-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-dark-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-medium">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-500 text-white font-black text-lg rounded-xl shadow-lg hover:shadow-xl active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                        >
                            {loading ? 'Logging in...' : <><LogIn className="w-5 h-5" /> Login Now</>}
                        </button>
                    </form>

                    <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                        <span className="text-xs font-bold text-slate-400">NEW HERE?</span>
                        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                    </div>

                    <Link
                        href="/en/auth/signup"
                        className="block w-full py-3.5 text-center font-bold text-slate-700 dark:text-slate-300 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-blue-300 transition-all"
                    >
                        <Sparkles className="w-4 h-4 inline mr-1.5 text-blue-500" /> Create Account
                    </Link>
                </div>

                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Secured by Supabase · 256-bit SSL</span>
                </div>
            </motion.div>
        </div>
    );
}

export default function LoginPageEn() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full" /></div>}>
            <LoginForm />
        </Suspense>
    );
}
