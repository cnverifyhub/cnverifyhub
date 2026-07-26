import { test, expect } from '@playwright/test';

test.describe('HotProducts Horizontal Slider E2E Audit', () => {
  test('pinned section holds scroll pin through full content scroll', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const section = page.locator('#hot-products-section');
    await expect(section).toBeVisible();

    await section.scrollIntoViewIfNeeded();

    // Perform continuous scroll ticks over the section
    for (let i = 0; i < 12; i++) {
      await page.mouse.wheel(0, 300);
      await page.waitForTimeout(100);
    }

    // Section must remain in viewport while horizontal scroll occurs
    await expect(section).toBeInViewport();
  });

  test('no critical GSAP or React hydration console errors during scroll', async ({ page }) => {
    const consoleErrors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error' || msg.type() === 'warning') {
        consoleErrors.push(`[${msg.type()}] ${msg.text()}`);
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    for (let i = 0; i < 15; i++) {
      await page.mouse.wheel(0, 400);
      await page.waitForTimeout(50);
    }

    const breakingErrors = consoleErrors.filter(
      (err) =>
        err.includes('GSAP target null') ||
        err.includes('Hydration failed') ||
        err.includes('Minified React error')
    );

    expect(breakingErrors).toHaveLength(0);
  });
});

const viewports = [
  { name: 'mobile-375', width: 375, height: 812 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'desktop-1440', width: 1440, height: 900 },
];

for (const vp of viewports) {
  test(`responsive layout check at ${vp.name}`, async ({ page }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto('/');
    await expect(page.locator('#hot-products-section')).toBeVisible();

    const nav = page.locator('header nav');
    if (await nav.isVisible()) {
      const navBox = await nav.boundingBox();
      if (navBox) {
        expect(navBox.height).toBeLessThan(100);
      }
    }
  });
}
