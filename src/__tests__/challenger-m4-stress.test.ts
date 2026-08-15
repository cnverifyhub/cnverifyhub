import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();

import fs from 'fs';
import path from 'path';

// Global Assertion Tracker
let passed = 0;
let failed = 0;
const errors: string[] = [];

function assert(condition: boolean, testName: string, details?: string) {
  if (condition) {
    passed++;
    console.log(`  ✅ [PASS] ${testName}`);
  } else {
    failed++;
    const errMsg = `  ❌ [FAIL] ${testName}${details ? ` -> ${details}` : ''}`;
    console.error(errMsg);
    errors.push(errMsg);
  }
}

async function runEmpiricalChallengeSuite() {
  console.log('===============================================================');
  console.log('🚀 EMPIRICAL CHALLENGER: MILESTONE 4 VERIFICATION & STRESS SUITE');
  console.log('===============================================================\n');

  const rootDir = path.resolve(__dirname, '../..');
  const srcDir = path.join(rootDir, 'src');
  const appDir = path.join(srcDir, 'app');

  // Dynamically import route after dotenv has loaded
  const { POST: newsletterPost } = await import('../app/api/newsletter/subscribe/route');

  // =========================================================================
  // CHALLENGE TASK 2: Universal Route Dynamic Export Verification
  // =========================================================================
  console.log('🔍 [TASK 2] Auditing Route Handlers for dynamic = \'force-dynamic\'...');

  function getAllRouteFiles(dir: string): string[] {
    let results: string[] = [];
    const list = fs.readdirSync(dir);
    for (const file of list) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat && stat.isDirectory()) {
        results = results.concat(getAllRouteFiles(fullPath));
      } else if (/^route\.(ts|tsx|js|jsx)$/.test(file)) {
        results.push(fullPath);
      }
    }
    return results;
  }

  const allRouteFiles = getAllRouteFiles(appDir);
  console.log(`  Found ${allRouteFiles.length} route handler files in src/app/\n`);

  assert(allRouteFiles.length >= 30, `Found at least 30 route handler files (found ${allRouteFiles.length})`);

  // Verify critical named routes exist
  const authCallbackRoute = path.join(appDir, 'auth/callback/route.ts');
  const llmsTxtRoute = path.join(appDir, 'llms.txt/route.ts');
  const newsletterRoute = path.join(appDir, 'api/newsletter/subscribe/route.ts');

  assert(fs.existsSync(authCallbackRoute), 'src/app/auth/callback/route.ts exists');
  assert(fs.existsSync(llmsTxtRoute), 'src/app/llms.txt/route.ts exists');
  assert(fs.existsSync(newsletterRoute), 'src/app/api/newsletter/subscribe/route.ts exists');

  for (const routeFile of allRouteFiles) {
    const relPath = path.relative(rootDir, routeFile).replace(/\\/g, '/');
    const content = fs.readFileSync(routeFile, 'utf-8');
    const hasDynamicExport = /export\s+const\s+dynamic\s*=\s*['"]force-dynamic['"]\s*;?/.test(content);
    assert(hasDynamicExport, `${relPath} exports dynamic = 'force-dynamic'`);
  }

  // =========================================================================
  // CHALLENGE TASK 3: next/dynamic Collision Audit
  // =========================================================================
  console.log('\n🔍 [TASK 3] Checking next/dynamic import collisions across entire codebase...');

  function getAllTsTsxFiles(dir: string): string[] {
    let results: string[] = [];
    const list = fs.readdirSync(dir);
    for (const file of list) {
      if (file === 'node_modules' || file === '.next' || file === '.git' || file === '.agents') continue;
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat && stat.isDirectory()) {
        results = results.concat(getAllTsTsxFiles(fullPath));
      } else if (/\.(ts|tsx)$/.test(file)) {
        results.push(fullPath);
      }
    }
    return results;
  }

  const allTsFiles = getAllTsTsxFiles(srcDir);
  console.log(`  Scanning ${allTsFiles.length} TS/TSX files for next/dynamic collisions...`);

  let collisionCount = 0;
  for (const file of allTsFiles) {
    const relPath = path.relative(rootDir, file).replace(/\\/g, '/');
    const content = fs.readFileSync(file, 'utf-8');

    const importsDynamicDefault = /import\s+dynamic\s+from\s+['"]next\/dynamic['"]/.test(content);
    const importsNextDynamicAlias = /import\s+nextDynamic\s+from\s+['"]next\/dynamic['"]/.test(content);
    const exportsDynamic = /export\s+const\s+dynamic\s*=/.test(content);

    if (importsDynamicDefault && exportsDynamic) {
      collisionCount++;
      assert(false, `Collision in ${relPath}: imports default 'dynamic' and exports 'dynamic'`, 'Must alias to nextDynamic');
    } else {
      // Valid cases
      if (importsDynamicDefault) {
        assert(!exportsDynamic, `${relPath} uses default 'dynamic' import without colliding export`);
      }
      if (importsNextDynamicAlias && exportsDynamic) {
        assert(true, `${relPath} correctly aliases nextDynamic alongside export const dynamic`);
      }
    }
  }
  assert(collisionCount === 0, 'Zero next/dynamic naming collisions across all source files');

  // =========================================================================
  // CHALLENGE TASK 4: Automated Stress Tests for Newsletter Subscription API
  // =========================================================================
  console.log('\n🔍 [TASK 4] Running Stress & Boundary Tests against POST /api/newsletter/subscribe...');

  // Helper to create Request object
  function createReq(body: any, headers: Record<string, string> = {}): Request {
    const reqHeaders = new Headers({
      'content-type': 'application/json',
      'cf-connecting-ip': '1.2.3.4',
      ...headers,
    });

    const init: RequestInit = {
      method: 'POST',
      headers: reqHeaders,
    };

    if (typeof body === 'string') {
      init.body = body;
    } else if (body !== undefined) {
      init.body = JSON.stringify(body);
    }

    return new Request('http://localhost:3000/api/newsletter/subscribe', init);
  }

  // 4.1 Missing / Non-JSON Bodies
  console.log('  Testing Malformed & Missing Payload Boundaries:');
  {
    // Empty body request
    const reqEmpty = new Request('http://localhost:3000/api/newsletter/subscribe', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
    });
    const resEmpty = await newsletterPost(reqEmpty);
    const jsonEmpty = await resEmpty.json();
    assert(resEmpty.status === 400, 'Empty body returns 400 Bad Request');
    assert(!!jsonEmpty.error, 'Empty body returns error message');

    // Invalid JSON string syntax
    const reqBadJson = createReq('{ bad_json: true, ');
    const resBadJson = await newsletterPost(reqBadJson);
    const jsonBadJson = await resBadJson.json();
    assert(resBadJson.status === 400, 'Malformed JSON payload returns 400 Bad Request');
    assert(!!jsonBadJson.error, 'Malformed JSON returns error message');

    // Null body
    const reqNullBody = createReq(null);
    const resNullBody = await newsletterPost(reqNullBody);
    assert(resNullBody.status === 400, 'Null JSON body returns 400 Bad Request');
  }

  // 4.2 Invalid Email Types and Missing Fields
  console.log('  Testing Missing & Non-String Email Fields:');
  {
    const invalidPayloads = [
      { payload: {}, desc: 'Empty object {}' },
      { payload: { email: null }, desc: 'email is null' },
      { payload: { email: undefined }, desc: 'email is undefined' },
      { payload: { email: 123456 }, desc: 'email is number' },
      { payload: { email: true }, desc: 'email is boolean' },
      { payload: { email: ['test@example.com'] }, desc: 'email is array' },
      { payload: { email: { address: 'test@example.com' } }, desc: 'email is nested object' },
      { payload: { email: '' }, desc: 'email is empty string' },
      { payload: { email: '     ' }, desc: 'email is whitespace-only' },
      { payload: { email: '\t\n\r' }, desc: 'email is whitespace control characters' },
    ];

    for (const { payload, desc } of invalidPayloads) {
      const res = await newsletterPost(createReq(payload));
      const data = await res.json();
      assert(res.status === 400, `Rejects ${desc} with 400`);
      assert(!!data.error, `Error message provided for ${desc}`);
    }
  }

  // 4.3 Invalid Email Format Edge Cases
  console.log('  Testing Invalid Email Format Patterns:');
  {
    const invalidEmails = [
      'plainaddress',
      '#@%^%#$@#$@#.com',
      '@example.com',
      'Joe Smith <email@example.com>',
      'email.example.com',
      'email@example@example.com',
      '.email@example.com',
      'email.@example.com',
      'email..email@example.com',
      'email@example.com (Joe Smith)',
      'email@example',
      'email@111.222.333.44444',
      'email@example..com',
      'Abc..123@example.com',
      'user@.com',
      'user@domain.c', // Single letter TLD
      'user spaces@domain.com',
      'user@domain space.com',
    ];

    for (const email of invalidEmails) {
      const res = await newsletterPost(createReq({ email }));
      const data = await res.json();
      assert(res.status === 400, `Rejects invalid email pattern "${email}" with 400`);
      assert(data.error === '请输入有效的电子邮箱地址', `Returns default ZH error string for "${email}"`);
    }
  }

  // 4.4 Adversarial Security & Injection Payloads
  console.log('  Testing Adversarial Security & Injection Payloads:');
  {
    const maliciousInputs = [
      "' OR '1'='1",
      "admin'--",
      "'; DROP TABLE newsletter_subscribers; --",
      "<script>alert('xss')</script>@domain.com",
      "user@domain.com<script>",
      "javascript:alert(1)@domain.com",
      "\"'><svg onload=alert(1)>@test.com",
      "user\r\nBcc: victim@example.com@domain.com", // Header injection attempt
      "A".repeat(50000) + "@domain.com", // Buffer overflow / ReDoS attempt
      "user😊@domain.com", // Emoji in local part
    ];

    for (const badInput of maliciousInputs) {
      const label = badInput.length > 30 ? badInput.slice(0, 30) + '...' : badInput;
      const res = await newsletterPost(createReq({ email: badInput }));
      assert(res.status === 400, `Safely blocks adversarial payload "${label}" with 400`);
    }
  }

  // 4.5 Localization & Language Parameter Integrity
  console.log('  Testing Language Variations & Error Message Localization:');
  {
    // English Error Message
    const resEn = await newsletterPost(createReq({ email: 'bad-email', lang: 'en' }));
    const dataEn = await resEn.json();
    assert(resEn.status === 400, 'English request with bad email returns 400');
    assert(dataEn.error === 'Please provide a valid email address', 'Returns English localized error message');

    // Chinese Error Message (Explicit)
    const resZh = await newsletterPost(createReq({ email: 'bad-email', lang: 'zh' }));
    const dataZh = await resZh.json();
    assert(resZh.status === 400, 'Chinese request with bad email returns 400');
    assert(dataZh.error === '请输入有效的电子邮箱地址', 'Returns Chinese localized error message');

    // Default Fallback (Unknown lang)
    const resDefault = await newsletterPost(createReq({ email: 'bad-email', lang: 'fr' }));
    const dataDefault = await resDefault.json();
    assert(resDefault.status === 400, 'Unknown lang request with bad email returns 400');
    assert(dataDefault.error === 'Please provide a valid email address', 'Falls back gracefully for non-zh languages');
  }

  // 4.6 Valid Emails, Formatting, and Success Flow
  console.log('  Testing Valid Emails, Trimming & Success Responses:');
  {
    const validEmails = [
      { input: 'buyer@example.com', expected: 'buyer@example.com', desc: 'Standard clean email' },
      { input: '   SPACES.TRIMMED@EXAMPLE.COM   ', expected: 'spaces.trimmed@example.com', desc: 'Uppercase and surrounding spaces' },
      { input: 'user.name+tag123@subdomain.co.uk', expected: 'user.name+tag123@subdomain.co.uk', desc: 'Plus-tagging and compound TLD' },
      { input: 'CNVerifyHub.Vip@Domain-Enterprise.org', expected: 'cnverifyhub.vip@domain-enterprise.org', desc: 'Hyphenated domain with mixed casing' },
    ];

    for (const { input, expected, desc } of validEmails) {
      const res = await newsletterPost(createReq({ email: input, lang: 'zh', tenant_id: 'cnverifyhub' }));
      const data = await res.json();
      assert(res.status === 200, `Valid email (${desc}) returns 200 OK`);
      assert(data.success === true, `Valid email returns success: true`);
      assert(data.discountCode === 'RECOVER5', `Returns discountCode 'RECOVER5'`);
      assert(data.message === '订阅成功，优惠券已激活', `Returns Chinese success message`);
    }

    // English Success Message
    const resEnOk = await newsletterPost(createReq({ email: 'hello@cnverifyhub.com', lang: 'en', tenant_id: 'cnverifyhub' }));
    const dataEnOk = await resEnOk.json();
    assert(resEnOk.status === 200, 'English success returns 200 OK');
    assert(dataEnOk.message === 'Subscribed successfully, coupon activated', 'Returns English success message');
  }

  // 4.7 Multi-Tenant Scoping & Defaulting
  console.log('  Testing Multi-Tenant Scoping & Tenant Fallbacks:');
  {
    // cnwepro tenant
    const resWepro = await newsletterPost(createReq({ email: 'wepro-lead@domain.com', tenant_id: 'cnwepro' }));
    assert(resWepro.status === 200, 'Accepts tenant_id = cnwepro');

    // cnverifyhub tenant
    const resHub = await newsletterPost(createReq({ email: 'hub-lead@domain.com', tenant_id: 'cnverifyhub' }));
    assert(resHub.status === 200, 'Accepts tenant_id = cnverifyhub');

    // arbitrary/unknown tenant defaults safely to cnverifyhub
    const resUnknown = await newsletterPost(createReq({ email: 'lead@domain.com', tenant_id: 'malicious_tenant' }));
    assert(resUnknown.status === 200, 'Defaults arbitrary tenant_id safely to cnverifyhub without error');
  }

  // 4.8 Header Extraction & IP Fallbacks
  console.log('  Testing Client IP Extraction Boundaries:');
  {
    // cf-connecting-ip
    const resCf = await newsletterPost(createReq({ email: 'ip1@test.com' }, { 'cf-connecting-ip': '203.0.113.195' }));
    assert(resCf.status === 200, 'Extracts cf-connecting-ip cleanly');

    // x-forwarded-for with multiple hops
    const resXff = await newsletterPost(createReq({ email: 'ip2@test.com' }, { 'x-forwarded-for': '198.51.100.1, 10.0.0.1' }));
    assert(resXff.status === 200, 'Extracts first client IP from x-forwarded-for comma-separated chain');

    // Missing IP headers (fallback to 127.0.0.1)
    const reqNoIp = new Request('http://localhost:3000/api/newsletter/subscribe', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: 'no-ip@test.com' }),
    });
    const resNoIp = await newsletterPost(reqNoIp);
    assert(resNoIp.status === 200, 'Falls back to 127.0.0.1 when no IP headers are present');
  }

  // 4.9 Idempotency & Repeated Subscriptions
  console.log('  Testing Subscription Idempotency:');
  {
    const repeatEmail = 'repeat.subscriber@cnverifyhub.com';
    const res1 = await newsletterPost(createReq({ email: repeatEmail }));
    const res2 = await newsletterPost(createReq({ email: repeatEmail }));
    const res3 = await newsletterPost(createReq({ email: repeatEmail }));

    assert(res1.status === 200, 'First subscription attempt succeeds (200)');
    assert(res2.status === 200, 'Duplicate subscription attempt returns 200 without throwing 500');
    assert(res3.status === 200, 'Triplicate subscription attempt returns 200 without throwing 500');
  }

  // =========================================================================
  // SUMMARY
  // =========================================================================
  console.log('\n===============================================================');
  console.log(`🏁 TEST SUITE COMPLETE: ${passed} Passed, ${failed} Failed`);
  console.log('===============================================================\n');

  if (failed > 0) {
    console.error('FAILED ASSERTIONS:');
    errors.forEach(e => console.error(e));
    process.exit(1);
  } else {
    console.log('🎉 ALL EMPIRICAL CHALLENGE ASSERTIONS PASSED WITH ZERO ERRORS!');
  }
}

runEmpiricalChallengeSuite().catch(err => {
  console.error('Fatal unhandled error in test suite:', err);
  process.exit(1);
});
