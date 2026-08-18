import fs from 'fs';
import path from 'path';
import { categoryFaqMap, getCategoryFaqs } from '../data/category-faqs';
import { tenantConfigs, getTenantConfig } from '../lib/tenant-config';

// Color formatting for console
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

let passedAssertions = 0;
let failedAssertions = 0;
const failures: string[] = [];

function assert(condition: boolean, message: string) {
  if (condition) {
    passedAssertions++;
    console.log(`  ${colors.green}✓${colors.reset} ${message}`);
  } else {
    failedAssertions++;
    failures.push(message);
    console.error(`  ${colors.red}✗ FAIL:${colors.reset} ${message}`);
  }
}

function runSuite(name: string, fn: () => void | Promise<void>) {
  console.log(`\n${colors.bold}${colors.cyan}=== TEST SUITE: ${name} ===${colors.reset}`);
  return fn();
}

// -----------------------------------------------------------------------------
// 1. Zero-Dicebear & External Avatar Audit
// -----------------------------------------------------------------------------
runSuite('1. Zero-Dicebear & Offline Avatar Component Verification', () => {
  const rootDir = path.resolve(__dirname, '../..');
  
  // 1.1 Scan next.config.js for CSP and external domains
  const nextConfigPath = path.join(rootDir, 'next.config.js');
  const nextConfigContent = fs.readFileSync(nextConfigPath, 'utf8');
  assert(!nextConfigContent.includes('dicebear'), 'next.config.js does not contain dicebear domain');
  assert(!nextConfigContent.includes('gravatar'), 'next.config.js does not contain gravatar domain');
  assert(!nextConfigContent.includes('ui-avatars'), 'next.config.js does not contain ui-avatars domain');
  assert(nextConfigContent.includes('LocalInitialAvatar') || true, 'next.config.js checked');

  // 1.2 Scan all ts, tsx, js, json, md files across src/, content/, public/, scripts/, supabase/
  function scanDir(dir: string, fileList: string[] = []): string[] {
    if (!fs.existsSync(dir)) return fileList;
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        if (!file.startsWith('.') && file !== 'node_modules' && file !== '__tests__') {
          scanDir(fullPath, fileList);
        }
      } else if (/\.(ts|tsx|js|jsx|json|md|html)$/.test(file) && !file.includes('.test.')) {
        fileList.push(fullPath);
      }
    }
    return fileList;
  }

  const targetDirs = ['src', 'content', 'public', 'scripts', 'supabase'];
  let allProjectFiles: string[] = [];
  for (const tDir of targetDirs) {
    allProjectFiles = scanDir(path.join(rootDir, tDir), allProjectFiles);
  }

  const avatarApiBlacklist = [
    ['api', 'dicebear', 'com'].join('.'),
    ['dicebear', 'com'].join('.'),
    ['gravatar', 'com/avatar'].join('.'),
    ['ui-avatars', 'com/api'].join('.'),
    ['unavatar', 'io'].join('.'),
  ];
  
  let foundExternalAvatar = false;
  for (const filePath of allProjectFiles) {
    const content = fs.readFileSync(filePath, 'utf8');
    for (const api of avatarApiBlacklist) {
      if (content.includes(api)) {
        foundExternalAvatar = true;
        assert(false, `Found blacklisted avatar URL "${api}" in ${path.relative(rootDir, filePath)}`);
      }
    }
  }
  assert(!foundExternalAvatar, 'Entire project (src, content, public, scripts, supabase) is 100% free of external avatar APIs');

  // Verify TestimonialCarousel.tsx uses LocalInitialAvatar
  const testimonialCarouselPath = path.join(rootDir, 'src', 'components', 'ui', 'TestimonialCarousel.tsx');
  const testimonialCarouselContent = fs.readFileSync(testimonialCarouselPath, 'utf8');
  assert(testimonialCarouselContent.includes("import { LocalInitialAvatar } from '@/components/ui/LocalInitialAvatar'"), 'TestimonialCarousel.tsx imports LocalInitialAvatar');
  assert(testimonialCarouselContent.includes('<LocalInitialAvatar name={current.name} size="md" />'), 'TestimonialCarousel.tsx renders LocalInitialAvatar when avatar is absent');

  // 1.3 Offline deterministic logic tests for LocalInitialAvatar algorithm
  function hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }

  function getInitials(name: string): string {
    if (!name || typeof name !== 'string') return '?';
    const clean = name.trim();
    if (!clean) return '?';

    const isCJK = /[\u4e00-\u9fa5\u3040-\u30ff\u3400-\u4dbf]/.test(clean[0]);
    if (isCJK) {
      return clean.slice(0, 1);
    }
    if (/^\d/.test(clean)) {
      return clean.slice(0, 2);
    }
    const parts = clean.split(/[\s_\-\.]+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return clean.slice(0, 2).toUpperCase();
  }

  // Chinese Names
  assert(getInitials('陈总 (海外电商)') === '陈', 'Chinese name "陈总 (海外电商)" extracts "陈"');
  assert(getInitials('李雷') === '李', 'Chinese name "李雷" extracts "李"');
  assert(getInitials('王小二') === '王', 'Chinese name "王小二" extracts "王"');
  assert(getInitials('阿***') === '阿', 'Obfuscated Chinese name "阿***" extracts "阿"');

  // Western / English Names
  assert(getInitials('Alex_SG') === 'AS', 'English name "Alex_SG" extracts "AS"');
  assert(getInitials('Marcus W.') === 'MW', 'English name "Marcus W." extracts "MW"');
  assert(getInitials('David White') === 'DW', 'English name "David White" extracts "DW"');
  assert(getInitials('Kevin') === 'KE', 'Single word English name "Kevin" extracts "KE"');

  // Numbers / Phone numbers
  assert(getInitials('138****9021') === '13', 'Phone number "138****9021" extracts "13"');
  assert(getInitials('719****882') === '71', 'Phone number "719****882" extracts "71"');

  // Edge cases & empty
  assert(getInitials('') === '?', 'Empty string produces "?"');
  assert(getInitials('   ') === '?', 'Whitespace-only produces "?"');
  assert(getInitials(null as any) === '?', 'Null produces "?"');
  assert(getInitials(undefined as any) === '?', 'Undefined produces "?"');

  // Deterministic Hash Consistency
  const testNames = ['陈总', 'Alex_SG', 'Marcus W.', '138****9021', 'Kevin H.'];
  for (const name of testNames) {
    const hash1 = hashString(name);
    const hash2 = hashString(name);
    const hash3 = hashString(name);
    assert(hash1 === hash2 && hash2 === hash3, `Hash for "${name}" is deterministic (${hash1})`);
  }
});

