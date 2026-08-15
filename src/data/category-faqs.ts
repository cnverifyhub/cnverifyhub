import type { Lang } from '@/lib/i18n';

export interface CategoryFaq {
  question: string;
  answer: string;
}

export const categoryFaqMap: Record<
  string,
  {
    zh: CategoryFaq[];
    en: CategoryFaq[];
  }
> = {
  wechat: {
    zh: [
      {
        question: '购买的微信号买来可以直接转账和发红包吗？',
        answer: '实名号与绑卡号已开通微信支付功能。但根据腾讯风控机制，新登录设备建议在常用网络环境下静默养号 24-48 小时，进行正常聊天互动后，再逐步开启大额转账与红包功能，以保证长期稳定。',
      },
      {
        question: '新设备登录微信提示“登录环境异常”怎么办？',
        answer: '这是微信对异地首次登录的常规保护。请保持设备连接纯净稳定的网络环境，不要频繁切换 IP 或重复退出登录。通常静置 24 小时或完成一次好友辅助验证后即可恢复正常。',
      },
      {
        question: '微信号提供多长时间的售后质保？',
        answer: 'CNVerifyHub 提供行业领先的 72 小时售后质保。在此期间内，若出现非人为违规引起的初始密码错误或首次登录封号，系统与客服将免费为您更换同规格全新账号。',
      },
    ],
    en: [
      {
        question: 'Can I use WeChat Pay and transfer money immediately after purchase?',
        answer: 'Verified and bank-linked accounts have WeChat Pay enabled. However, due to Tencent risk algorithms, we recommend keeping the account on a stable IP for 24-48 hours with normal chatting before initiating high-volume transactions.',
      },
      {
        question: 'What should I do if WeChat shows an "Unusual Login Environment" prompt?',
        answer: 'This is a standard security prompt for first-time logins on a new device. Keep your device connected to a clean, stable residential proxy. Avoid frequent IP switching or logging out. The prompt usually resolves within 24 hours.',
      },
      {
        question: 'What warranty is included with WeChat account purchases?',
        answer: 'All WeChat accounts include an iron-clad 72-hour warranty. If you encounter non-user caused login issues or immediate ban on first login, our support team will provide a free replacement account.',
      },
    ],
  },

  alipay: {
    zh: [
      {
        question: '个人实名号与企业支付宝账号有什么区别？',
        answer: '个人实名号适合日常转账、扫码付款和海外电商买家；企业商户号则支持对公账户结算、开通商户收款码及更高额度的资金流水，适合跨境电商及企业级业务。',
      },
      {
        question: '境外用户使用支付宝会被限制单笔或年度限额吗？',
        answer: '不同实名等级具有对应的限额。我们提供的实名账号已达到二类/三类标准，支持高额度支付。若需更大额度，建议选用企业商户号或配合海外信用卡渠道。',
      },
      {
        question: '付款后如何获取账号和登录凭证？',
        answer: '确认 USDT 支付后，系统将在 5 分钟内自动解密并在屏幕上显示账号、初始密码、支付密码及绑定的辅助验证信息，同时发送至您的预留邮箱或 Telegram。',
      },
    ],
    en: [
      {
        question: 'What is the difference between Personal Verified and Enterprise Alipay accounts?',
        answer: 'Personal verified accounts are ideal for daily shopping, scanning QR codes, and small transfers. Enterprise accounts support corporate bank settlement, high transaction volumes, and commercial merchant gateways.',
      },
      {
        question: 'Are there transaction limits for international users on Alipay?',
        answer: 'Accounts have tiered limits based on verification status. Our verified accounts are Tier-2/Tier-3 compliant for generous limits. For unlimited enterprise volume, choose our Enterprise Merchant plan.',
      },
      {
        question: 'How do I receive my credentials after completing the USDT payment?',
        answer: 'Once your blockchain transaction is confirmed, our automated engine decrypts and displays your credentials on-screen within 5 minutes, while simultaneously dispatching a copy to your email/Telegram.',
      },
    ],
  },

  douyin: {
    zh: [
      {
        question: '购买的千粉/万粉抖音号可以直接开通商品橱窗和直播吗？',
        answer: '是的。我们的千粉与万粉账号均已达到官方开通橱窗和直播的门槛要求，且粉丝均为历史自然沉淀，无违规扣分记录，到手即可直接申请开播与挂载商品。',
      },
      {
        question: '在海外地区使用抖音需要特殊的网络环境吗？',
        answer: '是的。海外运营中国版抖音必须配合纯净的中国大陆静态住宅 IP 或专线网络，避免使用公开共享的廉价数据中心 VPN，以防触发地理围栏限流。',
      },
      {
        question: '抖音账号支持修改绑定手机号和昵称头像吗？',
        answer: '支持。在您成功登录并在稳定网络环境下正常使用 3 天后，即可在抖音安全中心无感换绑您自己的手机号并修改资料。',
      },
    ],
    en: [
      {
        question: 'Can 1K/10K follower Douyin accounts unlock live streaming and showcases immediately?',
        answer: 'Yes. Our 1K and 10K follower accounts meet all official requirements for product showcases (商品橱窗) and live streaming, with clean penalty-free account histories ready for immediate monetization.',
      },
      {
        question: 'Do I need a special network configuration to run Douyin from overseas?',
        answer: 'Yes. Operating TikTok China (Douyin) from abroad requires clean Chinese static residential proxies. Avoid shared datacenter VPNs to prevent regional shadowbans.',
      },
      {
        question: 'Can I change the bound phone number and profile info on the Douyin account?',
        answer: 'Yes. After maintaining a stable login on your device for 3 days, you can safely update the bound phone number, avatar, and nickname in the Douyin Security Center.',
      },
    ],
  },

  qq: {
    zh: [
      {
        question: 'QQ太阳号相比普通白号有哪些核心优势？',
        answer: '太阳号（16级及以上）拥有较长的注册历史与活跃天数，拥有更高的安全信用评级，支持创建多个高人数QQ群、使用全部增值特权，抗封与防冻结能力显著优于新注册白号。',
      },
      {
        question: '购买QQ号后如何防止被找回？',
        answer: 'CNVerifyHub 的所有高等级QQ号均已清除历史绑定。交付后请立即前往 QQ 安全中心设置密保问题、绑定密保手机并开启设备锁（2FA），确保 100% 账号所有权。',
      },
      {
        question: '支持批量采购QQ号用于营销吗？',
        answer: '支持。我们常年储备大量白号、月亮号及太阳号库存，支持 10+、50+、200+ 阶梯批发折扣，并在下单后由自动化系统秒级派发卡密。',
      },
    ],
    en: [
      {
        question: 'What are the main advantages of QQ Sun-Level accounts over fresh accounts?',
        answer: 'Sun-level accounts (Level 16+) feature aged registration and active day points. They possess superior trust scores, support large group creation, and are highly resistant to anti-spam bot bans.',
      },
      {
        question: 'How do I secure the QQ account and prevent recovery after purchase?',
        answer: 'All accounts come with cleared security bindings. Immediately after delivery, visit the QQ Security Center to set your security questions, bind your mobile phone, and enable 2FA device lock.',
      },
      {
        question: 'Do you offer bulk wholesale pricing for marketing teams?',
        answer: 'Yes. We maintain massive inventories of fresh, moon, and sun accounts with tiered bulk discounts (10+, 50+, 200+ units) and instant API/card-key dispatch.',
      },
    ],
  },

  wise: {
    zh: [
      {
        question: '购买的 Wise 账户包含哪些币种的本地银行账户？',
        answer: '已完成全套实名认证的 Wise 账户支持激活多币种账户，包括美元（USD 本地 ACH 路由号）、欧元（EUR 专属 IBAN）、英镑（GBP 排序代码）及澳元等，可无缝用于跨境电商收款与全球转账。',
      },
      {
        question: 'Wise 账户遇到常规二次地址验证（POA）怎么处理？',
        answer: '我们交付的账户均附带初始认证时使用的合规资料包副本。如遇平台定期审查，您只需重新提交对应合规证明文件，或联系我们的专属客服协助处理。',
      },
      {
        question: '如何保证 Wise 资金进出的安全性？',
        answer: '建议遵循“同名进出”或合法商业交易原则，避免频繁与高风险或黑名单账户发生资金往来，并始终在固定的静态 IP 环境下登录管理。',
      },
    ],
    en: [
      {
        question: 'Which local bank currencies are supported in verified Wise accounts?',
        answer: 'Fully verified Wise accounts include dedicated local banking details for USD (Routing/Account number), EUR (dedicated IBAN), GBP (Sort Code/Account), AUD, and more for global payouts.',
      },
      {
        question: 'What happens if Wise requests secondary Proof of Address (POA)?',
        answer: 'Accounts include a complete copy of the verification dossier. If routine compliance checks occur, simply re-upload the provided documentation or contact our support team for guidance.',
      },
      {
        question: 'How do I maintain long-term account stability on Wise?',
        answer: 'Operate with clean static residential IP proxies matching the account jurisdiction, avoid high-velocity suspicious transfers, and adhere to standard cross-border commercial practices.',
      },
    ],
  },

  revolut: {
    zh: [
      {
        question: 'Revolut 账户支持生成虚拟信用卡（Virtual Cards）吗？',
        answer: '支持。已认证的 Revolut 账户可在 App 内无限次生成单次消费卡或多张可重用虚拟借记卡，完美适用于海外广告投放（Facebook/Google Ads）、软件订阅及海淘购物。',
      },
      {
        question: 'Revolut 账户支持加密货币买卖和提现吗？',
        answer: '支持。Revolut 平台内置了主流加密货币交易功能，您可以轻松将法币兑换为 BTC/ETH/USDT 等数字资产并进行转账。',
      },
      {
        question: '交付的 Revolut 账户包含哪些登录凭据？',
        answer: '交付包含注册邮箱、登录密码、绑定的虚拟号码接码权限及全套 KYC 身份证明文件存档，确保您拥有完整控制权。',
      },
    ],
    en: [
      {
        question: 'Does the Revolut account support creating disposable virtual credit cards?',
        answer: 'Yes. Verified Revolut accounts allow you to generate disposable single-use cards and reusable virtual debit cards for Facebook/Google Ads, SaaS subscriptions, and overseas e-commerce.',
      },
      {
        question: 'Can I trade and withdraw cryptocurrencies with this Revolut account?',
        answer: 'Yes. Revolut features built-in crypto trading, allowing seamless exchange between fiat currencies (EUR/USD/GBP) and top digital assets like BTC, ETH, and USDT.',
      },
      {
        question: 'What credentials and documents are delivered upon purchase?',
        answer: 'You receive the master email login, app password, virtual phone SMS access, and the complete KYC verification document archive for permanent ownership.',
      },
    ],
  },

  binance: {
    zh: [
      {
        question: '金融交易类账户（XM/HFM/Neteller/Skrill/Binance）支持直接出入金吗？',
        answer: '支持。所有账户均已通过高级实名认证（KYC Plus），支持使用 USDT、全球电汇或电子钱包进行入金与提现，无交易额度锁定。',
      },
      {
        question: '使用购买的金融账户进行外汇或数字资产交易安全吗？',
        answer: '安全。所有账号均采用一手合规身份开立，杜绝共用或二次倒卖，配合独立静态代理使用，可有效规避风控排查。',
      },
      {
        question: '如遇交易平台要求人脸活体检测怎么办？',
        answer: '针对特定需要二次活体检测的高级账户，CNVerifyHub 提供专属的人脸识别协助服务（Face Assist），确保您的资金在任何极端审核下均能顺畅支取。',
      },
    ],
    en: [
      {
        question: 'Do verified FinTech accounts (XM/HFM/Neteller/Skrill/Binance) support full deposits and withdrawals?',
        answer: 'Yes. All trading accounts have passed advanced KYC (Level 2/3), enabling unrestricted USDT, wire transfer, and e-wallet deposits and withdrawals with zero hold periods.',
      },
      {
        question: 'Is it safe to trade forex or crypto using pre-verified financial accounts?',
        answer: 'Yes. Accounts are created with authentic single-source identities, never shared or recycled. Paired with a dedicated residential proxy, your trading operations remain isolated and secure.',
      },
      {
        question: 'What if the platform triggers secondary biometric facial recognition?',
        answer: 'For platforms requiring secondary live selfie/biometric checks, CNVerifyHub provides optional Face-Assist support to guarantee seamless fund access.',
      },
    ],
  },

  // Extra mappings for additional categories
  trading: {
    zh: [
      {
        question: '金融交易类账户（Wise/XM/HFM/Revolut）支持直接出入金吗？',
        answer: '支持。所有账户均已通过高级实名认证（KYC Plus），支持使用 USDT、全球电汇或电子钱包进行入金与提现，无交易额度锁定。',
      },
      {
        question: '使用购买的金融账户进行外汇或数字资产交易安全吗？',
        answer: '安全。所有账号均采用一手合规身份开立，杜绝共用或二次倒卖，配合独立静态代理使用，可有效规避风控排查。',
      },
      {
        question: '如果金融账户触发二次地址验证怎么处理？',
        answer: '交付附带初始认证时使用的合规资料包副本。如遇平台审查，只需重新提交对应合规证明文件，或联系专属客服协助处理。',
      },
    ],
    en: [
      {
        question: 'Do verified FinTech accounts (Wise/XM/HFM/Revolut) support full deposits and withdrawals?',
        answer: 'Yes. All trading accounts have passed advanced KYC (Level 2/3), enabling unrestricted USDT, wire transfer, and e-wallet deposits and withdrawals with zero hold periods.',
      },
      {
        question: 'Is it safe to trade forex or crypto using pre-verified financial accounts?',
        answer: 'Yes. Accounts are created with authentic single-source identities, never shared or recycled. Paired with a dedicated residential proxy, your trading operations remain isolated and secure.',
      },
      {
        question: 'What happens if an account triggers secondary address verification?',
        answer: 'Accounts include a complete copy of the verification dossier. If routine compliance checks occur, simply re-upload the provided documentation or contact our support team for guidance.',
      },
    ],
  },

  bundle: {
    zh: [
      {
        question: '为什么推荐购买组合包而不是单独账号？',
        answer: '组合包（如支付宝+闲鱼、支付宝+1688）在出厂前已完成底层实名与账号绑核，彻底解决了跨平台绑定时的风控拦截问题，并可节省高达40%采购成本。',
      },
      {
        question: '在1688采购大额货物支持对公转账吗？',
        answer: '支持。企业版组合包已绑定企业支付宝商户，支持大额采购对公结算与批量订单导出。',
      },
      {
        question: '闲鱼买家号需要绑定中国手机号吗？',
        answer: '交付包含已解绑或已配置专属接码服务的完整凭证包，您可在常用设备上直接登录使用。',
      },
    ],
    en: [
      {
        question: 'Why choose linked bundles over standalone accounts?',
        answer: 'Linked bundles (e.g. Alipay + Xianyu, Alipay + 1688) are pre-verified together, completely eliminating cross-platform binding rejections while saving up to 40% in cost.',
      },
      {
        question: 'Does 1688 support wholesale wire transfers with this bundle?',
        answer: 'Yes. Enterprise bundles include linked corporate Alipay accounts configured for high-volume wholesale settlements.',
      },
      {
        question: 'Does the Xianyu buyer account require a Chinese phone number?',
        answer: 'Deliveries include full credentials with SMS verification backup ready for direct login on your device.',
      },
    ],
  },

  verification: {
    zh: [
      {
        question: '实名认证服务包含哪些平台与资料？',
        answer: '支持微信、支付宝、抖音、小红书、闲鱼等主流平台的实名代认证与实名辅助。提供一手合规护照/身份证资料与人脸活体协助。',
      },
      {
        question: '认证后账号会被平台二次审查吗？',
        answer: '所有认证资料均为一手未重复使用资质，配合正常合规使用极低触发二次审查。如遇特殊平台风控，72小时内提供免费协助。',
      },
      {
        question: '实名认证通常需要多长时间完成？',
        answer: '自动化通道通常在 15-30 分钟内完成；人工专席人脸协助订单在 1-2 小时内交付。',
      },
    ],
    en: [
      {
        question: 'Which platforms are supported by the Identity Verification service?',
        answer: 'We support WeChat, Alipay, Douyin, Xiaohongshu, Xianyu, and international FinTech platforms with authentic passport KYC and biometric assist.',
      },
      {
        question: 'Will the account trigger secondary review after verification?',
        answer: 'All identity dossiers are pristine and single-use. Under normal operating practices, secondary triggers are rare. If needed, we provide 72-hour warranty assistance.',
      },
      {
        question: 'How long does identity verification take?',
        answer: 'Automated channels take 15–30 minutes. Custom live biometric assist orders are delivered within 1–2 hours.',
      },
    ],
  },
};

export function getCategoryFaqs(categoryId: string, lang: Lang): CategoryFaq[] {
  const mapKey = categoryId.toLowerCase();
  const found = categoryFaqMap[mapKey] || categoryFaqMap.wechat;
  return lang === 'zh' ? found.zh : found.en;
}
