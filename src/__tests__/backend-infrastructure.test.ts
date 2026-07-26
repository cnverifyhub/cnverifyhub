import { encryptCredentials, decryptCredentials } from '../lib/encryption';
import { getTenantId, getTenantFromHost, getTenantFromHeaders } from '../lib/tenant-context';
import { getRateLimitTier, checkRateLimit } from '../lib/ratelimit';

async function runTests() {
  console.log('=== Running Backend Infrastructure Verification Tests ===');

  // Test 1: Encryption & Decryption (AES-256-GCM)
  const originalSecret = 'user:account_123|pass:secretPass99!';
  const encrypted = encryptCredentials(originalSecret);
  console.log('[Test 1.1] Encrypted payload format check:', encrypted.split(':').length === 3 ? 'PASS' : 'FAIL');
  const decrypted = decryptCredentials(encrypted);
  console.log('[Test 1.2] Decrypted matches original:', decrypted === originalSecret ? 'PASS' : 'FAIL');

  // Test 2: Tenant Context
  console.log('[Test 2.1] getTenantFromHost(cnwepro.com):', getTenantFromHost('cnwepro.com') === 'cnwepro' ? 'PASS' : 'FAIL');
  console.log('[Test 2.2] getTenantFromHost(cnverifyhub.com):', getTenantFromHost('cnverifyhub.com') === 'cnverifyhub' ? 'PASS' : 'FAIL');

  const headers = new Headers();
  headers.set('x-tenant-id', 'cnwepro');
  console.log('[Test 2.3] getTenantFromHeaders(x-tenant-id=cnwepro):', getTenantFromHeaders(headers) === 'cnwepro' ? 'PASS' : 'FAIL');

  // Test 3: Rate Limiting Tiers
  console.log('[Test 3.1] Tier /api/verify-payment:', getRateLimitTier('/api/verify-payment').limit === 10 ? 'PASS' : 'FAIL');
  console.log('[Test 3.2] Tier /api/auth/login:', getRateLimitTier('/api/auth/login').limit === 5 ? 'PASS' : 'FAIL');
  console.log('[Test 3.3] Tier /api/products:', getRateLimitTier('/api/products').limit === 100 ? 'PASS' : 'FAIL');

  // Test 4: Rate Limiting Sliding Window Execution
  const testIp = '192.168.1.100';
  const testPath = '/api/auth/test-limit';
  
  // Make 5 requests (limit is 5)
  for (let i = 0; i < 5; i++) {
    const res = await checkRateLimit('cnverifyhub', testIp, testPath);
    if (i === 4 && (!res.success || res.remaining !== 0)) {
      console.log(`[Test 4.1] Request ${i+1} remaining count check: FAIL (remaining=${res.remaining})`);
    }
  }
  
  // 6th request should fail with 429 status (success: false)
  const overflowRes = await checkRateLimit('cnverifyhub', testIp, testPath);
  console.log('[Test 4.2] 6th auth request rate limited:', overflowRes.success === false && overflowRes.remaining === 0 ? 'PASS' : 'FAIL');

  console.log('=== All Smoke Tests Completed ===');
}

runTests().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
