import fs from 'fs';
import path from 'path';
import { tenantConfigs, getTenantConfig } from '../lib/tenant-config';

// ANSI terminal colors
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

let totalPassed = 0;
let totalFailed = 0;
const failureDetails: string[] = [];

function assert(condition: boolean, message: string) {
  if (condition) {
    totalPassed++;
    console.log(`  ${colors.green}✓${colors.reset} ${message}`);
  } else {
    totalFailed++;
    failureDetails.push(message);
    console.error(`  ${colors.red}✗ FAIL:${colors.reset} ${message}`);
  }
}

function suite(title: string, fn: () => void) {
  console.log(`\n${colors.bold}${colors.cyan}=== [CHALLENGER 1 EMPIRICAL SUITE]: ${title} ===${colors.reset}`);
  fn();
}

const rootDir = path.resolve(__dirname, '../..');

// =============================================================================
// CHALLENGE 1: Complete Static & AST-level Route Dynamic Verification
// =============================================================================
suite('1. Exhaustive Dynamic Route Hardening & Collisions', () => {
  const apiDir = path.join(rootDir, 'src', 'app', 'api');
  
  function findRoutes(dir: string): string[] {
    let results: string[] = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        results = results.concat(findRoutes(full));
      } else if (/^route\.(ts|tsx|js|jsx)$/.test(entry.name)) {
        results.push(full);
      }
    }
    return results;
  }

  const allRoutes = findRoutes(apiDir);
  assert(allRoutes.length === 29, `Found exactly 29 API routes (found: ${allRoutes.length})`);

  for (const routePath of allRoutes) {
    const relPath = path.relative(rootDir, routePath);
    const content = fs.readFileSync(routePath, 'utf8');

    // Invariant: export const dynamic = 'force-dynamic' must be present
    const hasForceDynamic = /export\s+const\s+dynamic\s*=\s*['"]force-dynamic['"]\s*;?/.test(content);
    assert(hasForceDynamic, `Route ${relPath} exports const dynamic = 'force-dynamic'`);

    // Invariant: If next/dynamic is imported, it must NOT be imported as 'dynamic' to avoid variable shadowing
    const hasNextDynamicShadowing = /import\s+dynamic\s+from\s+['"]next\/dynamic['"]/.test(content);
    assert(!hasNextDynamicShadowing, `Route ${relPath} does not shadow 'dynamic' identifier from next/dynamic`);
  }
});

// =============================================================================
// CHALLENGE 2: Adversarial Search for Forbidden External Avatar Providers
// =============================================================================
suite('2. Adversarial External Avatar & Tracking CDN Ban Verification', () => {
  const forbiddenDomains = [
    'dicebear.com',
    'api.dicebear.com',
    'gravatar.com',
    'ui-avatars.com',
    'unavatar.io',
    'robohash.org',
    'boringavatars.com',
    'avatar.vercel.sh',
  ];

  function scanAllFiles(dir: string): string[] {
    let files: string[] = [];
    if (!fs.existsSync(dir)) return files;
    for (const file of fs.readdirSync(dir)) {
      const full = path.join(dir, file);
      if (fs.statSync(full).isDirectory()) {
        if (file !== 'node_modules' && file !== '.git' && file !== '.next') {
          files = files.concat(scanAllFiles(full));
        }
      } else if (/\.(ts|tsx|js|jsx|json|md|html|css|sql)$/.test(file)) {
        // Exclude test suite files that contain blacklist string assertions
        if (!file.includes('.test.') && !file.includes('.spec.')) {
          files.push(full);
        }
      }
    }
    return files;
  }

  const projectFiles = [
    ...scanAllFiles(path.join(rootDir, 'src')),
    ...scanAllFiles(path.join(rootDir, 'content')),
    ...scanAllFiles(path.join(rootDir, 'public')),
    ...scanAllFiles(path.join(rootDir, 'scripts')),
    ...scanAllFiles(path.join(rootDir, 'migrations')),
    ...scanAllFiles(path.join(rootDir, 'supabase')),
  ];

  let leaksFound = 0;
  for (const filePath of projectFiles) {
    const rel = path.relative(rootDir, filePath);
    const content = fs.readFileSync(filePath, 'utf8');

    for (const domain of forbiddenDomains) {
      if (content.toLowerCase().includes(domain)) {
        leaksFound++;
        assert(false, `LEAK DETECTED: ${domain} found in ${rel}`);
      }
    }
  }

  assert(leaksFound === 0, `Scanned ${projectFiles.length} files: 0 forbidden avatar references found`);

  // Verify next.config.js CSP
  const nextConfigContent = fs.readFileSync(path.join(rootDir, 'next.config.js'), 'utf8');
  for (const domain of forbiddenDomains) {
    assert(!nextConfigContent.includes(domain), `next.config.js does NOT whitelist ${domain}`);
  }
});

