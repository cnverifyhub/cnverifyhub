'use client';

import React from 'react';
import { WalletAddressCard } from './WalletAddressCard';
import { Shield, Sparkles } from 'lucide-react';

const WALLETS = [
  { chain: 'TRC20' as const, address: 'TPdyaSUty1yFnjU2kGM7Uc9yBY7yz9KRvY', currency: 'USDT', isEvm: false },
  { chain: 'BEP20' as const, address: '0x95EEa6cA1CCCB2f281E9d9F9BBbD19315B971fe3', currency: 'USDT', isEvm: true },
  { chain: 'ERC20' as const, address: '0x95EEa6cA1CCCB2f281E9d9F9BBbD19315B971fe3', currency: 'USDT', isEvm: true },
  { chain: 'Solana' as const, address: '2bPuP5T4NXp3u7p52RT7BgJdJpwRquvmf2mCh329sHHM', currency: 'SOL/USDT', isEvm: false },
];

export function PaymentWalletsGrid({ lang = 'zh' }: { lang?: 'zh' | 'en' }) {
  return (
    <div className="w-full flex flex-col gap-3 my-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#00E5FF]" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            {lang === 'zh' ? '官方担保付款钱包 (支持一键复制)' : 'Official USDT / Crypto Settlement Wallets'}
          </span>
        </div>
        <span className="text-[11px] font-mono text-[#07C160] flex items-center gap-1">
          <Shield className="w-3 h-3" /> {lang === 'zh' ? '链上实时监听发货' : 'Instant Automated Delivery'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        {WALLETS.map((w) => (
          <WalletAddressCard
            key={w.chain}
            chain={w.chain}
            address={w.address}
            currency={w.currency}
            isEvm={w.isEvm}
          />
        ))}
      </div>

      <p className="text-[11px] text-[#7B91B0] leading-relaxed">
        {lang === 'zh'
          ? '💡 提示：BEP20 与 ERC20 使用通用 EVM 地址，转账时请务必在钱包中选准对应网络通道，付款后系统 5 分钟内极速发卡。'
          : '💡 Notice: BEP20 and ERC20 share the EVM address standard. Ensure the correct network is selected in your wallet before transferring.'}
      </p>
    </div>
  );
}
