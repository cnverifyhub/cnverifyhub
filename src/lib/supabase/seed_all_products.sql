-- ===================================================
-- CNVerifyHub COMPLETE PRODUCT CATALOG SEED
-- ===================================================

INSERT INTO public.products 
(id, category, subcategory, type, name_en, name_zh, description_en, description_zh, price_usdt, stock_count, is_featured, sort_order)
VALUES 
-- WeChat
('wechat-basic', 'wechat', 'standard', 'account', 'WeChat Basic', '微信基础白号', 'Basic WeChat account with no warranty. Shipping: 30m-1h', '基础无质保微信号，发货时间30分钟-1小时', 28.80, 14, false, 1),
('wechat-premium', 'wechat', 'premium', 'account', 'WeChat Advanced Real-Name Account', '微信高级实名号', 'High-quality ID-verified WeChat', '高质量已实名认证的微信号', 38.80, 18, true, 2),
('wechat-bankcard', 'wechat', 'bankcard', 'account', 'WeChat Card Linked', '微信绑卡高级实名号', 'Verified with bank card linked', '已实名并绑定银行实名卡', 58.80, 12, true, 3),

-- Alipay
('alipay-basic', 'alipay', 'basic', 'account', 'Alipay Basic', '支付宝基础版', 'Standard basic Alipay account', '支付宝标准基础账号', 48.80, 16, false, 1),
('alipay-huabei', 'alipay', 'huabei', 'account', 'Alipay Huabei', '支付宝花呗号', 'Alipay with Huabei enabled', '已开通花呗的高级支付宝号', 58.80, 12, true, 2),

-- Douyin
('douyin-fresh', 'douyin', 'fresh', 'account', 'Douyin Fresh Account', '抖音全新号', 'Freshly registered standard Douyin account', '全新注册，支持手机号登录，权重正常', 20.54, 80, false, 1),
('douyin-verified', 'douyin', 'verified', 'account', 'Douyin Verified Account', '抖音实名号', 'High-quality ID-verified Douyin', '已完成实名认证的高质量抖音号', 50.44, 15, true, 2),
('douyin-aged', 'douyin', 'aged', 'account', 'Douyin Aged (1+ Year)', '抖音老号 (1年+)', '1+ year old Douyin account', '注册满一年以上的抖音号', 37.44, 17, false, 6),

-- QQ
('qq-fresh', 'qq', 'fresh', 'account', 'QQ Fresh Account', 'QQ全新号', 'Freshly registered standard QQ, safety checked', '全新正常注册QQ号，安全检查通过', 33.54, 100, false, 1),
('qq-aged-pro', 'qq', 'aged', 'account', 'QQ Aged Account', 'QQ高级老号', 'High-quality aged QQ account', '高质量QQ老号，权重高', 50.44, 11, true, 2),
('qq-super-vip', 'qq', 'vip', 'account', 'QQ Super VIP Status', 'QQ超级VIP版', 'Premium number with Super VIP included', '自带超级会员的优质号码', 154.44, 15, false, 3),

-- Xianyu
('xianyu-standard', 'xianyu', 'standard', 'account', 'Xianyu Standard Verified', '闲鱼标准实名号', 'Standard Xianyu account', '标准闲鱼二手交易账号，安全可靠', 48.80, 15, false, 1),
('xianyu-aged', 'xianyu', 'aged', 'account', 'Xianyu Premium Aged', '闲鱼优质老号', 'High credit score aged Xianyu account', '高信誉分闲鱼老号', 68.80, 8, true, 2),

-- Taobao
('taobao-basic', 'taobao', 'basic', 'account', 'Taobao Basic', '淘宝基础买家号', 'High-quality fresh buyer account, verified', '高质量新注册买家账号，已过实名', 29.12, 40, false, 1),
('taobao-vip', 'taobao', 'vip-aged', 'account', 'Taobao VIP Aged Account', '淘宝VIP老号', 'High Taoqi score aged account', '高等级淘气值老号', 63.44, 12, true, 2),

-- Xiaohongshu
('xiaohongshu-basic', 'xiaohongshu', 'basic', 'account', 'Xiaohongshu Basic', '小红书基础号', 'High-quality fresh account for daily interaction', '高质量新注册账号，适合日常互动', 32.14, 50, false, 1),
('xiaohongshu-verified', 'xiaohongshu', 'verified', 'account', 'Xiaohongshu Verified', '小红书实名号', 'Verified account with higher authority and anti-ban', '已完成实名认证，权重更高，不易封号', 41.39, 30, false, 2),
('xiaohongshu-aged', 'xiaohongshu', 'aged', 'account', 'Xiaohongshu Aged', '小红书老号', '1+ year aged account with extremely high authority', '注册时间1年以上老号，权重极高', 53.89, 20, false, 3),
('xiaohongshu-1k', 'xiaohongshu', '1k-followers', 'account', 'Xiaohongshu 1K Followers', '小红书千粉号', '1000+ real followers, perfect for fast growth', '自带1000+真实粉丝，适合快速起号', 81.67, 15, false, 4),
('xiaohongshu-10k', 'xiaohongshu', '10k-followers', 'account', 'Xiaohongshu 10K Followers', '小红书万粉号', '10000+ real followers, high exposure authority', '自带10000+真实粉丝，高曝光权重', 177.78, 10, false, 5),
('xiaohongshu-brand', 'xiaohongshu', 'brand-store', 'account', 'Xiaohongshu Brand Store', '小红书品牌店', 'Brand account enabled, ready for corporate operation', '已开通品牌号权限，适合企业直接运营', 400.00, 5, false, 6),

