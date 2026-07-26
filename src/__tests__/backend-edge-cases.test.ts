import { encryptCredentials, decryptCredentials } from '../lib/encryption';
import { getTenantId, getTenantFromHost, getTenantFromHeaders } from '../lib/tenant-context';
import { getRateLimitTier, checkRateLimit } from '../lib/ratelimit';

async function runEdgeCaseTests() {
  console.log('=== Running Backend Infrastructure Edge Case Empirical Tests ===\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName} ${detail ? `(${detail})` : ''}`);
      failed++;
    }
  }

  // -------------------------------------------------------------
  // 1. Encryption & Decryption Edge Cases
  // -------------------------------------------------------------
  console.log('--- Group 1: Encryption & Decryption Edge Cases ---');

  assert(decryptCredentials('') === '', 'Decryption: Empty string input returns empty string');
  assert(decryptCredentials('plain-unencrypted') === 'plain-unencrypted', 'Decryption: String without colons returns input as fallback');
  assert(decryptCredentials('part1:part2') === 'part1:part2', 'Decryption: 2-part string returns input as fallback');
  assert(decryptCredentials('a:b:c:d') === 'a:b:c:d', 'Decryption: 4-part string returns input as fallback');

  // Malformed hex in IV/authTag
  const malformedHex = 'invalid_hex_iv:invalid_auth_tag:invalid_encrypted_data';
  const malformedResult = decryptCredentials(malformedHex);
  assert(malformedResult === malformedHex, 'Decryption: Non-hex payload is gracefully caught and returned');

  // Valid hex format but corrupted GCM auth tag / ciphertext bytes (tamper attempt)
  const validIV = '0102030405060708090a0b0c'; // 12 bytes
  const validTag = '00112233445566778899aabbccddeeff'; // 16 bytes
  const corruptedCipher = 'aabbccdd';
  const tamperedPayload = `${validIV}:${validTag}:${corruptedCipher}`;
  const tamperedResult = decryptCredentials(tamperedPayload);
  assert(tamperedResult === tamperedPayload, 'Decryption: Tampered payload tag mismatch caught without throwing');

  // Encryption roundtrip with special characters / unicode
  const complexSecret = '🔥Secret!@#$%^&*()_+=~`{}[]|:;"\'<>,.?/ 用户密码123';
  const encryptedComplex = encryptCredentials(complexSecret);
  const decryptedComplex = decryptCredentials(encryptedComplex);
  assert(decryptedComplex === complexSecret, 'Encryption/Decryption: Unicode & special chars roundtrip');

  // -------------------------------------------------------------
  // 2. Tenant Context Edge Cases
  // -------------------------------------------------------------
  console.log('\n--- Group 2: Tenant Context Parsing Edge Cases ---');

  assert(getTenantFromHost(null) === 'cnverifyhub', 'Tenant Host: null returns default cnverifyhub');
  assert(getTenantFromHost(undefined) === 'cnverifyhub', 'Tenant Host: undefined returns default cnverifyhub');
  assert(getTenantFromHost('') === 'cnverifyhub', 'Tenant Host: empty string returns default cnverifyhub');
  assert(getTenantFromHost('CNWEPRO.COM') === 'cnwepro', 'Tenant Host: uppercase CNWEPRO.COM returns cnwepro');
  assert(getTenantFromHost('subdomain.cnwepro.org') === 'cnwepro', 'Tenant Host: subdomain.cnwepro.org returns cnwepro');
  assert(getTenantFromHost('cnverifyhub.com') === 'cnverifyhub', 'Tenant Host: cnverifyhub.com returns cnverifyhub');
  assert(getTenantFromHost('random-domain.com') === 'cnverifyhub', 'Tenant Host: unknown domain defaults to cnverifyhub');

  // Header parsing edge cases
  assert(getTenantFromHeaders(null) === 'cnverifyhub', 'Tenant Headers: null headers returns default');
  
  const h1 = new Headers();
  h1.set('x-tenant-id', 'CNWEPRO');
  assert(getTenantFromHeaders(h1) === 'cnwepro', 'Tenant Headers: uppercase x-tenant-id CNWEPRO returns cnwepro');

  const h2 = new Headers();
  h2.set('x-tenant-id', '  cnverifyhub  ');
  assert(getTenantFromHeaders(h2) === 'cnverifyhub', 'Tenant Headers: x-tenant-id with whitespace returns cnverifyhub');

  const h3 = new Headers();
  h3.set('x-tenant-id', 'unrecognized_tenant');
  h3.set('host', 'cnwepro.com');
  assert(getTenantFromHeaders(h3) === 'cnwepro', 'Tenant Headers: invalid x-tenant-id falls back to host header');

  const h4 = new Headers();
  h4.set('x-forwarded-host', 'app.cnwepro.com');
  assert(getTenantFromHeaders(h4) === 'cnwepro', 'Tenant Headers: x-forwarded-host fallback');

  // getTenantId wrapper polymorphism
  assert(getTenantId('cnwepro.io') === 'cnwepro', 'getTenantId(string) parses host');
  assert(getTenantId(h1) === 'cnwepro', 'getTenantId(Headers) parses headers');

  // -------------------------------------------------------------
  // 3. Rate Limit Tiers & Key Isolation Edge Cases
  // -------------------------------------------------------------
  console.log('\n--- Group 3: Rate Limiting & Key Isolation Edge Cases ---');

  assert(getRateLimitTier('/api/verify-payment').limit === 10, 'Rate Tier: /api/verify-payment limit 10');
  assert(getRateLimitTier('/api/verify-payment/v2').limit === 10, 'Rate Tier: /api/verify-payment/v2 subpath limit 10');
  assert(getRateLimitTier('/api/checkout/stripe/session').limit === 10, 'Rate Tier: /api/checkout/stripe subpath limit 10');
  assert(getRateLimitTier('/api/webhooks/usdt').limit === 10, 'Rate Tier: /api/webhooks limit 10');
  assert(getRateLimitTier('/api/auth/login').limit === 5, 'Rate Tier: /api/auth/login limit 5');
  assert(getRateLimitTier('/api/auth/register').limit === 5, 'Rate Tier: /api/auth/register limit 5');
  assert(getRateLimitTier('/api/products').limit === 100, 'Rate Tier: /api/products limit 100');
  assert(getRateLimitTier('/api/unknown').limit === 100, 'Rate Tier: /api/unknown limit 100');
  assert(getRateLimitTier('/static/page').limit === 100, 'Rate Tier: non-api path limit 100');

  // Test tenant and IP key isolation in rate limiting
  const isoPath = '/api/auth/iso-test';
  const ipA = '10.0.0.1';
  const ipB = '10.0.0.2';

  // Exhaust tenant A for ipA (5 requests)
  for (let i = 0; i < 5; i++) {
    await checkRateLimit('cnwepro', ipA, isoPath);
  }
  const resExhaustedA = await checkRateLimit('cnwepro', ipA, isoPath);
  assert(resExhaustedA.success === false, 'Rate Limit: Tenant A / ipA is limited after 5 requests');

  // Tenant B with same IP should NOT be limited (Tenant Key Isolation)
  const resTenantB = await checkRateLimit('cnverifyhub', ipA, isoPath);
  assert(resTenantB.success === true, 'Rate Limit Isolation: Tenant B with same IP is NOT limited');

  // Tenant A with IP B should NOT be limited (IP Key Isolation)
  const resIpB = await checkRateLimit('cnwepro', ipB, isoPath);
  assert(resIpB.success === true, 'Rate Limit Isolation: Tenant A with different IP B is NOT limited');

  console.log(`\n=== Edge Case Results: ${passed} Passed, ${failed} Failed ===`);

  if (failed > 0) {
    process.exit(1);
  }
}

runEdgeCaseTests().catch(err => {
  console.error('Edge case test execution error:', err);
  process.exit(1);
});
