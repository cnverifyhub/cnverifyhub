'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { Eye, EyeOff, LogIn, Mail, Lock, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [mounted, setMounted] = useState(false);

    const redirectTo = searchParams.get('redirect') || '/account';

    useEffect(() => {
        setMounted(true);

        // 1. Check session on mount
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                window.location.href = redirectTo;
            }
        });

        // 2. Global Auth State Listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' && session) {
                window.location.href = redirectTo;
            }
        });

        return () => subscription.unsubscribe();
    }, [redirectTo]);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (!mounted) return null;

    const validate = () => {
        if (!email.trim()) { setError('请输入邮箱地址'); return false; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('请输入有效的邮箱地址'); return false; }
        if (!password) { setError('请输入密码'); return false; }
        if (password.length < 6) { setError('密码至少6位'); return false; }
        return true;
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!validate()) return;

        setLoading(true);
        try {
            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email: email.trim(),
                password
            });

            if (authError) {
                if (authError.message.includes('Invalid login')) {
                    setError('邮箱或密码错误 / Invalid email or password');
                } else if (authError.message.includes('Email not confirmed')) {
                    setError('请先验证邮箱后再登录 / Please verify your email first');
                } else {
                    setError(authError.message);
                }
                return;
            }

            if (data.session) {
                // Use window.location for reliable post-auth redirect
                // router.push can fail to pick up new session cookies
                window.location.href = redirectTo;
            }
        } catch (err) {
            setError('登录失败，请稍后重试 / Login failed, please try again');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="w-full max-w-md"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', damping: 15, delay: 0.1 }}
                        className="w-20 h-20 mx-auto bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center mb-5 shadow-xl shadow-red-500/30"
                    >
                        <LogIn className="w-10 h-10 text-white" />
                    </motion.div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">欢迎回来</h1>
                    <p className="text-slate-500">Welcome back to CNWePro</p>
                </div>

                {/* Form */}
                <div className="glass-card p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl">
                    <form onSubmit={handleLogin} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                <Mail className="w-4 h-4 inline mr-1.5" />
                                邮箱地址 / Email
                            </label>
                            <input
                                type="email"
                                required
                                autoComplete="email"
                                placeholder="your@email.com"
                                value={email}
                                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-dark-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                <Lock className="w-4 h-4 inline mr-1.5" />
                                密码 / Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                                    className="w-full px-4 py-3.5 pr-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-dark-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-medium"
                            >
                                {error}
                            </motion.div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-gradient-to-r from-red-600 to-orange-500 text-white font-black text-lg rounded-xl shadow-lg shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/30 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none"><circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" /><path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg>
                                    登录中...
                                </span>
                            ) : (
                                <>登录 / Login <ArrowRight className="w-5 h-5" /></>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                        <span className="text-xs font-bold text-slate-400">OR</span>
                        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                    </div>

                    {/* Sign Up Link */}
                    <Link
                        href="/auth/signup"
                        className="block w-full py-3.5 text-center font-bold text-slate-700 dark:text-slate-300 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-red-300 dark:hover:border-red-800 hover:bg-red-50/30 dark:hover:bg-red-950/10 transition-all"
                    >
                        <Sparkles className="w-4 h-4 inline mr-1.5 text-red-500" />
                        注册新账号 / Create Account
                    </Link>
                </div>

                {/* Trust Bar */}
                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Secured by Supabase Auth · 256-bit SSL</span>
                </div>
            </motion.div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-[85vh] flex items-center justify-center">
                <div className="animate-spin w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full" />
            </div>
        }>
            <LoginForm />
        </Suspense>
    );
}

