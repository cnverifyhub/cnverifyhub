'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Eye, EyeOff, UserPlus, Mail, Lock, ArrowRight, ShieldCheck, Check, X } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function SignupPageEn() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) window.location.href = '/en/account';
        });
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' && session) window.location.href = '/en/account';
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

    const checks = {
        length: password.length >= 6,
        uppercase: /[A-Z]/.test(password),
        number: /[0-9]/.test(password),
        match: password === confirmPassword && confirmPassword.length > 0,
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!email || !password) { setError('Please fill in all fields'); return; }
        if (!checks.length) { setError('Password must be at least 6 characters'); return; }
        if (!checks.match) { setError('Passwords do not match'); return; }

        setLoading(true);
        try {
            const { data, error: authError } = await supabase.auth.signUp({
                email: email.trim(),
                password,
                options: {
                    emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/auth/callback?next=/en/account`,
                }
            });

            if (authError) {
                setError(authError.message);
                return;
            }

            if (data.user && !data.session) setSuccess(true);
            else if (data.session) window.location.href = '/en/account';
        } catch (err) {
            setError('Registration failed, please try again');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 text-center">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md">
                    <div className="w-24 h-24 mx-auto bg-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/30">
                        <Mail className="w-12 h-12 text-white" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-3">Check Your Email</h1>
                    <p className="text-slate-500 mb-8">We've sent a verification link to <strong>{email}</strong>. Please click the link to activate your account.</p>
                    <Link href="/en/auth/login" className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg">Back to Login <ArrowRight className="w-4 h-4" /></Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
            <motion.div initial={{ opacity: 0, y: 30, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mb-5 shadow-xl shadow-emerald-500/30">
                        <UserPlus className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Create Account</h1>
                    <p className="text-slate-500">Join the CNVerifyHub marketplace</p>
                </div>

                <div className="glass-card p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl">
                    <form onSubmit={handleSignup} className="space-y-5">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2"><Mail className="w-4 h-4 inline mr-1.5" /> Email Address</label>
                            <input type="email" required placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-dark-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2"><Lock className="w-4 h-4 inline mr-1.5" /> Password</label>
                            <div className="relative">
                                <input type={showPassword ? 'text' : 'password'} required placeholder="Min 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3.5 pr-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-dark-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all" />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2"><Lock className="w-4 h-4 inline mr-1.5" /> Confirm Password</label>
                            <input type={showPassword ? 'text' : 'password'} required placeholder="Re-enter password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-dark-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all" />
                        </div>
                        {error && <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-medium">{error}</div>}
                        <button type="submit" disabled={loading} className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-lg rounded-xl shadow-lg active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2">{loading ? 'Creating...' : <><UserPlus className="w-5 h-5" /> Sign Up</>}</button>
                    </form>
                    <div className="flex items-center gap-4 my-6"><div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" /><span className="text-xs font-bold text-slate-400">ALREADY REGISTERED?</span><div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" /></div>
                    <Link href="/en/auth/login" className="block w-full py-3.5 text-center font-bold text-slate-700 dark:text-slate-300 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-emerald-300 transition-all">Login Instead</Link>
                </div>
            </motion.div>
        </div>
    );
}