-- Bundles
('bundle-alipay-xianyu', 'bundle', 'alipay-xianyu-bundle', 'bundle', 'Alipay + Xianyu Combo', '支付宝+闲鱼 组合账号', 'One-stop solution for Xianyu login. Verified Alipay + linked Xianyu account.', '一站解决闲鱼登录难题，支付宝实名认证+闲鱼账号绑定发货', 65.00, 47, true, 1),
('bundle-alipay-taobao', 'bundle', 'alipay-taobao-bundle', 'bundle', 'Alipay + Taobao Bundle', '支付宝+淘宝 购物套装', 'Verified Alipay + Taobao buyer account with purchase history.', '支付宝实名认证+淘宝买家号，支持历史订单查询', 60.00, 32, false, 2),
('bundle-alipay-1688', 'bundle', 'alipay-1688-bundle', 'bundle', 'Alipay Business + 1688 Bundle', '支付宝企业+1688 批发套装', 'Enterprise Alipay + 1688 seller/buyer account.', '企业支付宝+1688卖家/买家号，适合一件代发', 75.00, 15, false, 3),
('bundle-wechat-jd', 'bundle', 'wechat-jd-bundle', 'bundle', 'WeChat + JD.com Bundle', '微信+京东 购物套装', 'Verified WeChat + JD.com account with baitiao ready.', '已实名微信账号+京东白条号，购物无忧', 85.00, 22, false, 4),
('bundle-full-suite', 'bundle', 'full-ecommerce-suite', 'bundle', 'Full E-commerce Suite', '全能电商全家桶', 'Complete suite of WeChat, Alipay, Taobao, and PDD accounts.', '包含微信、支付宝、淘宝、拼多多全套实名资料', 150.00, 10, true, 5),

-- Verification Services
('verify-passport', 'verification', 'passport', 'service', 'Passport Verification Service', '护照实名代认证', 'Passport verification for major platforms.', '支持支付宝、微信、跨境平台护照实名认证', 80.00, 99, false, 1),
('verify-face', 'verification', 'face-verify', 'service', 'Face Recognition Verification', '人脸识别验证', 'Bypass face recognition hurdles for apps.', '解决APP登录过程中遇到的人脸验证难题', 50.00, 99, false, 2),
('verify-kyc', 'verification', 'kyc-package', 'service', 'Full KYC Package', '全套KYC验证包', 'Includes ID, holding ID photo, and face data.', '包含身份证、手持、人脸全套验证资料', 120.00, 99, false, 3),
('verify-wechat', 'verification', 'wechat-realname', 'service', 'WeChat Realname Activation', '微信实名激活', 'Activate payment and ID status for your WeChat.', '为您的微信账号激活支付及实名功能', 45.00, 99, false, 4),
('verify-alipay', 'verification', 'alipay-realname', 'service', 'Alipay Realname Activation', '支付宝实名激活', 'Full feature ID activation for Alipay.', '为您的支付宝账号激活全功能实名', 45.00, 99, false, 5),

-- Trading
('xm-account', 'trading', 'xm-account', 'account', 'XM Trading Account', 'XM 交易账户', 'Verified XM trading account, MT4/MT5 ready.', '已完成实名验证的XM交易账户，支持MT4/MT5', 28.80, 5, false, 1),
('hfm-account', 'trading', 'hfm-account', 'account', 'HFM Trading Account', 'HFM 交易账户', 'Verified HFM account, ultra-low spread.', '已完成实名验证的HFM账户，极低点差', 26.80, 8, false, 2),
('neteller-account', 'trading', 'neteller-account', 'account', 'Neteller Wallet', 'Neteller 电子钱包', 'Verified Neteller e-wallet.', '已实名认证的Neteller电子钱包', 32.40, 15, false, 3),
('skrill-account', 'trading', 'skrill-account', 'account', 'Skrill Wallet', 'Skrill 电子钱包', 'Verified Skrill e-wallet.', '已实名认证的Skrill电子钱包', 90.00, 12, false, 4),
('payoneer-account', 'trading', 'payoneer-account', 'account', 'Payoneer Account', 'Payoneer 账户', 'Verified Payoneer account for global payments.', '已通过KYC的Payoneer账户，支持全球收款', 50.50, 5, false, 5),
('wise-account', 'trading', 'wise-account', 'account', 'Wise Account', 'Wise 账户', 'Verified Wise multi-currency account.', '已完成实名验证的Wise账户，支持多币种', 45.80, 3, false, 6),
('revolut-account', 'trading', 'revolut-account', 'account', 'Revolut Personal/Business', 'Revolut 个人/商业账户', 'Verified Revolut account with multi-currency and virtual cards.', '已完成KYC验证的Revolut账户，支持多币种及虚拟卡', 55.00, 5, false, 7)

ON CONFLICT (id) DO UPDATE SET 
    price_usdt = EXCLUDED.price_usdt,
    stock_count = EXCLUDED.stock_count,
    is_featured = EXCLUDED.is_featured,
    sort_order = EXCLUDED.sort_order,
    updated_at = now();
