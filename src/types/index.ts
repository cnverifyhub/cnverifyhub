/* ============================================
   CNVerifyHub.com — Core Type Definitions
   ============================================ */

export type Lang = 'zh' | 'en';
export type CategoryId = 
    | 'wechat' | 'alipay' | 'douyin' | 'qq' | 'xianyu' | 'taobao' | 'xiaohongshu' 
    | 'bundle' | 'verification' | 'fintech' | 'trading';

export type ProductType = 'account' | 'bundle' | 'service' | 'document';

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
    slug: string; // Unified slug
    name?: { zh: string; en: string }; // New standardized name field
    nameEn?: string; // Shortcut for EN name if needed
    category: CategoryId;
    subcategory?: string; // e.g., "alipay-xianyu", "xm-trading"
    type: ProductType; // account, bundle, service, document
    
    // Legacy support
    tierName: { zh: string; en: string };
    tierSlug: string;
    
    description: { zh: string; en: string };
    price: PricingTier;
    compareAtPrice?: number;
    currency: 'CNY' | 'USD' | 'USDT';
    
    variants?: ProductVariant[];
    includes?: string[]; // list of what's included
    requirements?: { 
        zh?: string; 
        en?: string; 
        buyerNeeds?: string; 
        technical?: string;
        list?: string[]; // New list format
    };
    
    deliveryMethod: 'auto' | 'manual' | 'scheduled';
    deliveryTime?: { zh: string; en: string };
    
    stockStatus?: 'in-stock' | 'low-stock' | 'out-of-stock';
    stockCount: number;
    
    popular?: boolean;
    badge?: { zh: string; en: string };
    features?: Array<{ zh: string; en: string }>;
    warranty?: { zh: string; en: string };
    
    sortOrder: number;
    image?: string;
    featuredImage?: string;
    ogImage?: string;
    soldCount?: number;
    rating?: number;
    reviewCount?: number;
    isPublished?: boolean;
    seoTitle?: string;
    seoDescription?: string;
    
    // --- Bundle specific relational fields ---
    bundleComponents?: Array<{
        productId: string;
        quantity: number;
        name?: string;
    }>;

    // Legacy fields (for backward compatibility)
    bundleContents?: Array<{
        item: string;
        name: { zh: string; en: string };
        description?: { zh: string; en: string };
        verificationLevel?: string;
        linkStatus?: string;
        includes: string[];
    }>;
    whyBundle?: { zh: string; en: string };
    useCases?: string[];
    loginMethod?: {
        primary: string;
        secondary: string;
        note: string;
    };
    risks?: { zh: string; en: string };
    hasGooglePlay?: boolean;
}

export interface ProductVariant {
    id: string;
    productId: string;
    name: string;
    price: number;
    stock: number;
    sku: string;
    metadata: Record<string, any>;
}

export type OrderStatus =
    | 'pending_payment'
    | 'payment_received'
    | 'paid'
    | 'processing'
    | 'delivered'
    | 'completed'
    | 'cancelled';

export type ServiceStatus = 
    | 'pending' 
    | 'in_progress' 
    | 'awaiting_customer' 
    | 'completed' 
    | 'failed';

export interface Order {
    id: string;
    publicId: string;
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

export interface ServiceOrder {
    id: string;
    orderId: string;
    productId: string;
    customerEmail: string;
    customerTelegram: string;
    status: ServiceStatus;
    requirementsSubmitted: boolean;
    requirementsData: Record<string, any>;
    resultData: Record<string, any>;
    assignedTo?: string;
    createdAt: string;
    updatedAt: string;
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
