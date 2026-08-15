'use client';

import React from 'react';

interface LocalInitialAvatarProps {
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const AVATAR_PALETTES = [
  { bg: 'bg-gradient-to-br from-blue-600 to-indigo-700', text: 'text-white', border: 'border-blue-400/30' },
  { bg: 'bg-gradient-to-br from-emerald-600 to-teal-700', text: 'text-white', border: 'border-emerald-400/30' },
  { bg: 'bg-gradient-to-br from-violet-600 to-purple-800', text: 'text-white', border: 'border-purple-400/30' },
  { bg: 'bg-gradient-to-br from-amber-500 to-orange-600', text: 'text-white', border: 'border-amber-400/30' },
  { bg: 'bg-gradient-to-br from-rose-600 to-red-700', text: 'text-white', border: 'border-rose-400/30' },
  { bg: 'bg-gradient-to-br from-cyan-600 to-blue-700', text: 'text-white', border: 'border-cyan-400/30' },
  { bg: 'bg-gradient-to-br from-fuchsia-600 to-pink-700', text: 'text-white', border: 'border-pink-400/30' },
  { bg: 'bg-gradient-to-br from-teal-600 to-emerald-800', text: 'text-white', border: 'border-teal-400/30' },
  { bg: 'bg-gradient-to-br from-indigo-600 to-blue-800', text: 'text-white', border: 'border-indigo-400/30' },
  { bg: 'bg-gradient-to-br from-orange-500 to-amber-700', text: 'text-white', border: 'border-orange-400/30' },
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function getInitials(name: string): string {
  if (!name || typeof name !== 'string') return '?';
  const clean = name.trim();
  if (!clean) return '?';

  // Check if begins with Chinese / CJK characters
  const isCJK = /[\u4e00-\u9fa5\u3040-\u30ff\u3400-\u4dbf]/.test(clean[0]);
  if (isCJK) {
    return clean.slice(0, 1);
  }

  // Handle phone numbers / digits
  if (/^\d/.test(clean)) {
    return clean.slice(0, 2);
  }

  // English / Western names: 1 or 2 initial characters
  const parts = clean.split(/[\s_\-\.]+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return clean.slice(0, 2).toUpperCase();
}

const SIZE_CLASSES = {
  xs: 'w-7 h-7 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-xl',
};

export function LocalInitialAvatar({
  name,
  size = 'md',
  className = '',
}: LocalInitialAvatarProps) {
  const hash = hashString(name || 'Anonymous');
  const palette = AVATAR_PALETTES[hash % AVATAR_PALETTES.length];
  const initials = getInitials(name);
  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.md;

  return (
    <div
      className={`relative inline-flex items-center justify-center font-bold font-mono select-none rounded-full shrink-0 shadow-sm border ${palette.bg} ${palette.text} ${palette.border} ${sizeClass} ${className}`}
      title={name}
      aria-label={name}
    >
      <span className="leading-none tracking-tight">{initials}</span>
    </div>
  );
}

export default LocalInitialAvatar;
