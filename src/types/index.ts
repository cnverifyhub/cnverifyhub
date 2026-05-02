/* ============================================
   cnwepro.com — Core Type Definitions
   ============================================ */

export type Lang = 'zh' | 'en';
export type CategoryId = 'wechat' | 'alipay' | 'douyin' | 'qq' | 'xianyu' | 'taobao' | 'xiaohongshu' | 'bundle' | 'verification' | 'fintech';
export interface Category {
    id: CategoryId;
    name: { zh: string; en: string };
    description: { zh: string; en: string };
    icon: string; // SVG path or component name
    color: string; // Tailwind color class
    gradient: string; // Tailwind gradient classes
    href: string;
}

export interface PricingTier {
    single: number;   // USDT price for 1 unit
    bulk10: number;    // per-unit for 10+
    bulk50: number;    // per-unit for 50+
    bulk200: number;   // per-unit for 200+
    originalPrice?: {
        single: number;
        bulk10: number;
        bulk50: number;
        bulk200: number;
    }
}

export interface Product {
    id: string;
    category: CategoryId;
    tierName: { zh: string; en: string };
    tierSlug: string;
    description: { zh: string; en: string };
    price: PricingTier;
    features: Array<{ zh: string; en: string }>;
    warranty: { zh: string; en: string };
    deliveryTime: { zh: string; en: string };
    stockCount: number;
    popular?: boolean;
    badge?: { zh: string; en: string };
    sortOrder: number;
    image?: string;
    // --- Bundle specific optional fields ---
    bundleContents?: Array<{
        item: string;
        name: string;
        description: string;
        verificationLevel?: string;
        linkStatus?: string;
        includes: string[];
    }>;
    whyBundle?: { zh: string; en: string };
    useCases?: string[]; // Simplified: directly strings (assumed to be matching the requested definition format)
    loginMethod?: {
        primary: string;
        secondary: string;
        note: string;
    };
    requirements?: { buyerNeeds: string; technical: string };
    risks?: { zh: string; en: string };
}

export type OrderStatus =
    | 'pending_payment'
    | 'payment_received'
    | 'processing'
    | 'delivered'
    | 'completed'
    | 'cancelled';

export interface Order {
    id: string;
    productId: string;
    category: CategoryId;
    tierName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    paymentMethod: 'trc20_usdt';
    txHash?: string;
    telegramUsername: string;
    email?: string;
    status: OrderStatus;
    createdAt: string;
    updatedAt: string;
    credentials?: AccountCredentials;
}

export interface AccountCredentials {
    username: string;
    password: string;
    recoveryEmail?: string;
    backupCodes?: string[];
    notes?: string;
}

export interface FAQItem {
    id: string;
    question: { zh: string; en: string };
    answer: { zh: string; en: string };
    category?: string;
}

export interface Testimonial {
    id: string;
    name: string;
    avatar?: string;
    rating: number;
    text: { zh: string; en: string };
    platform: CategoryId | 'general';
    date: string;
}

export interface NavItem {
    label: { zh: string; en: string };
    href: string;
    children?: NavItem[];
}

export interface ContactFormData {
    name: string;
    contactMethod: 'telegram' | 'wechat' | 'qq' | 'email';
    contactId: string;
    categories: CategoryId[];
    messageType: 'purchase' | 'support' | 'wholesale' | 'other';
    message: string;
}

export interface StockLevel {
    productId: string;
    count: number;
    status: 'high' | 'medium' | 'low' | 'out';
}