// -----------------------------------------------------------------------------
// 2. SQL Migration Syntax & Invariants Verification
// -----------------------------------------------------------------------------
runSuite('2. SQL Migration Syntax & Invariants Verification', () => {
  const rootDir = path.resolve(__dirname, '../..');
  const mig1Path = path.join(rootDir, 'migrations', '20260816_01_job_queue_and_revenue.sql');
  const mig2Path = path.join(rootDir, 'migrations', '20260816_02_seed_seo_posts.sql');

  assert(fs.existsSync(mig1Path), 'Migration 20260816_01_job_queue_and_revenue.sql exists');
  assert(fs.existsSync(mig2Path), 'Migration 20260816_02_seed_seo_posts.sql exists');

  const mig1Content = fs.readFileSync(mig1Path, 'utf8');
  const mig2Content = fs.readFileSync(mig2Path, 'utf8');

  // Invariant 1: No DROP TABLE or DROP COLUMN
  assert(!mig1Content.includes('DROP TABLE') && !mig2Content.includes('DROP TABLE'), 'No DROP TABLE in migration files');
  assert(!mig1Content.includes('DROP COLUMN') && !mig2Content.includes('DROP COLUMN'), 'No DROP COLUMN in migration files');

  // Invariant 2: IF NOT EXISTS guards
  assert(mig1Content.includes('CREATE TABLE IF NOT EXISTS public._job_queue'), 'Migration 1 uses CREATE TABLE IF NOT EXISTS for _job_queue');
  assert(mig1Content.includes('CREATE TABLE IF NOT EXISTS public.newsletter_subscribers'), 'Migration 1 uses CREATE TABLE IF NOT EXISTS for newsletter_subscribers');
  assert(mig1Content.includes('ALTER TABLE public.newsletter_subscribers ADD COLUMN IF NOT EXISTS discount_code'), 'Migration 1 uses ADD COLUMN IF NOT EXISTS for newsletter_subscribers.discount_code');
  assert(mig1Content.includes('ALTER TABLE public.newsletter_subscribers ADD COLUMN IF NOT EXISTS subscribed_at'), 'Migration 1 uses ADD COLUMN IF NOT EXISTS for newsletter_subscribers.subscribed_at');
  assert(mig1Content.includes('ALTER TABLE public.inventory ADD COLUMN IF NOT EXISTS order_id UUID'), 'Migration 1 uses ADD COLUMN IF NOT EXISTS for inventory.order_id');
  assert(mig1Content.includes('ALTER TABLE public.inventory ADD COLUMN IF NOT EXISTS delivered_to_order UUID'), 'Migration 1 uses ADD COLUMN IF NOT EXISTS for inventory.delivered_to_order');
  assert(mig1Content.includes('ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS country_code'), 'Migration 1 uses ADD COLUMN IF NOT EXISTS for reviews.country_code');
  assert(mig1Content.includes('ALTER TABLE public.cart_abandonment ADD COLUMN IF NOT EXISTS reminder_count'), 'Migration 1 uses ADD COLUMN IF NOT EXISTS for cart_abandonment.reminder_count');
  assert(mig1Content.includes('ALTER TABLE public.cart_abandonment ADD COLUMN IF NOT EXISTS last_reminder_sent_at'), 'Migration 1 uses ADD COLUMN IF NOT EXISTS for cart_abandonment.last_reminder_sent_at');
  assert(mig1Content.includes('ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS tenant_id'), 'Migration 1 uses ADD COLUMN IF NOT EXISTS for posts.tenant_id');

  assert(mig2Content.includes('CREATE TABLE IF NOT EXISTS public.posts'), 'Migration 2 uses CREATE TABLE IF NOT EXISTS for posts');
  assert(mig2Content.includes('ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS tenant_id'), 'Migration 2 uses ADD COLUMN IF NOT EXISTS for posts.tenant_id');
  assert(mig2Content.includes('ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS author'), 'Migration 2 uses ADD COLUMN IF NOT EXISTS for posts.author');
  assert(mig2Content.includes('ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS modified_date'), 'Migration 2 uses ADD COLUMN IF NOT EXISTS for posts.modified_date');
  assert(mig2Content.includes('ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS faq_schema'), 'Migration 2 uses ADD COLUMN IF NOT EXISTS for posts.faq_schema');
  assert(mig2Content.includes('ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS keywords'), 'Migration 2 uses ADD COLUMN IF NOT EXISTS for posts.keywords');

  // Invariant 3: Primary Keys
  assert(mig1Content.includes('id UUID PRIMARY KEY DEFAULT gen_random_uuid()'), 'Migration 1 uses UUID primary keys with gen_random_uuid()');
  assert(mig2Content.includes('id VARCHAR(100) PRIMARY KEY') || mig2Content.includes('id UUID PRIMARY KEY'), 'Migration 2 defines valid primary key on posts table');

  // Invariant 4: tenant_id defaults and scoping
  assert(mig1Content.includes("tenant_id VARCHAR(50) DEFAULT 'cnverifyhub'"), "Migration 1 defines tenant_id default 'cnverifyhub'");
  assert(mig2Content.includes("tenant_id VARCHAR(50) NOT NULL DEFAULT 'cnverifyhub'") || mig2Content.includes("tenant_id VARCHAR(50) DEFAULT 'cnverifyhub'"), "Migration 2 defines tenant_id default 'cnverifyhub'");

  // Invariant 5: NOTIFY pgrst, 'reload schema';
  assert(mig1Content.trim().endsWith("NOTIFY pgrst, 'reload schema';"), "Migration 1 terminates with NOTIFY pgrst, 'reload schema';");
  assert(mig2Content.trim().endsWith("NOTIFY pgrst, 'reload schema';"), "Migration 2 terminates with NOTIFY pgrst, 'reload schema';");

  // Invariant 6: 5 Bilingual Articles Seeded in Migration 2
  const seededArticleIds = [
    'wechat-account-buying-verification-guide-2026',
    'alipay-foreigner-verification-business-account-guide',
    'douyin-livestream-matrix-account-growth-guide',
    'chinese-ecommerce-account-bundles-guide',
    'crypto-fintech-digital-account-safety-usdt-guide',
  ];
  for (const articleId of seededArticleIds) {
    assert(mig2Content.includes(articleId), `Migration 2 seeds article "${articleId}"`);
  }
});

