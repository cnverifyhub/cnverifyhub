'use client';

import React, { useState } from 'react';
import { Copy, Check, ShieldCheck, Info } from 'lucide-react';

export interface WalletCardProps {
  chain: 'TRC20' | 'BEP20' | 'ERC20' | 'Solana';
  address: string;
  currency?: string;
  isEvm?: boolean;
}

export function WalletAddressCard({ chain, address, currency = 'USDT', isEvm = false }: WalletCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy wallet address:', err);
    }
  };

  const chainBadgeStyles = {
    TRC20: 'bg-[#FF0036]/10 text-[#FF2D55] border-[#FF0036]/30',
    BEP20: 'bg-[#F3BA2F]/10 text-[#F3BA2F] border-[#F3BA2F]/30',
    ERC20: 'bg-[#627EEA]/10 text-[#627EEA] border-[#627EEA]/30',
    Solana: 'bg-[#14F195]/10 text-[#14F195] border-[#14F195]/30',
  }[chain];

  return (
    <div className="flex flex-col gap-2 p-3 rounded-xl border border-[#1E2D45] bg-[#0D1526] hover:border-[#00E5FF]/40 transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded border ${chainBadgeStyles}`}>
            {currency} {chain}
          </span>
          {isEvm && (
            <span className="flex items-center gap-0.5 text-[10px] text-[#7B91B0]" title="EVM 兼容多链通用地址 (BSC / ETH)">
              <Info className="w-3 h-3 text-[#00E5FF]" /> EVM
            </span>
          )}
          <span className="hidden sm:flex items-center gap-1 text-[11px] text-[#07C160]">
            <ShieldCheck className="w-3.5 h-3.5" /> 现货直付
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded bg-[#060B18] border border-[#1E2D45] text-[#7B91B0] hover:text-white hover:border-[#00E5FF]/40 transition-colors"
          title="点击复制付款地址"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-[#07C160]" /> : <Copy className="w-3.5 h-3.5" />}
          <span className={copied ? 'text-[#07C160]' : ''}>{copied ? '已复制' : '复制'}</span>
        </button>
      </div>
      <div className="flex items-center justify-between bg-[#060B18] px-3 py-1.5 rounded-lg border border-[#1E2D45]/60">
        <code className="font-mono text-xs text-[#F0F4FF] truncate select-all">{address}</code>
      </div>
    </div>
  );
}
