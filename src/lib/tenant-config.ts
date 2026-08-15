export interface TenantConfig {
  id: 'cnwepro' | 'cnverifyhub';
  name: string;
  domain: string;
  branding: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    logo: string;
    favicon: string;
  };
  psychology: {
    headlines: string[];
    subheadlines: string[];
    trustBadges: Array<{ icon: string; label: string; sublabel: string }>;
    ctaText: string;
    urgencyEnabled: boolean;
    flashSalesEnabled: boolean;
    bulkPricingEnabled: boolean;
  };
  pricing: {
    marginMultiplier: number;
    showDiscountPercent: boolean;
    showOriginalPrice: boolean;
    currencySymbol: string;
    bulkTiers: Array<{ min: number; discount: number; label: string }>;
  };
  delivery: {
    promiseText: string;
    promiseSubtext: string;
    autoDeliveryThreshold: number;
  };
  ui: {
    theme: 'light' | 'dark';
    density: 'comfortable' | 'compact';
    borderRadius: string;
    fontHeading: string;
    fontBody: string;
    heroLayout: 'centered' | 'split' | 'full';
    productCard: 'minimal' | 'detailed' | 'flash';
    showLiveOrders: boolean;
    showStockCount: boolean;
    showSoldCount: boolean;
    countdownPosition: 'product' | 'hero' | 'none';
  };
}

export const tenantConfigs: Record<'cnwepro' | 'cnverifyhub', TenantConfig> = {
  cnwepro: {
    id: 'cnwepro',
    name: 'CNWePro',
    domain: 'cnwepro.com',
    branding: {
      primary: '#3B82F6',       // Electric Blue (live site accent)
      secondary: '#10B981',     // Emerald green
      accent: '#F59E0B',        // Gold/amber for badges
      background: '#0B0F17',    // Dark navy (live site confirmed)
      surface: '#0F172A',       // Slate-900
      logo: '/logos/cnwepro.svg',
      favicon: '/favicon-cnwepro.ico'
    },
    psychology: {
      headlines: [
        '专业中国数字账号 交易平台',
        '批发平台 · 官方正品 · 防封耐用',
        'USDT 担保 · 5分钟极速发货 · 72h Warranty'
      ],
      subheadlines: [
        '专业中国大陆数字账号批发平台，现货供应高权重账号',
        'Professional wholesale platform for verified Chinese digital accounts'
      ],
      trustBadges: [
        { icon: 'shield', label: 'SSL Security', sublabel: 'SSL 安全加密' },
        { icon: 'escrow', label: 'USDT Escrow', sublabel: 'USDT 担保交易' },
        { icon: 'warranty', label: '72h Warranty', sublabel: '72小时质保' },
        { icon: 'delivery', label: '5min Delivery', sublabel: '5分钟极速发货' },
        { icon: 'users', label: '12K+ Trusted', sublabel: '1.2w+用户信赖' }
      ],
      ctaText: '立即购买账号',
      urgencyEnabled: true,     // Live site HAS promo banner + live ticker
      flashSalesEnabled: true,  // Live site: 🔥特惠狂欢开启
      bulkPricingEnabled: true
    },
    pricing: {
      marginMultiplier: 1.35,
      showDiscountPercent: false,
      showOriginalPrice: false,
      currencySymbol: '¥',
      bulkTiers: [
        { min: 10, discount: 0.10, label: '10+ units: 10% off' },
        { min: 50, discount: 0.20, label: '50+ units: 20% off' },
        { min: 200, discount: 0.30, label: '200+ units: 30% off' }
      ]
    },
    delivery: {
      promiseText: '5分钟极速 / 12-36h',
      promiseSubtext: '5min auto-delivery for standard accounts, 12-36h for verified',
      autoDeliveryThreshold: 500
    },
    ui: {
      theme: 'dark',            // Confirmed: #0B0F17 navy dark
      density: 'comfortable',
      borderRadius: '8px',
      fontHeading: 'Inter, Space Grotesk, system-ui',
      fontBody: 'Inter, Noto Sans SC, system-ui',
      heroLayout: 'centered',
      productCard: 'minimal',   // Professional catalog style
      showLiveOrders: true,     // Live ticker present on site
      showStockCount: false,
      showSoldCount: false,
      countdownPosition: 'none' // No per-product countdown (vs CNVerifyHub)
    }
  },

  cnverifyhub: {
    id: 'cnverifyhub',
    name: 'CNVerifyHub',
    domain: 'cnverifyhub.com',
    branding: {
      primary: '#00d4aa',
      secondary: '#ff6b35',
      accent: '#ff006e',
      background: '#0a0a0a',
      surface: '#1a1a1a',
      logo: '/logos/cnverifyhub.svg',
      favicon: '/favicon-cnverifyhub.ico'
    },
    psychology: {
      headlines: [
        '专业中国大陆数字资产与实名认证服务平台',
        '100% 实名真号 · 极速自动发货 · 平台担保交易',
        'Premier Chinese Verified Accounts & Digital Services · Instant Delivery'
      ],
      subheadlines: [
        '一手机房纯手工实名账号，高权重防封耐用，支持企业与个人定制，全天候极速交付与售后质保',
        'High-trust, fully verified Chinese accounts for global enterprises & individuals. Automated fulfillment with buyer protection.'
      ],
      trustBadges: [
        { icon: 'flash', label: '<5min Delivery', sublabel: '极速自动发货' },
        { icon: 'shield', label: 'Escrow Protected', sublabel: '平台担保交易' },
        { icon: 'verified', label: '100% Verified', sublabel: '100%实名认证' },
        { icon: 'users', label: '50K+ Served', sublabel: '50,000+已服务用户' }
      ],
      ctaText: 'Shop Now',
      urgencyEnabled: true,
      flashSalesEnabled: true,
      bulkPricingEnabled: true
    },
    pricing: {
      marginMultiplier: 1.15,
      showDiscountPercent: true,
      showOriginalPrice: true,
      currencySymbol: '¥',
      bulkTiers: [
        { min: 5, discount: 0.05, label: '5+ 件: 95折 (5% OFF)' },
        { min: 10, discount: 0.10, label: '10+ 件: 9折 (10% OFF)' },
        { min: 50, discount: 0.20, label: '50+ 件: 8折 (20% OFF)' },
        { min: 200, discount: 0.30, label: '200+ 件: 7折 (30% OFF)' }
      ]
    },
    delivery: {
      promiseText: '< 5 Minutes',
      promiseSubtext: 'Average delivery time after payment confirmation',
      autoDeliveryThreshold: 100
    },
    ui: {
      theme: 'dark',
      density: 'compact',
      borderRadius: '12px',
      fontHeading: 'Inter, system-ui',
      fontBody: 'Inter, system-ui',
      heroLayout: 'split',
      productCard: 'flash',
      showLiveOrders: true,
      showStockCount: true,
      showSoldCount: true,
      countdownPosition: 'product'
    }
  }
};

export function getTenantConfig(hostname?: string | null): TenantConfig {
  if (hostname && hostname.toLowerCase().includes('cnwepro')) {
    return tenantConfigs.cnwepro;
  }
  return tenantConfigs.cnverifyhub;
}