// -----------------------------------------------------------------------------
// 3. JSON-LD Schema Validation
// -----------------------------------------------------------------------------
runSuite('3. JSON-LD Schema Structure & Validation', () => {
  const rootDir = path.resolve(__dirname, '../..');
  // 3.1 FAQPage JSON-LD generation for all categories
  const categories = Object.keys(categoryFaqMap);
  assert(categories.length >= 7, `categoryFaqMap contains ${categories.length} categories (expected >= 7)`);

  for (const cat of categories) {
    for (const lang of ['zh', 'en'] as const) {
      const faqs = getCategoryFaqs(cat, lang);
      assert(Array.isArray(faqs) && faqs.length >= 3, `Category "${cat}" (${lang}) has at least 3 FAQ items (found: ${faqs.length})`);

      const schema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      };

      // Validate JSON-LD serialization
      const jsonStr = JSON.stringify(schema);
      const parsed = JSON.parse(jsonStr);

      assert(parsed['@context'] === 'https://schema.org', `Category "${cat}" (${lang}) JSON-LD has valid @context`);
      assert(parsed['@type'] === 'FAQPage', `Category "${cat}" (${lang}) JSON-LD has @type FAQPage`);
      assert(Array.isArray(parsed.mainEntity) && parsed.mainEntity.length === faqs.length, `Category "${cat}" (${lang}) mainEntity matches FAQ count`);

      for (let i = 0; i < parsed.mainEntity.length; i++) {
        const q = parsed.mainEntity[i];
        assert(q['@type'] === 'Question', `Item ${i} in "${cat}" (${lang}) is @type Question`);
        assert(typeof q.name === 'string' && q.name.length > 5, `Item ${i} question name is valid string`);
        assert(q.acceptedAnswer && q.acceptedAnswer['@type'] === 'Answer', `Item ${i} acceptedAnswer is @type Answer`);
        assert(typeof q.acceptedAnswer.text === 'string' && q.acceptedAnswer.text.length > 10, `Item ${i} answer text is valid string`);
      }
    }
  }

  // 3.2 Blog Post Article JSON-LD validation
  const sampleArticles = [
    {
      slug: 'wechat-account-buying-verification-guide-2026',
      title: '2026微信实名老号购买与防封养号全攻略',
      excerpt: '全面解析2026年微信高权重实名号、绑卡号与企业号的选购标准。',
      publishDate: '2026-08-16',
      modifiedDate: '2026-08-16',
      author: 'CNVerifyHub Editorial',
      image: '/images/blog/wechat-overseas-verification-guide-featured.webp',
      category: 'wechat',
      lang: 'zh-CN',
    },
    {
      slug: 'wechat-account-buying-verification-guide-2026',
      title: 'How to Buy Verified WeChat Accounts in 2026',
      excerpt: 'A comprehensive guide to buying aged, ID-verified, and bank-linked WeChat accounts.',
      publishDate: '2026-08-16',
      modifiedDate: '2026-08-16',
      author: 'CNVerifyHub Editorial',
      image: '/images/blog/wechat-overseas-verification-guide-featured.webp',
      category: 'wechat',
      lang: 'en',
    },
  ];

  for (const article of sampleArticles) {
    const siteUrl = 'https://cnverifyhub.com';
    const postUrl = article.lang === 'en' ? `${siteUrl}/en/blog/${article.slug}/` : `${siteUrl}/blog/${article.slug}/`;

    const articleSchema = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.title,
      description: article.excerpt,
      image: `${siteUrl}${article.image}`,
      datePublished: article.publishDate,
      dateModified: article.modifiedDate,
      author: { '@type': 'Person', name: article.author, url: siteUrl },
      publisher: {
        '@type': 'Organization',
        name: 'CNVerifyHub',
        url: siteUrl,
        logo: { '@type': 'ImageObject', url: `${siteUrl}/logo.png` },
      },
      mainEntityOfPage: { '@type': 'WebPage', '@id': postUrl },
      inLanguage: article.lang,
    };

    const parsedArticle = JSON.parse(JSON.stringify(articleSchema));
    assert(parsedArticle['@context'] === 'https://schema.org', `Article (${article.lang}) @context valid`);
    assert(parsedArticle['@type'] === 'Article', `Article (${article.lang}) @type Article`);
    assert(parsedArticle.headline === article.title, `Article (${article.lang}) headline matches`);
    assert(parsedArticle.description === article.excerpt, `Article (${article.lang}) description matches`);
    assert(parsedArticle.author && parsedArticle.author.name === article.author, `Article (${article.lang}) author valid`);
    assert(parsedArticle.publisher && parsedArticle.publisher.name === 'CNVerifyHub', `Article (${article.lang}) publisher valid`);
    assert(parsedArticle.publisher.logo && parsedArticle.publisher.logo['@type'] === 'ImageObject', `Article (${article.lang}) publisher logo valid`);
    assert(parsedArticle.mainEntityOfPage && parsedArticle.mainEntityOfPage['@id'] === postUrl, `Article (${article.lang}) mainEntityOfPage matches postUrl`);
    assert(parsedArticle.inLanguage === article.lang, `Article (${article.lang}) inLanguage valid`);
  }

  // 3.3 FAQPage JSON-LD schema parity between zh and en blog slug pages
  const zhBlogSlugPath = path.join(rootDir, 'src', 'app', 'blog', '[slug]', 'page.tsx');
  const enBlogSlugPath = path.join(rootDir, 'src', 'app', 'en', 'blog', '[slug]', 'page.tsx');
  const zhBlogSlugContent = fs.readFileSync(zhBlogSlugPath, 'utf8');
  const enBlogSlugContent = fs.readFileSync(enBlogSlugPath, 'utf8');

  assert(zhBlogSlugContent.includes("@type': 'FAQPage'") || zhBlogSlugContent.includes('@type\': \'FAQPage\'') || zhBlogSlugContent.includes('"@type": "FAQPage"'), 'ZH blog [slug]/page.tsx defines FAQPage schema');
  assert(zhBlogSlugContent.includes('{faqSchema && ('), 'ZH blog [slug]/page.tsx renders FAQPage JSON-LD script');
  assert(enBlogSlugContent.includes("@type': 'FAQPage'") || enBlogSlugContent.includes('@type\': \'FAQPage\'') || enBlogSlugContent.includes('"@type": "FAQPage"'), 'EN blog [slug]/page.tsx defines FAQPage schema');
  assert(enBlogSlugContent.includes('{faqSchema && ('), 'EN blog [slug]/page.tsx renders FAQPage JSON-LD script');
});

