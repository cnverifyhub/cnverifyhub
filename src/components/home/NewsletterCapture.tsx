'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Check, Copy, Sparkles, ShieldCheck, ArrowRight, Gift, Loader2 } from 'lucide-react';
import type { Lang } from '@/lib/i18n';

interface NewsletterCaptureProps {
  lang: Lang;
}

export function NewsletterCapture({ lang }: NewsletterCaptureProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [couponCode, setCouponCode] = useState('RECOVER5');
  const [copied, setCopied] = useState(false);

  const isZh = lang === 'zh';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMessage(isZh ? '请输入有效的电子邮箱地址' : 'Please enter a valid email address');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, lang, tenant_id: 'cnverifyhub' }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || (isZh ? '订阅失败，请稍后重试' : 'Subscription failed, please try again'));
      }

      if (data.discountCode) {
        setCouponCode(data.discountCode);
      }
      setStatus('success');
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || (isZh ? '网络异常，请重试' : 'Network error, please try again'));
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(couponCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <section className="relative py-16 md:py-24 bg-[#060B18] overflow-hidden border-t border-b border-[#1E2D45]">
      {/* Background glow meshes */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(0, 229, 255, 0.15) 0%, rgba(255, 0, 54, 0.08) 40%, transparent 70%)'
        }}
      />
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-[#00E5FF]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-[#FF0036]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="section-container relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="rounded-2xl bg-[#0D1526] border border-[#1E2D45] p-6 sm:p-10 md:p-12 shadow-2xl relative overflow-hidden">
          {/* Top highlight bar */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#00E5FF] via-[#FF0036] to-[#00E5FF]" />

          <AnimatePresence mode="wait">
            {status !== 'success' ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                {/* Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF0036]/10 border border-[#FF0036]/30 text-[#FF0036] text-xs font-bold uppercase tracking-wider mb-4">
                  <Gift className="w-3.5 h-3.5" />
                  {isZh ? '新人首单特惠 · 立即领券' : 'NEW SUBSCRIBER EXCLUSIVE · 5% OFF'}
                </div>

                {/* Title */}
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#F0F4FF] tracking-tight mb-3">
                  {isZh ? (
                    <>
                      订阅专属特惠，立领 <span className="text-[#00E5FF]">5% 无门槛折扣码</span>
                    </>
                  ) : (
                    <>
                      Subscribe & Get Instant <span className="text-[#00E5FF]">5% OFF Coupon</span>
                    </>
                  )}
                </h2>

                {/* Subtitle */}
                <p className="text-sm sm:text-base text-[#7B91B0] max-w-xl mx-auto mb-8 leading-relaxed">
                  {isZh
                    ? '输入邮箱即刻解锁 95 折新人优惠码，并获取最新高权重实名老号上新通知、独家防封指南与限时满减福利。'
                    : 'Enter your email to unlock your instant 5% discount code, plus receive real-time restock alerts and anti-ban account warming guides.'}
                </p>

                {/* Subscription Form */}
                <form onSubmit={handleSubmit} className="max-w-lg mx-auto flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7B91B0] pointer-events-none" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (status === 'error') setStatus('idle');
                      }}
                      placeholder={isZh ? '输入您的常用邮箱地址...' : 'Enter your email address...'}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-[#060B18] border border-[#1E2D45] rounded-xl text-sm text-[#F0F4FF] placeholder-[#455773] focus:outline-none focus:border-[#00E5FF] focus:ring-2 focus:ring-[#00E5FF]/20 transition-all duration-200"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white uppercase tracking-wider transition-all duration-200 relative overflow-hidden group shadow-lg cursor-pointer shrink-0 disabled:opacity-75 disabled:cursor-not-allowed"
                    style={{
                      background: 'linear-gradient(135deg, #FF0036 0%, #C0001A 100%)',
                      boxShadow: '0 4px 16px rgba(255, 0, 54, 0.35)',
                    }}
                  >
                    <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 skew-x-12" />
                    {status === 'loading' ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {isZh ? '获取中...' : 'Subscribing...'}
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        {isZh ? '免费获取优惠码' : 'Claim 5% Coupon'}
                      </>
                    )}
                  </button>
                </form>

                {/* Error Message */}
                {status === 'error' && (
                  <p className="text-xs text-[#EF4444] mt-3 font-medium">{errorMessage}</p>
                )}

                {/* Trust Footer */}
                <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-[#7B91B0] mt-6 pt-6 border-t border-[#1E2D45]/60">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#07C160]" />
                    {isZh ? '零垃圾邮件' : 'Zero Spam Guarantee'}
                  </span>
                  <span className="text-[#1E2D45]">•</span>
                  <span>{isZh ? '即时发送至邮箱' : 'Instant Email Delivery'}</span>
                  <span className="text-[#1E2D45]">•</span>
                  <span>{isZh ? '随时支持退订' : 'Unsubscribe Anytime'}</span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35 }}
                className="text-center py-4"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#07C160]/10 border border-[#07C160]/30 text-[#07C160] flex items-center justify-center mx-auto mb-4">
                  <Check className="w-7 h-7" />
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#F0F4FF] mb-2">
                  {isZh ? '🎉 订阅成功！专属优惠券已解锁' : '🎉 Subscribed! Your 5% OFF Code is Ready'}
                </h3>
                <p className="text-sm text-[#7B91B0] max-w-md mx-auto mb-6">
                  {isZh
                    ? '结账时输入以下优惠码立享 5% 现金直减，优惠码已同步发送至您的邮箱。'
                    : 'Apply the coupon code below during checkout for an instant 5% discount. We also emailed your code.'}
                </p>

                {/* Revealed Coupon Box */}
                <div className="max-w-md mx-auto bg-[#060B18] border-2 border-dashed border-[#00E5FF]/50 rounded-xl p-4 mb-6 relative overflow-hidden">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-left">
                      <span className="text-[10px] uppercase font-mono text-[#00E5FF] tracking-wider block">
                        {isZh ? '95折立减优惠券' : '5% DISCOUNT COUPON'}
                      </span>
                      <code className="text-xl sm:text-2xl font-black font-mono text-white tracking-widest">
                        {couponCode}
                      </code>
                    </div>
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-bold bg-[#00E5FF]/10 text-[#00E5FF] hover:bg-[#00E5FF]/20 border border-[#00E5FF]/30 transition-colors cursor-pointer shrink-0"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 text-[#07C160]" />
                          <span className="text-[#07C160]">{isZh ? '已复制' : 'Copied!'}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>{isZh ? '一键复制' : 'Copy Code'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <a
                    href="#categories"
                    onClick={(e) => {
                      const el = document.getElementById('categories') || document.querySelector('section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-[#0D1526] bg-[#00E5FF] hover:bg-[#33EBFF] transition-all shadow-md cursor-pointer uppercase tracking-wider"
                  >
                    {isZh ? '立即前往选购' : 'Shop Marketplace Now'}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
