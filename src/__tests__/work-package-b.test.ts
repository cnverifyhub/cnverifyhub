import { categoryFaqMap, getCategoryFaqs } from '../data/category-faqs';
import { getTenantConfig } from '../lib/tenant-config';
import { getAllPosts, getPostBySlug } from '../lib/blog';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ Assertion Failed: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ Passed: ${message}`);
  }
}

async function runWorkPackageBTests() {
  console.log('=== Running Work Package B Verification Tests ===');

  // Test 1: Category FAQs coverage for all 7 core categories
  const expectedCategories = ['wechat', 'alipay', 'douyin', 'qq', 'wise', 'revolut', 'binance'];
  for (const cat of expectedCategories) {
    const zhFaqs = getCategoryFaqs(cat, 'zh');
    const enFaqs = getCategoryFaqs(cat, 'en');

    assert(zhFaqs.length >= 3, `Category '${cat}' (ZH) has at least 3 FAQs (found ${zhFaqs.length})`);
    assert(enFaqs.length >= 3, `Category '${cat}' (EN) has at least 3 FAQs (found ${enFaqs.length})`);

    // Verify questions and answers are non-empty and well-formed
    for (const faq of zhFaqs) {
      assert(faq.question.length > 5, `Category '${cat}' ZH question is valid: "${faq.question.slice(0, 20)}..."`);
      assert(faq.answer.length > 10, `Category '${cat}' ZH answer has substantive content`);
    }
    for (const faq of enFaqs) {
      assert(faq.question.length > 5, `Category '${cat}' EN question is valid: "${faq.question.slice(0, 20)}..."`);
      assert(faq.answer.length > 10, `Category '${cat}' EN answer has substantive content`);
    }
  }

  // Test 2: Bulk Pricing Configuration & Tiers
  const cnverifyhubConfig = getTenantConfig('cnverifyhub.com');
  assert(cnverifyhubConfig.psychology.bulkPricingEnabled === true, 'CNVerifyHub bulkPricingEnabled is true');
  assert(cnverifyhubConfig.pricing.bulkTiers.length >= 3, `CNVerifyHub has ${cnverifyhubConfig.pricing.bulkTiers.length} bulk tiers`);
  assert(cnverifyhubConfig.pricing.bulkTiers[0].min === 5, 'CNVerifyHub first bulk tier starts at 5 units');
  assert(cnverifyhubConfig.pricing.bulkTiers[0].discount === 0.05, 'CNVerifyHub first bulk tier gives 5% discount');

  const cnweproConfig = getTenantConfig('cnwepro.com');
  assert(cnweproConfig.psychology.bulkPricingEnabled === true, 'CNWePro bulkPricingEnabled is true');
  assert(cnweproConfig.pricing.bulkTiers.length >= 3, 'CNWePro has bulk tiers configured');

  // Test 3: Email regex validation for Newsletter Subscription
  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  assert(EMAIL_REGEX.test('user@example.com'), 'Valid standard email passes');
  assert(EMAIL_REGEX.test('buyer.pro+vip@domain.co.uk'), 'Valid plus-tagged email passes');
  assert(!EMAIL_REGEX.test('invalid-email'), 'Invalid plain string fails');
  assert(!EMAIL_REGEX.test('@nodomain.com'), 'Missing user part fails');
  assert(!EMAIL_REGEX.test('user@.com'), 'Missing domain name fails');

  // Test 4: Blog Engine Multi-Tenancy function existence and return safety
  const postsZh = await getAllPosts('zh');
  assert(Array.isArray(postsZh), 'getAllPosts("zh") returns an array safely');

  const postBySlug = await getPostBySlug('non-existent-slug', 'zh');
  assert(postBySlug === null, 'getPostBySlug for non-existent slug returns null safely');

  console.log('=== All Work Package B Tests Completed Successfully ===');
}

runWorkPackageBTests().catch(err => {
  console.error('Work Package B test runner failed:', err);
  process.exit(1);
});