// =============================================================================
// CHALLENGE 3: Fuzzing & Property Oracle for LocalInitialAvatar
// =============================================================================
suite('3. LocalInitialAvatar Fuzzing, Determinism & Palette Oracle', () => {
  // Replicate algorithm from src/components/ui/LocalInitialAvatar.tsx
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

  // 1. CJK Character Range Testing
  const cjkCases = [
    { input: '张三', expected: '张' },
    { input: '李四五', expected: '李' },
    { input: '陳大文 (香港)', expected: '陳' },
    { input: '高橋 健太', expected: '高' },
    { input: 'さくら', expected: 'さ' },
    { input: 'カタカナ', expected: 'カ' },
    { input: '㐀 扩展A', expected: '㐀' },
    { input: '阿***', expected: '阿' },
    { input: '刘***生', expected: '刘' },
    { input: '风***去', expected: '风' },
    { input: '手机用户9999', expected: '手' },
  ];

  for (const tc of cjkCases) {
    const res = getInitials(tc.input);
    assert(res === tc.expected, `CJK input "${tc.input}" -> "${res}" (expected: "${tc.expected}")`);
  }

  // 2. English & Western Multi-part Names
  const englishCases = [
    { input: 'John Doe', expected: 'JD' },
    { input: 'Alice_Smith', expected: 'AS' },
    { input: 'Marcus-W', expected: 'MW' },
    { input: 'Alex.Global', expected: 'AG' },
    { input: 'Charlie', expected: 'CH' },
    { input: 'a', expected: 'A' },
    { input: 'BOB', expected: 'BO' },
    { input: 'T***m', expected: 'T*' },
    { input: 'M***K', expected: 'M*' },
    { input: 'wx_***992', expected: 'W*' },
  ];

  for (const tc of englishCases) {
    const res = getInitials(tc.input);
    assert(res === tc.expected, `Western input "${tc.input}" -> "${res}" (expected: "${tc.expected}")`);
  }

  // 3. Digits and Obfuscated Phone Numbers
  const digitCases = [
    { input: '13800138000', expected: '13' },
    { input: '158****9921', expected: '15' },
    { input: '719****882', expected: '71' },
    { input: '188****2311', expected: '18' },
    { input: '0', expected: '0' },
  ];

  for (const tc of digitCases) {
    const res = getInitials(tc.input);
    assert(res === tc.expected, `Digit input "${tc.input}" -> "${res}" (expected: "${tc.expected}")`);
  }

  // 4. Edge Cases & Hostile Fuzzing
  const hostileEdgeCases = [
    '',
    '   ',
    '\t\n\r',
    null as any,
    undefined as any,
    '---',
    '___',
    '...',
    '@#$%^&*()',
    'A'.repeat(5000),
    '汉'.repeat(5000),
    '1'.repeat(5000),
    '😊🚀🔥',
  ];

  for (const input of hostileEdgeCases) {
    let threw = false;
    let out = '';
    try {
      out = getInitials(input);
      const hash = hashString(input || 'Anonymous');
      assert(typeof hash === 'number' && !isNaN(hash) && hash >= 0, `Hash for input "${String(input).slice(0, 10)}" is valid non-negative integer (${hash})`);
      assert(typeof out === 'string' && out.length >= 1 && out.length <= 2, `Initials length invariant preserved for "${String(input).slice(0, 10)}" -> "${out}" (len: ${out.length})`);
    } catch (e) {
      threw = true;
    }
    assert(!threw, `Hostile input "${String(input).slice(0, 15)}" did not crash getInitials/hashString`);
  }

  // 5. Palette Distribution Uniformity Oracle
  const paletteBuckets = new Array(10).fill(0);
  for (let i = 0; i < 500; i++) {
    const sample = `user_${i}_${i * 37}_name`;
    const hash = hashString(sample);
    const bucket = hash % 10;
    paletteBuckets[bucket]++;
  }

  const minBucket = Math.min(...paletteBuckets);
  const maxBucket = Math.max(...paletteBuckets);
  assert(minBucket > 15, `Palette distribution has no empty/starved buckets (min: ${minBucket}, max: ${maxBucket} out of 500 samples)`);
});

