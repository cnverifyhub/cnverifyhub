import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatUsdt(amount: number): string {
    return `$${amount.toFixed(2)}`;
}

export function formatStock(count: number): string {
    return count > 999 ? '999+' : count.toString();
}
