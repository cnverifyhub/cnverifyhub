'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { Eye, EyeOff, LogIn, Mail, Lock, ShieldCheck, Sparkles, Send, Hash, KeyRound, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type LoginTab = 'email' | 'telegram' | 'forgot';

function LoginForm() {
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get('redirect') || '/en/account';
    const [mounted, setMounted] = useState(false);
    const [activeTab, setActiveTab] = useState<LoginTab>('email');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [emailErr, setEmailErr] = useState('');
    const [emailLoading, setEmailLoading] = useState(false);

    const [tgHandle, setTgHandle] = useState('');
    const [orderId, setOrderId] = useState('');
    const [tgErr, setTgErr] = useState('');
    const [tgOk, setTgOk] = useState('');
    const [tgLoading, setTgLoading] = useState(false);

    const [fEmail, setFEmail] = useState('');
    const [fErr, setFErr] = useState('');
    const [fOk, setFOk] = useState(false);
    const [fLoading, setFLoading] = useState(false);

    useEffect(() => {
        setMounted(true);
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) window.location.href = redirectTo;
        });
        const { data: { subscription } } = supabase.auth.onAuthStateChange((ev, session) => {
            if (ev === 'SIGNED_IN' && session) window.location.href = redirectTo;
        });
        return () => subscription.unsubscribe();
    }, [redirectTo]);

    if (!mounted) return null;

    const switchTab = (t: LoginTab) => {
        setActiveTab(t);
        setEmailErr(''); setTgErr(''); setTgOk(''); setFErr(''); setFOk(false);
    };

    const handleEmail = async (e: React.FormEvent) => {
        e.preventDefault(); setEmailErr('');
        if (!email.trim()) { setEmailErr('Please enter your email address'); return; }
        if (!password) { setEmailErr('Please enter your password'); return; }
        setEmailLoading(true);
        try {
            const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
            if (error) {
                setEmailErr(error.message.includes('Invalid login') ? 'Invalid email or password' : error.message);
                return;
            }
            if (data.session) window.location.href = redirectTo;
        } catch { setEmailErr('Login failed, please try again'); }
        finally { setEmailLoading(false); }
    };

    const handleTelegram = async (e: React.FormEvent) => {
        e.preventDefault(); setTgErr(''); setTgOk('');
        if (!tgHandle.trim()) { setTgErr('Please enter your Telegram username'); return; }
        if (!orderId.trim()) { setTgErr('Please enter your Order ID (e.g. CNW-123456)'); return; }
        setTgLoading(true);
        try {
            const res = await fetch('/api/auth/telegram-lookup', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ telegram: tgHandle.trim(), orderId: orderId.trim() }),
            });
            const d = await res.json();
            if (res.ok && d.sent) setTgOk(`Password reset link sent to ${d.emailHint}. Check your inbox and click the link to set a new password.`);
            else setTgErr(d.error || 'Not found. Check your Telegram handle and Order ID.');
        } catch { setTgErr('Network error, please try again'); }
        finally { setTgLoading(false); }
    };

    const handleForgot = async (e: React.FormEvent) => {
        e.preventDefault(); setFErr('');
        if (!fEmail.trim()) { setFErr('Please enter your email address'); return; }
        setFLoading(true);
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(fEmail.trim(), {
                redirectTo: `${window.location.origin}/auth/callback?redirect=/en/account`,
            });
            if (error) setFErr(error.message); else setFOk(true);
        } catch { setFErr('Send failed, please try again'); }
        finally { setFLoading(false); }
    };

    const inp = 'w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900 dark:text-white placeholder:text-slate-400';
    const lbl = 'block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2';
    const errBox = 'p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-medium';
    const spinSvg = <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none"><circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" /><path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg>;

    const tabs: { id: LoginTab; Icon: React.ElementType; label: string }[] = [
        { id: 'email', Icon: Mail, label: 'Email Login' },
        { id: 'telegram', Icon: Send, label: 'Telegram' },
        { id: 'forgot', Icon: KeyRound, label: 'Forgot Password' },
    ];

    return (
        <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', damping: 25 }} className="w-full max-w-md">
                <div className="text-center mb-8">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.1 }}
                        className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-600 to-indigo-500 rounded-2xl flex items-center justify-center mb-5 shadow-xl shadow-blue-500/30">
                        <LogIn className="w-10 h-10 text-white" />
                    </motion.div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Welcome Back</h1>
                    <p className="text-slate-500 dark:text-slate-400">Log in to your CNVerifyHub account</p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl">
                    <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-1 mb-6">
                        {tabs.map(({ id, Icon, label }) => (
                            <button key={id} type="button" onClick={() => switchTab(id)}
                                className={`flex-1 flex flex-col items-center gap-1 py-2 px-1 rounded-lg text-[10px] font-bold transition-all ${activeTab === id ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
                                <Icon className="w-3.5 h-3.5" />{label}
                            </button>
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        {activeTab === 'email' && (
                            <motion.form key="email" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.15 }} onSubmit={handleEmail} className="space-y-4">
                                <div>
                                    <label className={lbl}><Mail className="w-4 h-4 inline mr-1.5" />Email Address</label>
                                    <input type="email" required autoComplete="email" placeholder="your@email.com" value={email} onChange={e => { setEmail(e.target.value); setEmailErr(''); }} className={inp} />
                                </div>
                                <div>
                                    <label className={lbl}><Lock className="w-4 h-4 inline mr-1.5" />Password</label>
                                    <div className="relative">
                                        <input type={showPw ? 'text' : 'password'} required autoComplete="current-password" placeholder="••••••••" value={password} onChange={e => { setPassword(e.target.value); setEmailErr(''); }} className={`${inp} pr-12`} />
                                        <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                                            {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>
                                {emailErr && <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className={errBox}>{emailErr}</motion.div>}
                                <button type="submit" disabled={emailLoading} className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-500 text-white font-black text-lg rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-xl active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                                    {emailLoading ? spinSvg : <><LogIn className="w-5 h-5" />Login Now</>}
                                </button>
                            </motion.form>
                        )}

                        {activeTab === 'telegram' && (
                            <motion.div key="tg" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.15 }}>
                                <p className="mb-4 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 text-xs leading-relaxed">
                                    💡 Ordered with your Telegram username but don&apos;t have a password yet? Enter your handle and Order ID — we&apos;ll send a password reset link to your registered email.
                                </p>
                                {tgOk ? (
                                    <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="text-center py-6 space-y-3">
                                        <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto" />
                                        <p className="font-bold text-slate-900 dark:text-white">Email Sent!</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">{tgOk}</p>
                                        <button type="button" onClick={() => switchTab('email')} className="text-sm font-bold text-blue-500 hover:underline">Back to Login →</button>
                                    </motion.div>
                                ) : (
                                    <form onSubmit={handleTelegram} className="space-y-4">
                                        <div>
                                            <label className={lbl}><Send className="w-4 h-4 inline mr-1.5" />Telegram Username</label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">@</span>
                                                <input type="text" placeholder="your_telegram" value={tgHandle} onChange={e => { setTgHandle(e.target.value.replace('@', '')); setTgErr(''); }} className={`${inp} pl-8`} />
                                            </div>
                                        </div>
                                        <div>
                                            <label className={lbl}><Hash className="w-4 h-4 inline mr-1.5" />Order ID</label>
                                            <input type="text" placeholder="CNW-123456" value={orderId} onChange={e => { setOrderId(e.target.value); setTgErr(''); }} className={inp} />
                                        </div>
                                        {tgErr && <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className={errBox}>{tgErr}</motion.div>}
                                        <button type="submit" disabled={tgLoading} className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-500 text-white font-black text-lg rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-xl active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                                            {tgLoading ? spinSvg : <><Send className="w-5 h-5" />Send Reset Link</>}
                                        </button>
                                    </form>
                                )}
                            </motion.div>
                        )}

                        {activeTab === 'forgot' && (
                            <motion.div key="forgot" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.15 }}>
                                {fOk ? (
                                    <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="text-center py-6 space-y-3">
                                        <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto" />
                                        <p className="font-bold text-slate-900 dark:text-white">Reset Email Sent!</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Check your inbox (including spam) and click the reset link.</p>
                                        <button type="button" onClick={() => switchTab('email')} className="text-sm font-bold text-blue-500 hover:underline">← Back to Login</button>
                                    </motion.div>
                                ) : (
                                    <form onSubmit={handleForgot} className="space-y-4">
                                        <p className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 text-xs">💡 Enter your email and we&apos;ll send a password reset link.</p>
                                        <div>
                                            <label className={lbl}><Mail className="w-4 h-4 inline mr-1.5" />Email Address</label>
                                            <input type="email" required autoComplete="email" placeholder="your@email.com" value={fEmail} onChange={e => { setFEmail(e.target.value); setFErr(''); }} className={inp} />
                                        </div>
                                        {fErr && <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className={errBox}>{fErr}</motion.div>}
                                        <button type="submit" disabled={fLoading} className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-lg rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-xl active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                                            {fLoading ? spinSvg : <><KeyRound className="w-5 h-5" />Send Reset Link</>}
                                        </button>
                                    </form>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="mt-6">
                        <div className="flex items-center gap-4 my-4">
                            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                            <span className="text-xs font-bold text-slate-400">NEW HERE?</span>
                            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                        </div>
                        <Link href="/en/auth/signup" className="block w-full py-3.5 text-center font-bold text-slate-700 dark:text-slate-300 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-800 hover:bg-blue-50/30 dark:hover:bg-blue-950/10 transition-all">
                            <Sparkles className="w-4 h-4 inline mr-1.5 text-blue-500" />Create Account
                        </Link>
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
                    <ShieldCheck className="w-3.5 h-3.5" /><span>Secured by Supabase · 256-bit SSL</span>
                </div>
            </motion.div>
        </div>
    );
}

export default function LoginPageEn() {
    return (
        <Suspense fallback={<div className="min-h-[85vh] flex items-center justify-center"><div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full" /></div>}>
            <LoginForm />
        </Suspense>
    );
}
