'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { Eye, EyeOff, UserPlus, Mail, Lock, ArrowRight, ShieldCheck, Check, X } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SignupPage() {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        // 1. Check session on mount
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                window.location.href = '/account';
            }
        });

        // 2. Global Auth State Listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' && session) {
                window.location.href = '/account';
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    if (!mounted) return null;

    // Password strength checks
    const checks = {
        length: password.length >= 6,
        uppercase: /[A-Z]/.test(password),
        number: /[0-9]/.test(password),
        match: password === confirmPassword && confirmPassword.length > 0,
    };
    const strengthScore = Object.values(checks).filter(Boolean).length;
    const strengthColor = strengthScore <= 1 ? 'bg-red-500' : strengthScore <= 2 ? 'bg-yellow-500' : strengthScore <= 3 ? 'bg-blue-500' : 'bg-emerald-500';
    const strengthLabel = strengthScore <= 1 ? '弱 / Weak' : strengthScore <= 2 ? '一般 / Fair' : strengthScore <= 3 ? '良好 / Good' : '强 / Strong';

    const validate = () => {
        if (!email.trim()) { setError('请输入邮箱地址'); return false; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('请输入有效的邮箱地址'); return false; }
        if (!checks.length) { setError('密码至少6位'); return false; }
        if (!checks.match) { setError('两次密码不一致 / Passwords do not match'); return false; }
        return true;
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!validate()) return;

        setLoading(true);
        try {
            const { data, error: authError } = await supabase.auth.signUp({
                email: email.trim(),
                password,
                options: {
                    emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/auth/callback`,
                }
            });

            if (authError) {
                if (authError.message.includes('already registered')) {
                    setError('该邮箱已注册，请直接登录 / Email already registered');
                } else {
                    setError(authError.message);
                }
                return;
            }

            // Check if email confirmation is required
            if (data.user && !data.session) {
                setSuccess(true);
            } else if (data.session) {
                // Auto-confirmed (e.g. in dev mode)
                window.location.href = '/account';
            }
        } catch (err) {
            setError('注册失败，请稍后重试 / Registration failed');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md text-center"
                >
                    <div className="w-24 h-24 mx-auto bg-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/30">
                        <Mail className="w-12 h-12 text-white" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-3">验证邮件已发送</h1>
                    <p className="text-slate-500 mb-6">
                        We've sent a verification email to <strong className="text-slate-700 dark:text-slate-300">{email}</strong>. 
                        Please check your inbox and click the link to activate your account.
                    </p>
                    <p className="text-sm text-slate-400 mb-8">
                        请检查您的邮箱（包括垃圾邮件文件夹），点击验证链接完成注册。
                    </p>
                    <Link
                        href="/auth/login"
                        className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold rounded-xl shadow-lg"
                    >
                        返回登录 / Go to Login <ArrowRight className="w-4 h-4" />
                    </Link>
                </motion.div>
            </div>
        );
    }

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
                        className="w-20 h-20 mx-auto bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mb-5 shadow-xl shadow-emerald-500/30"
                    >
                        <UserPlus className="w-10 h-10 text-white" />
                    </motion.div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">创建账号</h1>
                    <p className="text-slate-500">Create your CNVerifyHub account</p>
                </div>

                {/* Form */}
                <div className="glass-card p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl">
                    <form onSubmit={handleSignup} className="space-y-5">
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
                                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-dark-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
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
                                    autoComplete="new-password"
                                    placeholder="至少6位 / Min 6 characters"
                                    value={password}
                                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                                    className="w-full px-4 py-3.5 pr-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-dark-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>

                            {/* Strength Meter */}
                            {password.length > 0 && (
                                <div className="mt-2 space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                            <div className={`h-full ${strengthColor} rounded-full transition-all duration-300`} style={{ width: `${(strengthScore / 4) * 100}%` }} />
                                        </div>
                                        <span className="text-xs font-bold text-slate-500">{strengthLabel}</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-1 text-xs">
                                        {[
                                            { key: 'length', zh: '至少6位', en: '6+ chars' },
                                            { key: 'uppercase', zh: '含大写字母', en: 'Uppercase' },
                                            { key: 'number', zh: '含数字', en: 'Number' },
                                            { key: 'match', zh: '密码匹配', en: 'Passwords match' },
                                        ].map(item => (
                                            <div key={item.key} className={`flex items-center gap-1 ${checks[item.key as keyof typeof checks] ? 'text-emerald-500' : 'text-slate-400'}`}>
                                                {checks[item.key as keyof typeof checks] ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                                                {item.zh}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                <Lock className="w-4 h-4 inline mr-1.5" />
                                确认密码 / Confirm Password
                            </label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                required
                                autoComplete="new-password"
                                placeholder="再次输入密码"
                                value={confirmPassword}
                                onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                                className={`w-full px-4 py-3.5 rounded-xl border bg-white dark:bg-dark-900 focus:outline-none focus:ring-2 transition-all ${
                                    confirmPassword && !checks.match
                                        ? 'border-red-300 dark:border-red-700 focus:ring-red-500'
                                        : confirmPassword && checks.match
                                            ? 'border-emerald-300 dark:border-emerald-700 focus:ring-emerald-500'
                                            : 'border-slate-200 dark:border-slate-700 focus:ring-emerald-500'
                                } focus:border-transparent`}
                            />
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
                            className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-lg rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none"><circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" /><path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg>
                                    注册中...
                                </span>
                            ) : (
                                <>注册 / Sign Up <ArrowRight className="w-5 h-5" /></>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                        <span className="text-xs font-bold text-slate-400">OR</span>
                        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                    </div>

                    {/* Login Link */}
                    <Link
                        href="/auth/login"
                        className="block w-full py-3.5 text-center font-bold text-slate-700 dark:text-slate-300 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-red-300 dark:hover:border-red-800 hover:bg-red-50/30 dark:hover:bg-red-950/10 transition-all"
                    >
                        已有账号？登录 / Already have an account? Login
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
