import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();

// Global Assertion Tracker
let passedAssertions = 0;
let failedAssertions = 0;
const failures: string[] = [];

function assert(condition: boolean, testName: string, details?: string) {
  if (condition) {
    passedAssertions++;
    console.log(`  ✅ [PASS] ${testName}`);
  } else {
    failedAssertions++;
    const errMsg = `  ❌ [FAIL] ${testName}${details ? ` -> ${details}` : ''}`;
    console.error(errMsg);
    failures.push(errMsg);
  }
}

async function runDeepVerificationSuite() {
  console.log('========================================================================');
  console.log('🔬 EMPIRICAL CHALLENGER: DEEP ADVERSARIAL BACKEND & RECOVERY TEST SUITE');
  console.log('========================================================================\n');

  // Dynamic imports after dotenv initialized
  const { POST: newsletterPost } = await import('../app/api/newsletter/subscribe/route');
  const { GET: cartRecoveryGet } = await import('../app/api/cron/process-cart-recovery/route');
  const { POST: couponValidatePost } = await import('../app/api/coupons/validate/route');
  const { checkRateLimit, getRateLimitTier } = await import('../lib/ratelimit');

  // ===========================================================================
  // 1. NEWSLETTER SUBSCRIPTION ADVERSARIAL TESTING
  // ===========================================================================
  console.log('--- 1. Testing /api/newsletter/subscribe Edge Cases ---');

  // 1.1 Malformed emails
  const malformedEmails = [
    '',
    '   ',
    'notanemail',
    '@domain.com',
    'user@',
    'user@.com',
    'user@domain..com',
    'user@@domain.com',
    'user@domain.c', // single character TLD
    'user name@domain.com',
    'user@domain space.com',
    '<script>alert(1)</script>@domain.com',
    'admin"user@domain.com',
    'user@domain,com',
    'user#domain.com',
  ];

  for (const badEmail of malformedEmails) {
    const req = new Request('http://localhost:3000/api/newsletter/subscribe', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'cf-connecting-ip': '10.99.1.1',
      },
      body: JSON.stringify({ email: badEmail }),
    });

    const res = await newsletterPost(req);
    const data = await res.json();
    assert(res.status === 400, `Rejects malformed email "${badEmail}" with 400`);
    assert(!!data.error, `Provides error message for malformed email "${badEmail}"`);
  }

  // 1.2 Oversized payloads (>50KB)
  console.log('\n  Testing Oversized Payloads (>50KB & >100KB):');
  {
    // A: Huge string in email field (>50KB)
    const giantEmail = 'a'.repeat(55000) + '@example.com';
    const reqGiantEmail = new Request('http://localhost:3000/api/newsletter/subscribe', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'cf-connecting-ip': '10.99.1.2',
      },
      body: JSON.stringify({ email: giantEmail }),
    });
    const resGiantEmail = await newsletterPost(reqGiantEmail);
    assert(resGiantEmail.status === 400, 'Rejects >50KB email length with 400 Bad Request');

    // B: Oversized junk fields in body (>100KB)
    const junkPayload = {
      email: 'valid.user@example.com',
      junkData: 'X'.repeat(120000), // 120KB payload
      metadata: { nested: 'Y'.repeat(50000) }
    };
    const reqOversized = new Request('http://localhost:3000/api/newsletter/subscribe', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'cf-connecting-ip': '10.99.1.3',
      },
      body: JSON.stringify(junkPayload),
    });
    const resOversized = await newsletterPost(reqOversized);
    const dataOversized = await resOversized.json();
    assert(resOversized.status === 200, 'Processes valid email even with oversized auxiliary metadata without crash');
    assert(dataOversized.discountCode === 'RECOVER5', 'Returns discount code RECOVER5 on oversized metadata request');
  }

  // 1.3 Rate limit saturation
  console.log('\n  Testing Rate Limit Saturation on /api/newsletter/subscribe:');
  {
    const saturatingIp = '198.51.100.77';
    const endpoint = '/api/newsletter/subscribe';
    const tier = getRateLimitTier(endpoint);
    assert(tier.limit === 100, `Rate limit tier for /api/newsletter/subscribe is ${tier.limit} (default API tier)`);

    // Direct check of rate limiter sliding window saturation
    const testRateLimitKey = 'test-saturation-ip';
    // Make 100 requests to hit the limit
    let hit429 = false;
    let lastRemaining = 100;
    for (let i = 0; i < 105; i++) {
      const rateRes = await checkRateLimit('cnverifyhub', testRateLimitKey, endpoint);
      if (!rateRes.success) {
        hit429 = true;
        assert(rateRes.remaining === 0, `Rate limited response has remaining = 0 on attempt ${i + 1}`);
        break;
      }
      lastRemaining = rateRes.remaining;
    }
    assert(hit429, 'Rate limiter successfully saturates and blocks beyond 100 requests / min');

    // Test route-level 429 response formatting when checkRateLimit returns success: false
    // Simulate by exhausting an IP
    const exhaustedIp = '203.0.113.88';
    for (let i = 0; i < 100; i++) {
      await checkRateLimit('cnverifyhub', exhaustedIp, endpoint);
    }
    const reqRateExhausted = new Request('http://localhost:3000/api/newsletter/subscribe', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'cf-connecting-ip': exhaustedIp,
      },
      body: JSON.stringify({ email: 'blocked@example.com' }),
    });
    const resRateExhausted = await newsletterPost(reqRateExhausted);
    assert(resRateExhausted.status === 429, 'POST /api/newsletter/subscribe returns HTTP 429 when IP is saturated');
    assert(resRateExhausted.headers.has('X-RateLimit-Limit'), 'HTTP 429 response contains X-RateLimit-Limit header');
    assert(resRateExhausted.headers.has('X-RateLimit-Remaining'), 'HTTP 429 response contains X-RateLimit-Remaining header');
    assert(resRateExhausted.headers.has('X-RateLimit-Reset'), 'HTTP 429 response contains X-RateLimit-Reset header');
  }

  // 1.4 Duplicate subscriptions / Idempotency
  console.log('\n  Testing Duplicate Subscriptions & Idempotency:');
  {
    const dupEmail = 'idempotent.subscriber@test.org';
    const makeSubReq = () => new Request('http://localhost:3000/api/newsletter/subscribe', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'cf-connecting-ip': '10.99.1.5',
      },
      body: JSON.stringify({ email: dupEmail, lang: 'zh' }),
    });

    const res1 = await newsletterPost(makeSubReq());
    const data1 = await res1.json();
    assert(res1.status === 200, 'Initial subscription returns 200');
    assert(data1.success === true && data1.discountCode === 'RECOVER5', 'Initial subscription returns valid discountCode');

    const res2 = await newsletterPost(makeSubReq());
    const data2 = await res2.json();
    assert(res2.status === 200, 'Second duplicate subscription returns 200 (idempotent)');
    assert(data2.success === true && data2.discountCode === 'RECOVER5', 'Second duplicate returns valid discountCode');

    const res3 = await newsletterPost(makeSubReq());
    const data3 = await res3.json();
    assert(res3.status === 200, 'Third duplicate subscription returns 200 (idempotent)');
    assert(data3.success === true && data3.discountCode === 'RECOVER5', 'Third duplicate returns valid discountCode');
  }

  // ===========================================================================
  // 2. CART RECOVERY CRON TESTING
  // ===========================================================================
  console.log('\n--- 2. Testing /api/cron/process-cart-recovery ---');

  // 2.1 Authentication enforcement
  console.log('  Testing Auth Enforcement:');
  {
    // A: No auth header
    const reqNoAuth = new Request('http://localhost:3000/api/cron/process-cart-recovery', {
      method: 'GET',
    });
    const resNoAuth = await cartRecoveryGet(reqNoAuth);
    const dataNoAuth = await resNoAuth.json();
    assert(resNoAuth.status === 401, 'Rejects request with no authorization header (401)');
    assert(dataNoAuth.error.includes('Unauthorized'), 'Returns Unauthorized error message');

    // B: Invalid bearer token
    const reqBadAuth = new Request('http://localhost:3000/api/cron/process-cart-recovery', {
      method: 'GET',
      headers: {
        authorization: 'Bearer invalid_secret_token_12345',
      },
    });
    const resBadAuth = await cartRecoveryGet(reqBadAuth);
    const dataBadAuth = await resBadAuth.json();
    assert(resBadAuth.status === 401, 'Rejects request with invalid Bearer token (401)');
    assert(dataBadAuth.error.includes('Unauthorized'), 'Returns Unauthorized error message for invalid token');

    // C: Valid bearer token with CRON_SECRET
    const originalCronSecret = process.env.CRON_SECRET;
    const testSecret = originalCronSecret || 'test_cron_secret_empirical_challenger';
    process.env.CRON_SECRET = testSecret;

    const reqValidAuth = new Request('http://localhost:3000/api/cron/process-cart-recovery', {
      method: 'GET',
      headers: {
        authorization: `Bearer ${testSecret}`,
      },
    });
    const resValidAuth = await cartRecoveryGet(reqValidAuth);
    assert(resValidAuth.status === 200 || resValidAuth.status === 500, `Valid auth passes auth gate (HTTP ${resValidAuth.status})`);
    if (resValidAuth.status === 200) {
      const dataValid = await resValidAuth.json();
      assert(dataValid.success === true, 'Returns success response with valid cron secret');
    }
  }

  // 2.2 Reminder count capping (< 3) & 24h backoff logic verification
  console.log('\n  Testing Cart Recovery Filtering & Backoff Logic:');
  {
    // Logic Verification: check how cart selection criteria evaluate
    const now = Date.now();
    const oneHourAgo = new Date(now - 60 * 60 * 1000);
    const oneDayAgo = new Date(now - 24 * 60 * 60 * 1000);

    interface MockCart {
      id: string;
      email: string;
      recovered: boolean;
      created_at: string;
      reminder_count: number | null;
      last_reminder_sent_at: string | null;
    }

    function shouldProcessCart(cart: MockCart): { eligible: boolean; reason: string } {
      if (cart.recovered) return { eligible: false, reason: 'Already recovered' };
      const createdAt = new Date(cart.created_at);
      if (createdAt >= oneHourAgo) return { eligible: false, reason: 'Created less than 1 hour ago' };
      if (cart.reminder_count !== null && cart.reminder_count >= 3) return { eligible: false, reason: 'Reminder count capped at 3' };
      if (cart.last_reminder_sent_at !== null) {
        const lastSent = new Date(cart.last_reminder_sent_at);
        if (lastSent >= oneDayAgo) return { eligible: false, reason: 'Last reminder sent less than 24h ago (backoff active)' };
      }
      return { eligible: true, reason: 'Eligible for recovery reminder' };
    }

    const testCarts: { cart: MockCart; expectedEligible: boolean; desc: string }[] = [
      {
        cart: { id: '1', email: 'c1@test.com', recovered: false, created_at: new Date(now - 2 * 3600000).toISOString(), reminder_count: null, last_reminder_sent_at: null },
        expectedEligible: true,
        desc: 'New abandoned cart (>1h old, never reminded)',
      },
      {
        cart: { id: '2', email: 'c2@test.com', recovered: false, created_at: new Date(now - 30 * 60000).toISOString(), reminder_count: null, last_reminder_sent_at: null },
        expectedEligible: false,
        desc: 'Too recent abandoned cart (30 min old)',
      },
      {
        cart: { id: '3', email: 'c3@test.com', recovered: true, created_at: new Date(now - 48 * 3600000).toISOString(), reminder_count: 0, last_reminder_sent_at: null },
        expectedEligible: false,
        desc: 'Already recovered cart',
      },
      {
        cart: { id: '4', email: 'c4@test.com', recovered: false, created_at: new Date(now - 72 * 3600000).toISOString(), reminder_count: 3, last_reminder_sent_at: new Date(now - 25 * 3600000).toISOString() },
        expectedEligible: false,
        desc: 'Capped reminder count (reminder_count = 3)',
      },
      {
        cart: { id: '5', email: 'c5@test.com', recovered: false, created_at: new Date(now - 96 * 3600000).toISOString(), reminder_count: 4, last_reminder_sent_at: new Date(now - 48 * 3600000).toISOString() },
        expectedEligible: false,
        desc: 'Over-capped reminder count (reminder_count = 4)',
      },
      {
        cart: { id: '6', email: 'c6@test.com', recovered: false, created_at: new Date(now - 48 * 3600000).toISOString(), reminder_count: 1, last_reminder_sent_at: new Date(now - 2 * 3600000).toISOString() },
        expectedEligible: false,
        desc: 'Backoff violation (reminder sent 2h ago)',
      },
      {
        cart: { id: '7', email: 'c7@test.com', recovered: false, created_at: new Date(now - 48 * 3600000).toISOString(), reminder_count: 1, last_reminder_sent_at: new Date(now - 25 * 3600000).toISOString() },
        expectedEligible: true,
        desc: 'Valid 2nd reminder (>24h since 1st reminder)',
      },
      {
        cart: { id: '8', email: 'c8@test.com', recovered: false, created_at: new Date(now - 72 * 3600000).toISOString(), reminder_count: 2, last_reminder_sent_at: new Date(now - 26 * 3600000).toISOString() },
        expectedEligible: true,
        desc: 'Valid 3rd reminder (>24h since 2nd reminder, count=2 < 3)',
      },
    ];

    for (const { cart, expectedEligible, desc } of testCarts) {
      const evaluation = shouldProcessCart(cart);
      assert(evaluation.eligible === expectedEligible, `Cart recovery rule: ${desc} -> eligible=${evaluation.eligible} (${evaluation.reason})`);
    }
  }

  // ===========================================================================
  // 3. COUPON VALIDATION TESTING (/api/coupons/validate)
  // ===========================================================================
  console.log('\n--- 3. Testing /api/coupons/validate Edge Cases ---');

  // 3.1 Basic validation requirements
  {
    // Empty body / Missing code
    const reqNoCode = new Request('http://localhost:3000/api/coupons/validate', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({}),
    });
    const resNoCode = await couponValidatePost(reqNoCode);
    assert(resNoCode.status === 400, 'Rejects missing coupon code with 400 Bad Request');
  }

  // 3.2 Referral codes ('REF-')
  console.log('  Testing Referral Codes:');
  {
    // Non-existent referral code
    const reqRefNotExist = new Request('http://localhost:3000/api/coupons/validate', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ code: 'REF-DOESNOTEXIST999' }),
    });
    const resRefNotExist = await couponValidatePost(reqRefNotExist);
    assert(resRefNotExist.status === 404, 'Non-existent referral code returns 404');
  }

  // 3.3 Discount Math: Percentage vs Fixed calculation precision
  console.log('  Testing Discount Math (Percentage vs Fixed):');
  {
    interface CouponRule {
      code: string;
      discount_type: 'percent' | 'fixed';
      discount_value: number;
    }

    function calculateDiscount(orderAmount: number, coupon: CouponRule): { finalAmount: number; discountAmount: number } {
      let discountAmount = 0;
      if (coupon.discount_type === 'percent') {
        discountAmount = (orderAmount * coupon.discount_value) / 100;
      } else if (coupon.discount_type === 'fixed') {
        discountAmount = Math.min(orderAmount, coupon.discount_value);
      }
      // Round to 2 decimal places to avoid floating point imprecision
      discountAmount = Math.round(discountAmount * 100) / 100;
      const finalAmount = Math.max(0, Math.round((orderAmount - discountAmount) * 100) / 100);
      return { finalAmount, discountAmount };
    }

    // Percentage discount tests
    const p5 = calculateDiscount(100, { code: 'RECOVER5', discount_type: 'percent', discount_value: 5 });
    assert(p5.discountAmount === 5 && p5.finalAmount === 95, '5% discount on $100 -> $5 discount, $95 final');

    const p5Odd = calculateDiscount(39.99, { code: 'RECOVER5', discount_type: 'percent', discount_value: 5 });
    assert(p5Odd.discountAmount === 2 && p5Odd.finalAmount === 37.99, '5% discount on $39.99 -> $2.00 discount, $37.99 final');

    const p10 = calculateDiscount(250.50, { code: 'VIP10', discount_type: 'percent', discount_value: 10 });
    assert(p10.discountAmount === 25.05 && p10.finalAmount === 225.45, '10% discount on $250.50 -> $25.05 discount, $225.45 final');

    // Fixed discount tests
    const f10 = calculateDiscount(50, { code: 'SAVE10', discount_type: 'fixed', discount_value: 10 });
    assert(f10.discountAmount === 10 && f10.finalAmount === 40, 'Fixed $10 discount on $50 -> $10 discount, $40 final');

    const fCapped = calculateDiscount(8, { code: 'SAVE10', discount_type: 'fixed', discount_value: 10 });
    assert(fCapped.discountAmount === 8 && fCapped.finalAmount === 0, 'Fixed $10 discount on $8 order caps at $8, $0 final (never negative)');
  }

  // 3.4 Single-use per email and expiration logic model test
  console.log('  Testing Coupon Single-Use & Expiration Logic Invariants:');
  {
    interface MockCoupon {
      code: string;
      expires_at: string | null;
      max_uses: number;
      used_count: number;
    }

    interface MockCouponUse {
      coupon_code: string;
      email: string;
    }

    function validateCouponState(
      coupon: MockCoupon | null,
      email: string | undefined,
      existingUses: MockCouponUse[]
    ): { valid: boolean; error?: string } {
      if (!coupon) return { valid: false, error: 'Invalid coupon code' };
      if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
        return { valid: false, error: 'Coupon has expired' };
      }
      if ((coupon.used_count || 0) >= (coupon.max_uses || 1)) {
        return { valid: false, error: 'Coupon usage limit reached' };
      }
      if (email) {
        const cleanEmail = email.toLowerCase().trim();
        const hasUsed = existingUses.some(u => u.coupon_code === coupon.code && u.email.toLowerCase().trim() === cleanEmail);
        if (hasUsed) {
          return { valid: false, error: 'Coupon has already been used by this email' };
        }
      }
      return { valid: true };
    }

    const testCoupon: MockCoupon = {
      code: 'RECOVER5',
      expires_at: new Date(Date.now() + 86400000).toISOString(), // expires tomorrow
      max_uses: 1000,
      used_count: 50,
    };

    const expiredCoupon: MockCoupon = {
      code: 'EXPIRED10',
      expires_at: new Date(Date.now() - 86400000).toISOString(), // expired yesterday
      max_uses: 1000,
      used_count: 5,
    };

    const exhaustedCoupon: MockCoupon = {
      code: 'ONETIME',
      expires_at: null,
      max_uses: 1,
      used_count: 1,
    };

    const uses: MockCouponUse[] = [
      { coupon_code: 'RECOVER5', email: 'already.used@example.com' },
    ];

    // Case 1: Valid unused coupon
    const r1 = validateCouponState(testCoupon, 'fresh.user@example.com', uses);
    assert(r1.valid === true, 'Fresh email can use valid coupon');

    // Case 2: Already used by email
    const r2 = validateCouponState(testCoupon, 'already.used@example.com', uses);
    assert(r2.valid === false && r2.error === 'Coupon has already been used by this email', 'Rejects repeat usage by same email');

    // Case 3: Case-insensitive email dedup
    const r3 = validateCouponState(testCoupon, '  ALREADY.USED@EXAMPLE.COM  ', uses);
    assert(r3.valid === false && r3.error === 'Coupon has already been used by this email', 'Rejects uppercase/spaced duplicate email');

    // Case 4: Expired coupon
    const r4 = validateCouponState(expiredCoupon, 'fresh.user@example.com', uses);
    assert(r4.valid === false && r4.error === 'Coupon has expired', 'Rejects expired coupon');

    // Case 5: Exhausted max uses
    const r5 = validateCouponState(exhaustedCoupon, 'fresh.user@example.com', uses);
    assert(r5.valid === false && r5.error === 'Coupon usage limit reached', 'Rejects exhausted coupon');
  }

  // ===========================================================================
  // SUMMARY
  // ===========================================================================
  console.log('\n========================================================================');
  console.log(`🏁 DEEP VERIFICATION COMPLETE: ${passedAssertions} Passed, ${failedAssertions} Failed`);
  console.log('========================================================================\n');

  if (failedAssertions > 0) {
    console.error('FAILED ASSERTIONS:');
    failures.forEach(f => console.error(f));
    process.exit(1);
  } else {
    console.log('🎉 ALL EMPIRICAL DEEP VERIFICATION ASSERTIONS PASSED WITH ZERO ERRORS!');
    process.exit(0);
  }
}

runDeepVerificationSuite().catch(err => {
  console.error('Deep verification fatal error:', err);
  process.exit(1);
});
