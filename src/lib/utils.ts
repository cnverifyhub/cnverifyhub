import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const USDT_TO_CNY = 7.2;

export function formatUsdt(amount: number): string {
    return `$${amount.toFixed(2)}`;
}

export function calculateYuan(usdtAmount: number): number {
    return Math.round(usdtAmount * USDT_TO_CNY);
}

export function formatYuan(usdtAmount: number): string {
    const yuanAmount = calculateYuan(usdtAmount);
    return `¥${yuanAmount.toString()}`;
}

export function formatStock(count: number): string {
    return count > 999 ? '999+' : count.toString();
}
