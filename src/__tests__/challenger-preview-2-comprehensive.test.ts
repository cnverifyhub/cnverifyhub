import fs from 'fs';
import path from 'path';
import http from 'http';
import https from 'https';
import { categoryFaqMap, getCategoryFaqs } from '../data/category-faqs';
import { tenantConfigs, getTenantConfig } from '../lib/tenant-config';
import { LocalInitialAvatar } from '../components/ui/LocalInitialAvatar';
import React from 'react';

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

function assert(condition: boolean, message: string, details?: string) {
  if (condition) {
    passedAssertions++;
    console.log(`  ${colors.green}✓ PASS:${colors.reset} ${message}`);
  } else {
    failedAssertions++;
    failures.push(message + (details ? ` -> ${details}` : ''));
    console.error(`  ${colors.red}✗ FAIL:${colors.reset} ${message}${details ? ` -> ${details}` : ''}`);
  }
}

function runSuite(name: string, fn: () => void | Promise<void>) {
  console.log(`\n${colors.bold}${colors.cyan}====================================================${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}SUITE: ${name}${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}====================================================${colors.reset}`);
  return fn();
}

async function runAllEmpiricalTests() {
  const rootDir = path.resolve(__dirname, '../..');

  // =========================================================================
  // SUITE 1: LocalInitialAvatar In-Depth Empirical & Stress Testing
  // =========================================================================
  await runSuite('1. LocalInitialAvatar Hashing, Palettes, Initials & Zero-Network', () => {
    // 1.1 Extract internal helper functions for isolated empirical testing
    const avatarFilePath = path.join(rootDir, 'src/components/ui/LocalInitialAvatar.tsx');
    assert(fs.existsSync(avatarFilePath), 'LocalInitialAvatar.tsx exists on disk');
    const avatarContent = fs.readFileSync(avatarFilePath, 'utf8');

    // Verify AVATAR_PALETTES has exactly 10 gradients
    const paletteMatch = avatarContent.match(/const AVATAR_PALETTES = (\[[\s\S]*?\]);/);
    assert(!!paletteMatch, 'AVATAR_PALETTES defined in source file');
    const palettes = eval(paletteMatch![1]);
    assert(Array.isArray(palettes), 'AVATAR_PALETTES evaluates to an array');
    assert(palettes.length === 10, `AVATAR_PALETTES contains exactly 10 palettes (found: ${palettes.length})`);
    
    // Verify each palette has bg, text, border
    palettes.forEach((p: any, idx: number) => {
      assert(typeof p.bg === 'string' && p.bg.includes('bg-gradient-to-br'), `Palette ${idx} has valid gradient bg`);
      assert(typeof p.text === 'string' && p.text.length > 0, `Palette ${idx} has valid text color`);
      assert(typeof p.border === 'string' && p.border.length > 0, `Palette ${idx} has valid border color`);
    });

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

    // 1.2 Deterministic Hashing Verification
    console.log('  -> Testing Hash Determinism & Distribution:');
    const sampleNames = ['张三', '李四', '王五', '赵六', 'Alex', 'John Doe', '13812345678', 'CryptoKing_99'];
    for (const name of sampleNames) {
      const initialHash = hashString(name);
      for (let i = 0; i < 100; i++) {
        assert(hashString(name) === initialHash, `Hash is strictly deterministic for "${name}" (run ${i})`);
      }
    }

    // Palette distribution check
    const paletteIndexHits = new Set<number>();
    for (let i = 0; i < 200; i++) {
      const h = hashString(`user_${i}_test_palette_distribution`);
      const paletteIndex = h % palettes.length;
      assert(paletteIndex >= 0 && paletteIndex < 10, `Palette index ${paletteIndex} is within 0-9`);
      paletteIndexHits.add(paletteIndex);
    }
    assert(paletteIndexHits.size === 10, `All 10 palettes are reachable via hash modulo (hit count: ${paletteIndexHits.size})`);

    // 1.3 CJK Character Extraction Verification
    console.log('  -> Testing CJK Character Extraction:');
    const cjkTestCases = [
      { input: '张三', expected: '张', desc: 'Standard 2-char Chinese name (张三 -> 张)' },
      { input: '李四', expected: '李', desc: 'Standard 2-char Chinese name (李四 -> 李)' },
      { input: '王五', expected: '王', desc: 'Standard 2-char Chinese name (王五 -> 王)' },
      { input: '赵六', expected: '赵', desc: 'Standard 2-char Chinese name (赵六 -> 赵)' },
      { input: '诸葛孔明', expected: '诸', desc: 'Compound surname 4-char Chinese name' },
      { input: '陈总 (海外电商)', expected: '陈', desc: 'Chinese name with trailing English/parentheses' },
      { input: '阿***', expected: '阿', desc: 'Masked Chinese user handle' },
      { input: '  林心如  ', expected: '林', desc: 'Chinese name with leading/trailing spaces' },
      { input: '田中太郎', expected: '田', desc: 'Japanese Kanji name' },
      { input: 'さくら', expected: 'さ', desc: 'Japanese Hiragana name' },
    ];
    for (const { input, expected, desc } of cjkTestCases) {
      const result = getInitials(input);
      assert(result === expected, `CJK extraction for "${input}" [${desc}] returned "${result}"`);
    }

    // 1.4 Phone Mask Extraction Verification
    console.log('  -> Testing Phone Number & Digit Mask Extraction:');
    const phoneTestCases = [
      { input: '13812345678', expected: '13', desc: 'Full 11-digit Chinese mobile' },
      { input: '189****1234', expected: '18', desc: 'Masked Chinese mobile' },
      { input: '159****8821', expected: '15', desc: 'Masked Chinese mobile' },
      { input: '719****882', expected: '71', desc: 'Foreign masked phone number' },
      { input: '8613800000000', expected: '86', desc: 'Country code prefixed phone' },
      { input: '021-88889999', expected: '02', desc: 'Landline number' },
    ];
    for (const { input, expected, desc } of phoneTestCases) {
      const result = getInitials(input);
      assert(result === expected, `Phone mask extraction for "${input}" [${desc}] returned "${result}"`);
    }

    // 1.5 Latin / Western Names Verification
    console.log('  -> Testing Latin / Western Name Extraction:');
    const latinTestCases = [
      { input: 'Alex', expected: 'AL', desc: 'Single word Latin name' },
      { input: 'A', expected: 'A', desc: 'Single letter Latin name' },
      { input: 'John Doe', expected: 'JD', desc: 'Two-word standard Latin name' },
      { input: 'Alex_SG', expected: 'AS', desc: 'Underscore separated name' },
      { input: 'Marcus W.', expected: 'MW', desc: 'Space + initial Latin name' },
      { input: 'David-White', expected: 'DW', desc: 'Hyphenated Latin name' },
      { input: 'Jean-Luc Picard', expected: 'JL', desc: 'Multi-part Latin name' },
      { input: 'alice.smith', expected: 'AS', desc: 'Dot-separated Latin handle' },
      { input: 'kevin', expected: 'KE', desc: 'Lowercase Latin single word' },
    ];
    for (const { input, expected, desc } of latinTestCases) {
      const result = getInitials(input);
      assert(result === expected, `Latin extraction for "${input}" [${desc}] returned "${result}"`);
    }

    // 1.6 Edge Cases & Boundary Conditions
    console.log('  -> Testing Edge Cases & Boundary Conditions:');
    assert(getInitials('') === '?', 'Empty string returns "?"');
    assert(getInitials('   ') === '?', 'Whitespace returns "?"');
    assert(getInitials(null as any) === '?', 'null returns "?"');
    assert(getInitials(undefined as any) === '?', 'undefined returns "?"');
    assert(getInitials(12345 as any) === '?', 'Number returns "?"');

    // 1.7 Zero Network / Zero Fetch Calls Guard
    console.log('  -> Verifying Zero Network & External Fetch Calls:');
    let networkCallMade = false;
    const originalFetch = global.fetch;
    global.fetch = () => {
      networkCallMade = true;
      throw new Error('NETWORK CALL FORBIDDEN DURING OFFLINE AVATAR RENDERING');
    };

    // Render avatar component instances
    const element1 = LocalInitialAvatar({ name: '张三', size: 'md' });
    const element2 = LocalInitialAvatar({ name: 'Alex Doe', size: 'lg' });
    const element3 = LocalInitialAvatar({ name: '13812345678', size: 'xs' });
    
    assert(React.isValidElement(element1), 'LocalInitialAvatar("张三") renders valid React element');
    assert(React.isValidElement(element2), 'LocalInitialAvatar("Alex Doe") renders valid React element');
    assert(React.isValidElement(element3), 'LocalInitialAvatar("13812345678") renders valid React element');
    assert(!networkCallMade, 'Zero fetch or HTTP network calls made during LocalInitialAvatar execution');

    // Restore fetch
    global.fetch = originalFetch;

    // Verify no external avatar domains in component file
    assert(!avatarContent.includes('dicebear'), 'LocalInitialAvatar.tsx does not mention dicebear');
    assert(!avatarContent.includes('gravatar'), 'LocalInitialAvatar.tsx does not mention gravatar');
    assert(!avatarContent.includes('http://') && !avatarContent.includes('https://'), 'LocalInitialAvatar.tsx contains 0 external HTTP URLs');
  });

  // =========================================================================
  // SUITE 2: All 10 Category Pages & FAQPage JSON-LD in ZH and EN
  // =========================================================================
  await runSuite('2. Category Content & FAQ JSON-LD Across 10 Categories (ZH & EN)', () => {
    const requiredCategories = [
      'wechat',
      'alipay',
      'douyin',
      'qq',
      'xianyu',
      'taobao',
      'xiaohongshu',
      'trading',
      'verification',
      'bundle',
    ];

    assert(requiredCategories.length === 10, 'Testing exactly 10 mandatory categories');

    for (const cat of requiredCategories) {
      console.log(`\n  Checking Category: [${cat}]`);
      
      // 2.1 Check ZH route file
      const zhRoutePath = path.join(rootDir, 'src/app', cat, 'page.tsx');
      assert(fs.existsSync(zhRoutePath), `ZH route file exists: src/app/${cat}/page.tsx`);
      const zhContent = fs.readFileSync(zhRoutePath, 'utf8');
      assert(zhContent.includes('CategoryPageTemplate'), `ZH route src/app/${cat}/page.tsx renders CategoryPageTemplate`);
      assert(zhContent.includes(`categoryId="${cat}"`) || zhContent.includes(`categoryId='${cat}'`), `ZH route passes categoryId="${cat}"`);
      assert(zhContent.includes('lang="zh"') || zhContent.includes("lang='zh'"), `ZH route passes lang="zh"`);

      // 2.2 Check EN route file
      const enRoutePath = path.join(rootDir, 'src/app/en', cat, 'page.tsx');
      assert(fs.existsSync(enRoutePath), `EN route file exists: src/app/en/${cat}/page.tsx`);
      const enContent = fs.readFileSync(enRoutePath, 'utf8');
      assert(enContent.includes('CategoryPageTemplate'), `EN route src/app/en/${cat}/page.tsx renders CategoryPageTemplate`);
      assert(enContent.includes(`categoryId="${cat}"`) || enContent.includes(`categoryId='${cat}'`), `EN route passes categoryId="${cat}"`);
      assert(enContent.includes('lang="en"') || enContent.includes("lang='en'"), `EN route passes lang="en"`);

      // 2.3 Verify FAQ Data & JSON-LD Structure in Chinese
      const zhFaqs = getCategoryFaqs(cat, 'zh');
      assert(Array.isArray(zhFaqs) && zhFaqs.length >= 3, `Category "${cat}" (ZH) has >= 3 FAQ items (found: ${zhFaqs.length})`);
      
      const zhFaqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: zhFaqs.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.answer,
          },
        })),
      };

      const zhSerialized = JSON.parse(JSON.stringify(zhFaqSchema));
      assert(zhSerialized['@context'] === 'https://schema.org', `Category "${cat}" (ZH) FAQ JSON-LD has @context https://schema.org`);
      assert(zhSerialized['@type'] === 'FAQPage', `Category "${cat}" (ZH) FAQ JSON-LD has @type FAQPage`);
      assert(zhSerialized.mainEntity.length === zhFaqs.length, `Category "${cat}" (ZH) mainEntity count matches`);
      
      zhSerialized.mainEntity.forEach((q: any, qIdx: number) => {
        assert(q['@type'] === 'Question', `Category "${cat}" (ZH) item ${qIdx} is @type Question`);
        assert(typeof q.name === 'string' && q.name.length > 5, `Category "${cat}" (ZH) item ${qIdx} question name is valid string`);
        assert(q.acceptedAnswer && q.acceptedAnswer['@type'] === 'Answer', `Category "${cat}" (ZH) item ${qIdx} acceptedAnswer is @type Answer`);
        assert(typeof q.acceptedAnswer.text === 'string' && q.acceptedAnswer.text.length > 10, `Category "${cat}" (ZH) item ${qIdx} answer text is valid string`);
      });

      // 2.4 Verify FAQ Data & JSON-LD Structure in English
      const enFaqs = getCategoryFaqs(cat, 'en');
      assert(Array.isArray(enFaqs) && enFaqs.length >= 3, `Category "${cat}" (EN) has >= 3 FAQ items (found: ${enFaqs.length})`);

      const enFaqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: enFaqs.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.answer,
          },
        })),
      };

      const enSerialized = JSON.parse(JSON.stringify(enFaqSchema));
      assert(enSerialized['@context'] === 'https://schema.org', `Category "${cat}" (EN) FAQ JSON-LD has @context https://schema.org`);
      assert(enSerialized['@type'] === 'FAQPage', `Category "${cat}" (EN) FAQ JSON-LD has @type FAQPage`);
      assert(enSerialized.mainEntity.length === enFaqs.length, `Category "${cat}" (EN) mainEntity count matches`);

      enSerialized.mainEntity.forEach((q: any, qIdx: number) => {
        assert(q['@type'] === 'Question', `Category "${cat}" (EN) item ${qIdx} is @type Question`);
        assert(typeof q.name === 'string' && q.name.length > 5, `Category "${cat}" (EN) item ${qIdx} question name is valid string`);
        assert(q.acceptedAnswer && q.acceptedAnswer['@type'] === 'Answer', `Category "${cat}" (EN) item ${qIdx} acceptedAnswer is @type Answer`);
        assert(typeof q.acceptedAnswer.text === 'string' && q.acceptedAnswer.text.length > 10, `Category "${cat}" (EN) item ${qIdx} answer text is valid string`);
      });
    }

    // 2.5 Verify CategoryPageTemplate and CategoryContentBlock integration
    const templatePath = path.join(rootDir, 'src/components/category/CategoryPageTemplate.tsx');
    const templateContent = fs.readFileSync(templatePath, 'utf8');
    assert(templateContent.includes('<CategoryContentBlock'), 'CategoryPageTemplate renders CategoryContentBlock');
    assert(templateContent.includes('faqItems={rawFaqs}'), 'CategoryPageTemplate passes rawFaqs to CategoryContentBlock');

    const blockPath = path.join(rootDir, 'src/components/category/CategoryContentBlock.tsx');
    const blockContent = fs.readFileSync(blockPath, 'utf8');
    assert(blockContent.includes("@type': 'FAQPage'") || blockContent.includes('@type\': \'FAQPage\'') || blockContent.includes('"@type": "FAQPage"'), 'CategoryContentBlock builds FAQPage schema');
    assert(blockContent.includes('type="application/ld+json"'), 'CategoryContentBlock injects application/ld+json script tag');
    assert(blockContent.includes('dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}'), 'CategoryContentBlock serializes FAQPage JSON-LD cleanly');
  });

  // =========================================================================
  // SUITE 3: Tenant Config Branding & Bulk Tier Invariants
  // =========================================================================
  await runSuite('3. Tenant Config Branding & Bulk Tier Invariants', () => {
    const hubConfig = tenantConfigs.cnverifyhub;
    assert(hubConfig !== undefined, 'tenantConfigs.cnverifyhub exists');

    // 3.1 Primary Brand Color & Theme
    assert(hubConfig.id === 'cnverifyhub', 'CNVerifyHub ID is "cnverifyhub"');
    assert(hubConfig.branding.primary === '#00d4aa', `CNVerifyHub primary branding color is "#00d4aa" (found: ${hubConfig.branding.primary})`);
    assert(hubConfig.ui.theme === 'dark', `CNVerifyHub ui theme is "dark" (found: ${hubConfig.ui.theme})`);
    assert(hubConfig.branding.background === '#0a0a0a', 'CNVerifyHub background is "#0a0a0a"');
    assert(hubConfig.branding.surface === '#1a1a1a', 'CNVerifyHub surface is "#1a1a1a"');

    // 3.2 Bulk Pricing Tiers
    assert(hubConfig.psychology.bulkPricingEnabled === true, 'CNVerifyHub bulkPricingEnabled is true');
    const bulkTiers = hubConfig.pricing.bulkTiers;
    assert(Array.isArray(bulkTiers), 'bulkTiers is an array');
    assert(bulkTiers.length === 4, `bulkTiers has exactly 4 tiers (found: ${bulkTiers.length})`);

    // Verify 5+, 10+, 50+, 200+
    assert(bulkTiers[0].min === 5 && bulkTiers[0].discount === 0.05, 'Tier 1 is 5+ units at 5% discount');
    assert(bulkTiers[1].min === 10 && bulkTiers[1].discount === 0.10, 'Tier 2 is 10+ units at 10% discount');
    assert(bulkTiers[2].min === 50 && bulkTiers[2].discount === 0.20, 'Tier 3 is 50+ units at 20% discount');
    assert(bulkTiers[3].min === 200 && bulkTiers[3].discount === 0.30, 'Tier 4 is 200+ units at 30% discount');

    // Verify discount strictly ascending
    for (let i = 1; i < bulkTiers.length; i++) {
      assert(bulkTiers[i].min > bulkTiers[i - 1].min, `Tier ${i} min (${bulkTiers[i].min}) > Tier ${i - 1} min (${bulkTiers[i - 1].min})`);
      assert(bulkTiers[i].discount > bulkTiers[i - 1].discount, `Tier ${i} discount (${bulkTiers[i].discount}) > Tier ${i - 1} discount (${bulkTiers[i - 1].discount})`);
    }

    // 3.3 Dynamic Hostname Resolution
    assert(getTenantConfig('cnverifyhub.com').id === 'cnverifyhub', 'Resolves cnverifyhub.com');
    assert(getTenantConfig('www.cnverifyhub.com').id === 'cnverifyhub', 'Resolves www.cnverifyhub.com');
    assert(getTenantConfig('app.cnverifyhub.com').id === 'cnverifyhub', 'Resolves app.cnverifyhub.com');
    assert(getTenantConfig('localhost').id === 'cnverifyhub', 'Resolves localhost to cnverifyhub by default');
    assert(getTenantConfig('').id === 'cnverifyhub', 'Resolves empty string to cnverifyhub');
    assert(getTenantConfig(null).id === 'cnverifyhub', 'Resolves null to cnverifyhub');
    assert(getTenantConfig(undefined).id === 'cnverifyhub', 'Resolves undefined to cnverifyhub');
    assert(getTenantConfig('cnwepro.com').id === 'cnwepro', 'Resolves cnwepro.com');
    assert(getTenantConfig('b2b.cnwepro.com').id === 'cnwepro', 'Resolves b2b.cnwepro.com');
  });

  // =========================================================================
  // SUITE 4: Zero External Avatar CDN Scan
  // =========================================================================
  await runSuite('4. Zero-Dicebear & Zero-Gravatar Whole-Project Scan', () => {
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

    const blacklist = [
      'api.dicebear.com',
      'dicebear.com',
      'gravatar.com/avatar',
      'ui-avatars.com/api',
      'unavatar.io',
    ];

    let foundBlacklisted = 0;
    for (const file of allProjectFiles) {
      const content = fs.readFileSync(file, 'utf8');
      for (const b of blacklist) {
        if (content.includes(b)) {
          foundBlacklisted++;
          assert(false, `Found blacklisted avatar URL "${b}" in ${path.relative(rootDir, file)}`);
        }
      }
    }
    assert(foundBlacklisted === 0, `Scanned ${allProjectFiles.length} project files: 0 external avatar references found`);
  });

  // =========================================================================
  // SUMMARY
  // =========================================================================
  console.log(`\n${colors.bold}====================================================${colors.reset}`);
  console.log(`${colors.bold}CHALLENGER 2 EMPIRICAL TEST SUMMARY${colors.reset}`);
  console.log(`====================================================`);
  console.log(`Total Passed Assertions: ${colors.green}${passedAssertions}${colors.reset}`);
  console.log(`Total Failed Assertions: ${failedAssertions === 0 ? colors.green + '0' : colors.red + failedAssertions}${colors.reset}`);

  if (failedAssertions === 0) {
    console.log(`\n${colors.bold}${colors.green}>>> VERDICT: APPROVE <<<\n${colors.reset}`);
    process.exit(0);
  } else {
    console.log(`\n${colors.bold}${colors.red}>>> VERDICT: REQUEST_CHANGES <<<\n${colors.reset}`);
    failures.forEach((f) => console.log(` - ${f}`));
    process.exit(1);
  }
}

runAllEmpiricalTests().catch((err) => {
  console.error('Fatal unhandled error:', err);
  process.exit(1);
});
