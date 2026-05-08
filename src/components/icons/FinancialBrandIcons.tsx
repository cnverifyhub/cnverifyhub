import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export function WiseIcon({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-label="Wise" role="img" {...props}>
      <title>Wise</title>
      <circle cx="24" cy="24" r="24" fill="url(#wiseGrad)" />
      <path d="M15 18l4.5 9 6-12 7.5 15-4.5-9-6 12L15 18z" fill="#FFF" />
      <defs>
        <linearGradient id="wiseGrad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00B9FF" />
          <stop offset="1" stopColor="#0066FF" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function XmIcon({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-label="XM Trading Point" role="img" {...props}>
      <title>XM</title>
      <circle cx="24" cy="24" r="24" fill="#0A0A0A" />
      <path d="M12 32l8-16 4 8 4-8 8 16h-4l-6-12-2 4-2-4-6 12h-4z" fill="#FFF" />
      <rect x="18" y="16" width="4" height="4" fill="#D32F2F" />
    </svg>
  );
}

export function NetellerIcon({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-label="Neteller" role="img" {...props}>
      <title>Neteller</title>
      <circle cx="24" cy="24" r="24" fill="url(#netellerGrad)" />
      <path d="M16 14v20h5l7-10v10h5V14h-5l-7 10V14h-5z" fill="#FFF" />
      <defs>
        <linearGradient id="netellerGrad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#81C784" />
          <stop offset="1" stopColor="#2E7D32" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function SkrillIcon({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-label="Skrill" role="img" {...props}>
      <title>Skrill</title>
      <circle cx="24" cy="24" r="24" fill="url(#skrillGrad)" />
      <path d="M30 16c-4-2-10-2-10 2s8 3 8 8-4 8-10 6v-4c4 2 10 2 10-2s-8-3-8-8 4-8 10-6v4z" fill="#FFF" />
      <defs>
        <linearGradient id="skrillGrad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#9C27B0" />
          <stop offset="1" stopColor="#4A148C" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function HfmIcon({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-label="HFM HotForex" role="img" {...props}>
      <title>HFM</title>
      <circle cx="24" cy="24" r="24" fill="url(#hfmGrad)" />
      <path d="M14 16v16h4v-6h12v6h4V16h-4v6H18v-6h-4z" fill="#FFF" />
      <defs>
        <linearGradient id="hfmGrad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF5252" />
          <stop offset="1" stopColor="#B71C1C" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function RevolutIcon({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-label="Revolut" role="img" {...props}>
      <title>Revolut</title>
      <rect width="48" height="48" rx="12" fill="#FFF" />
      <path d="M18 14h10c4.4 0 8 3.6 8 8s-3.6 8-8 8h-4v8h-6V14zm6 10c1.1 0 2-.9 2-2s-.9-2-2-2h-4v4h4z" fill="url(#revolutGrad)" />
      <defs>
        <linearGradient id="revolutGrad" x1="16" y1="14" x2="36" y2="38" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F48FB1" />
          <stop offset="1" stopColor="#29B6F6" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function PayoneerIcon({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-label="Payoneer" role="img" {...props}>
      <title>Payoneer</title>
      <circle cx="24" cy="24" r="24" fill="url(#payoneerGrad)" />
      <path d="M18 14h8c5.5 0 10 4.5 10 10s-4.5 10-10 10h-4v6h-4V14zm8 14c2.2 0 4-1.8 4-4s-1.8-4-4-4h-4v8h4z" fill="#FFF" />
      <defs>
        <linearGradient id="payoneerGrad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF6E40" />
          <stop offset="1" stopColor="#E64A19" />
        </linearGradient>
      </defs>
    </svg>
  );
}