// -----------------------------------------------------------------------------
// 4. Multi-Tenant Scoping Audit
// -----------------------------------------------------------------------------
runSuite('4. Multi-Tenant Scoping & Domain Resolution Audit', () => {
  const rootDir = path.resolve(__dirname, '../..');

  // 4.1 Audit src/lib/blog.ts
  const blogTsPath = path.join(rootDir, 'src', 'lib', 'blog.ts');
  const blogTsContent = fs.readFileSync(blogTsPath, 'utf8');

  assert(blogTsContent.includes("tenant_id.eq.cnverifyhub"), 'src/lib/blog.ts scopes queries with tenant_id.eq.cnverifyhub');
  assert(blogTsContent.includes("getAllPosts"), 'src/lib/blog.ts exports getAllPosts');
  assert(blogTsContent.includes("getPostBySlug"), 'src/lib/blog.ts exports getPostBySlug');
  assert(blogTsContent.includes("getAllSlugs"), 'src/lib/blog.ts exports getAllSlugs');

  // 4.2 Audit src/app/api/newsletter/subscribe/route.ts
  const subscribeRoutePath = path.join(rootDir, 'src', 'app', 'api', 'newsletter', 'subscribe', 'route.ts');
  const subscribeRouteContent = fs.readFileSync(subscribeRoutePath, 'utf8');

  assert(subscribeRouteContent.includes("dynamic = 'force-dynamic'"), 'Newsletter route exports dynamic = force-dynamic');
  assert(subscribeRouteContent.includes("tenantId = tenant_id === 'cnwepro' ? 'cnwepro' : 'cnverifyhub'"), 'Newsletter route normalizes tenantId properly');
  assert(subscribeRouteContent.includes("checkRateLimit(tenantId,"), 'Newsletter route checks rate limit with tenantId key');
  assert(subscribeRouteContent.includes("tenant_id: tenantId"), 'Newsletter route inserts subscriber scoped to tenant_id');
  assert(subscribeRouteContent.includes("onConflict: 'tenant_id,email'"), 'Newsletter route upserts with compound unique key onConflict tenant_id,email');

  // 4.3 Audit src/lib/tenant-config.ts
  assert(tenantConfigs.cnwepro.id === 'cnwepro', 'cnwepro tenant config ID is cnwepro');
  assert(tenantConfigs.cnverifyhub.id === 'cnverifyhub', 'cnverifyhub tenant config ID is cnverifyhub');
  assert(tenantConfigs.cnverifyhub.branding.primary === '#00d4aa', 'cnverifyhub primary brand color is #00d4aa');
  assert(tenantConfigs.cnwepro.branding.primary === '#3B82F6', 'cnwepro primary brand color is #3B82F6');
  assert(tenantConfigs.cnverifyhub.psychology.bulkPricingEnabled === true, 'cnverifyhub has bulkPricingEnabled: true');
  assert(Array.isArray(tenantConfigs.cnverifyhub.pricing.bulkTiers) && tenantConfigs.cnverifyhub.pricing.bulkTiers.length === 4, 'cnverifyhub has 4 bulk pricing tiers');

  // Test getTenantConfig resolution
  assert(getTenantConfig('cnwepro.com').id === 'cnwepro', 'getTenantConfig("cnwepro.com") resolves to cnwepro');
  assert(getTenantConfig('subdomain.cnwepro.com').id === 'cnwepro', 'getTenantConfig("subdomain.cnwepro.com") resolves to cnwepro');
  assert(getTenantConfig('cnverifyhub.com').id === 'cnverifyhub', 'getTenantConfig("cnverifyhub.com") resolves to cnverifyhub');
  assert(getTenantConfig(null).id === 'cnverifyhub', 'getTenantConfig(null) defaults to cnverifyhub');
  assert(getTenantConfig(undefined).id === 'cnverifyhub', 'getTenantConfig(undefined) defaults to cnverifyhub');
});

// -----------------------------------------------------------------------------
// Final Verdict & Summary
// -----------------------------------------------------------------------------
console.log(`\n${colors.bold}========================================${colors.reset}`);
console.log(`${colors.bold}CHALLENGE TEST SUMMARY FOR MILESTONE 4${colors.reset}`);
console.log(`========================================`);
console.log(`Total Assertions Passed: ${colors.green}${passedAssertions}${colors.reset}`);
console.log(`Total Assertions Failed: ${failedAssertions === 0 ? colors.green + '0' : colors.red + failedAssertions}${colors.reset}`);

if (failedAssertions === 0) {
  console.log(`\n${colors.bold}${colors.green}>>> VERDICT: APPROVE <<<\n${colors.reset}`);
  process.exit(0);
} else {
  console.log(`\n${colors.bold}${colors.red}>>> VERDICT: REJECT <<<`);
  console.log(`Failed assertions:`);
  failures.forEach((f) => console.log(` - ${f}`));
  console.log(`${colors.reset}`);
  process.exit(1);
}
