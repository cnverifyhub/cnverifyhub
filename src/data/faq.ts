import type { FAQItem } from '@/types';

export const faqData: FAQItem[] = [
    {
        id: 'faq-1',
        category: 'purchase',
        question: {
            zh: '购买后什么时候能收到账号？',
            en: 'When will I receive the account after purchase?',
        },
        answer: {
            zh: '系统对接了自动发货功能，对于白号类产品，支付确认后通常只需 5-15 分钟即可收到账号密码。实名号由于需要人工核验，一般在 1-4 小时内完成内交付。',
            en: 'We have an automated delivery system. For fresh accounts (white accounts), you will typically receive the credentials within 5-15 minutes after payment confirmation. Verified accounts require manual processing and usually take 1-4 hours.',
        },
    },
    {
        id: 'faq-2',
        category: 'payment',
        question: {
            zh: '你们支持哪些付款方式？',
            en: 'What payment methods do you accept?',
        },
        answer: {
            zh: '为了保障隐私和安全，我们目前主要支持 USDT (TRC20 网络) 支付。对于大额批发客户，也可通过 Telegram 联系客服获取其他支付方式的支持。',
            en: 'To ensure privacy and security, we primarily accept USDT (TRC20 network). For large wholesale orders, you can contact support via Telegram to discuss alternative payment methods.',
        },
    },
    {
        id: 'faq-3',
        category: 'warranty',
        question: {
            zh: '账号购买后有售后质保吗？',
            en: 'Is there any warranty after purchasing?',
        },
        answer: {
            zh: '是的，所有账号均提供不同程度的质保。白号统一提供24小时首次登录质保，实名号提供48小时至7天的质保期。质保期内如遇非人为导致的账号封禁或密码错误，我们将免费为您更换同等账号。',
            en: 'Yes, all accounts come with a warranty. Fresh accounts include a 24-hour first-login warranty, while verified accounts offer 48-hour to 7-day warranties. Within this period, if the account is banned for non-user-related reasons or has password issues, we will replace it for free.',
        },
    },
    {
        id: 'faq-4',
        category: 'account',
        question: {
            zh: '微信号/支付宝号买来可以直接转账吗？',
            en: 'Can I transfer money immediately with bought WeChat/Alipay accounts?',
        },
        answer: {
            zh: '根据风控规则，建议新购账号在常用设备上稳定挂机 3-5 天后再进行大额资金操作。不要一登录就立即修改绑定手机或进行频繁转账，先进行正常互动养号。',
            en: 'Due to risk control rules, we recommend keeping the new account idle on your primary device for 3-5 days before making large transactions. Do not change the bound phone number or make frequent transfers immediately after logging in. Interact normally first.',
        },
    },
    {
        id: 'faq-5',
        category: 'wholesale',
        question: {
            zh: '我需要批量购买，有优惠吗？',
            en: 'I need to buy in bulk. Are there any discounts?',
        },
        answer: {
            zh: '有的，我们支持 10个、50个、200个以上等多个阶梯的批发价，最多可享受单价降低30%的折扣。详情请查看各商品页面的批量定价表。超大数额请直接 Telegram 联系客服。',
            en: 'Yes, we offer tiered bulk pricing for 10+, 50+, and 200+ units, with discounts up to 30% off the single unit price. Please check the bulk pricing table on each product page. For massive orders, please contact support directly on Telegram.',
        },
    },
    {
        id: 'faq-6',
        category: 'account',
        question: {
            zh: '"绑卡号"和"实名号"有什么区别？',
            en: 'What is the difference between "Verified" and "Bank-linked" accounts?',
        },
        answer: {
            zh: '实名号指已经上传了身份证信息通过认证的账号，可使用基本的收发红包和转账功能；绑卡号在此基础上绑定了真实的银行卡，这能极大提高账号的防封信誉度和单次支付限额。',
            en: 'Verified accounts have passed ID verification and can use basic red packet/transfer features. Bank-linked accounts additionally have a real bank card bound to them, which significantly increases anti-ban trust scores and payment limits.',
        },
    },
];