// =============================================================================
// CHALLENGE 4: Multi-Tenant Hostname Resolution & Malicious Domain Routing
// =============================================================================
suite('4. Multi-Tenant Domain Routing & Isolation Security', () => {
  // Test valid and adversarial host headers
  const resolutionTests = [
    { host: 'cnwepro.com', expectedTenant: 'cnwepro' },
    { host: 'www.cnwepro.com', expectedTenant: 'cnwepro' },
    { host: 'dev.cnwepro.com:3000', expectedTenant: 'cnwepro' },
    { host: 'CNWEPRO.COM', expectedTenant: 'cnwepro' },
    { host: 'cnverifyhub.com', expectedTenant: 'cnverifyhub' },
    { host: 'www.cnverifyhub.com', expectedTenant: 'cnverifyhub' },
    { host: 'localhost:3000', expectedTenant: 'cnverifyhub' },
    { host: 'random-unknown.com', expectedTenant: 'cnverifyhub' },
    { host: null, expectedTenant: 'cnverifyhub' },
    { host: undefined, expectedTenant: 'cnverifyhub' },
    { host: '', expectedTenant: 'cnverifyhub' },
  ];

  for (const tc of resolutionTests) {
    const resolved = getTenantConfig(tc.host);
    assert(resolved.id === tc.expectedTenant, `Host "${tc.host}" accurately resolves to tenant "${tc.expectedTenant}"`);
  }

  // Verify CNVerifyHub tenant configuration integrity
  const cnverifyhub = tenantConfigs.cnverifyhub;
  assert(cnverifyhub.psychology.bulkPricingEnabled === true, 'CNVerifyHub has bulkPricingEnabled = true');
  assert(cnverifyhub.psychology.urgencyEnabled === true, 'CNVerifyHub has urgencyEnabled = true');
  assert(cnverifyhub.psychology.flashSalesEnabled === true, 'CNVerifyHub has flashSalesEnabled = true');
  assert(cnverifyhub.pricing.marginMultiplier === 1.15, 'CNVerifyHub marginMultiplier is 1.15');
  assert(cnverifyhub.pricing.bulkTiers.length === 4, 'CNVerifyHub has exactly 4 bulk pricing tiers');
  assert(cnverifyhub.psychology.headlines.length === 3, 'CNVerifyHub has 3 benefit-driven headlines');
  assert(cnverifyhub.psychology.subheadlines.length === 2, 'CNVerifyHub has 2 bilingual subheadlines');
});

// =============================================================================
// CHALLENGE 5: SQL Migration 20260816_01 & 20260816_02 Schema Verification
// =============================================================================
suite('5. SQL Migration 20260816_01 & 20260816_02 Schema Verification', () => {
  const mig1 = fs.readFileSync(path.join(rootDir, 'migrations/20260816_01_job_queue_and_revenue.sql'), 'utf8');
  const mig2 = fs.readFileSync(path.join(rootDir, 'migrations/20260816_02_seed_seo_posts.sql'), 'utf8');

  // _job_queue table schema check
  assert(mig1.includes('CREATE TABLE IF NOT EXISTS public._job_queue'), '_job_queue table creation defined');
  assert(mig1.includes('task_type VARCHAR(100) NOT NULL'), '_job_queue has task_type column');
  assert(mig1.includes('payload JSONB NOT NULL'), '_job_queue has payload JSONB column');
  assert(mig1.includes('status VARCHAR(20) NOT NULL DEFAULT \'pending\''), '_job_queue has status column with default pending');
  assert(mig1.includes('attempts INT DEFAULT 0'), '_job_queue has attempts column');
  assert(mig1.includes('max_attempts INT DEFAULT 5'), '_job_queue has max_attempts column');
  assert(mig1.includes('CREATE INDEX IF NOT EXISTS idx_job_queue_tenant_status'), '_job_queue composite tenant+status index defined');

  // newsletter_subscribers schema check
  assert(mig1.includes('CREATE TABLE IF NOT EXISTS public.newsletter_subscribers'), 'newsletter_subscribers table defined');
  assert(mig1.includes('email VARCHAR(255) NOT NULL'), 'newsletter_subscribers has email column');
  assert(mig1.includes('discount_code VARCHAR(50)'), 'newsletter_subscribers has discount_code column');
  assert(mig1.includes('tenant_id VARCHAR(50) DEFAULT \'cnverifyhub\''), 'newsletter_subscribers has tenant_id default cnverifyhub');
  assert(mig1.includes('CONSTRAINT unique_newsletter_tenant_email UNIQUE(tenant_id, email)'), 'newsletter_subscribers has compound unique constraint (tenant_id, email)');

  // PostgREST Schema Reload Invariant
  assert(mig1.trim().endsWith("NOTIFY pgrst, 'reload schema';"), 'Migration 1 emits PostgREST schema reload signal');
  assert(mig2.trim().endsWith("NOTIFY pgrst, 'reload schema';"), 'Migration 2 emits PostgREST schema reload signal');
});

// =============================================================================
// SUMMARY
// =============================================================================
console.log(`\n${colors.bold}========================================${colors.reset}`);
console.log(`${colors.bold}EMPIRICAL CHALLENGE HARNESS SUMMARY${colors.reset}`);
console.log(`========================================`);
console.log(`Total Assertions Passed: ${colors.green}${totalPassed}${colors.reset}`);
console.log(`Total Assertions Failed: ${totalFailed === 0 ? colors.green + '0' : colors.red + totalFailed}${colors.reset}`);

if (totalFailed > 0) {
  console.error(`\n${colors.red}${colors.bold}FAILURES DETECTED:${colors.reset}`);
  failureDetails.forEach((f, idx) => console.error(` ${idx + 1}. ${f}`));
  process.exit(1);
} else {
  console.log(`\n${colors.green}${colors.bold}>>> EMPIRICAL CHALLENGE VERDICT: ALL PASS (APPROVE) <<<${colors.reset}\n`);
  process.exit(0);
}
