import { test, expect } from '@playwright/test';

// These tests require the dev server to be running.
// Run with: npm run dev && npm run dev:server && npm run test:e2e

// Dismiss the tutorial and block progress API calls so E2E tests
// never write to student data (user-data/progress.json)
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('jsfun-tutorial-seen', 'true');
  });
  await page.route('**/api/progress/**', (route) => {
    if (route.request().method() === 'POST') {
      return route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
    }
    return route.continue();
  });
});

test.describe('Browse View', () => {
  test('loads and shows exercise topic cards', async ({ page }) => {
    await page.goto('/exercises');
    await expect(page.locator('h2').filter({ hasText: 'Topics' })).toBeVisible();
    await expect(page.locator('text=JS Fundamentals')).toBeVisible();
    await expect(page.locator('text=Data Structures')).toBeVisible();
  });

  test('search filters exercises', async ({ page }) => {
    await page.goto('/exercises');
    // Type in search
    await page.fill('input[placeholder*="Search"]', 'Sum of Array');
    await expect(page.locator('text=Sum of Array')).toBeVisible();
    // Other exercises should be hidden
    await expect(page.locator('text=Hello, Variables')).not.toBeVisible();
  });

  test('clicking a category shows exercises', async ({ page }) => {
    await page.goto('/exercises');
    await page.click('text=JS Fundamentals');
    // Should show exercises in that category
    await expect(page.locator('text=Hello, Variables')).toBeVisible();
  });
});

test.describe('Exercise View', () => {
  test('opens exercise and shows instructions', async ({ page }) => {
    await page.goto('/exercises/1');
    await expect(page.locator('h1').filter({ hasText: 'Hello, Variables' })).toBeVisible();
    await expect(page.locator('code').filter({ hasText: 'greet' }).first()).toBeVisible();
  });

  test('Ctrl+Enter runs tests', async ({ page }) => {
    await page.goto('/exercises/1');
    await page.waitForSelector('.cm-editor');
    // Set editor content via CodeMirror dispatch (keyboard input is unreliable with CM)
    await page.evaluate(() => {
      const container = document.querySelector('[data-testid="code-editor"]') as any;
      const view = container?.__cmView;
      if (view) view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: 'function greet(name) { return "Hello, " + name + "!"; }' } });
    });
    await page.click('.cm-content');
    await page.keyboard.press('Control+Enter');
    await expect(page.locator('text=All Passing')).toBeVisible({ timeout: 10000 });
  });

  test('Run Tests button executes tests', async ({ page }) => {
    await page.goto('/exercises/1');
    await page.waitForSelector('.cm-editor');
    await page.evaluate(() => {
      const container = document.querySelector('[data-testid="code-editor"]') as any;
      const view = container?.__cmView;
      if (view) view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: 'function greet(name) { return "Hello, " + name + "!"; }' } });
    });
    await page.click('button:has-text("Run Tests")');
    await expect(page.locator('text=All Passing')).toBeVisible({ timeout: 10000 });
  });

  test('back button returns to browse', async ({ page }) => {
    await page.goto('/exercises/1');
    await page.click('text=← Back');
    await expect(page).toHaveURL(/\/exercises$/);
  });
});

test.describe('Theme Toggle (3-way cycle)', () => {
  test('cycles through dark → light → high-contrast → dark', async ({ page }) => {
    await page.goto('/exercises');
    const html = page.locator('html');

    // Starts in dark mode
    await expect(html).toHaveClass(/dark/);

    // First click → light
    await page.click('[aria-label*="Switch to"]');
    await expect(html).toHaveClass(/light/);
    await expect(html).not.toHaveClass(/dark/);

    // Second click → high-contrast
    await page.click('[aria-label*="Switch to"]');
    await expect(html).toHaveClass(/high-contrast/);
    await expect(html).not.toHaveClass(/light/);

    // Third click → dark (full cycle)
    await page.click('[aria-label*="Switch to"]');
    await expect(html).toHaveClass(/dark/);
    await expect(html).not.toHaveClass(/high-contrast/);
  });

  test('high-contrast mode applies correct CSS variables', async ({ page }) => {
    await page.goto('/exercises');
    // Toggle to high-contrast (dark → light → high-contrast)
    await page.click('[aria-label*="Switch to"]');
    await page.click('[aria-label*="Switch to"]');
    await expect(page.locator('html')).toHaveClass(/high-contrast/);

    // Verify CSS variable is applied
    const bgColor = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--bg-root').trim();
    });
    expect(bgColor).toBe('#000000');
  });
});

test.describe('Dashboard', () => {
  test('shows welcome state when no exercises are completed', async ({ page }) => {
    await page.goto('/dashboard');
    // With clean progress, dashboard shows the empty/welcome state
    await expect(page.locator('h1').filter({ hasText: /Welcome/ })).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Browse Exercises')).toBeVisible();
  });

  test('browse link navigates to exercises page', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.locator('text=Browse Exercises')).toBeVisible({ timeout: 10000 });
    await page.click('text=Browse Exercises');
    await expect(page).toHaveURL(/\/exercises/);
  });
});

test.describe('Solution Gating', () => {
  test('solution button is present in instructions panel', async ({ page }) => {
    await page.goto('/exercises/1');
    // Solution button should be visible (may be locked 🔒 or unlocked 🔓 depending on user progress)
    const solutionBtn = page.locator('button').filter({ hasText: 'Solution' });
    await expect(solutionBtn).toBeVisible();
  });
});

test.describe('Navigation', () => {
  test('header links navigate correctly', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Dashboard');
    await expect(page).toHaveURL(/\/dashboard/);
    await page.click('text=Exercises');
    await expect(page).toHaveURL(/\/exercises/);
    await page.click('text=Admin');
    await expect(page).toHaveURL(/\/admin/);
  });

  test('prev/next buttons navigate between exercises', async ({ page }) => {
    // Navigate into a category first so prev/next have context
    await page.goto('/exercises');
    await page.click('text=JS Fundamentals');
    // Click the first exercise card
    const firstCard = page.locator('article[role="button"]').first();
    await firstCard.click();
    await page.waitForSelector('.cm-editor');

    // Should show navigation counter in the toolbar (e.g. "1/12")
    // Use the toolbar area to avoid matching the header's global progress counter
    const toolbar = page.locator('button:has-text("Prev")').locator('..');
    const counter = toolbar.locator('text=/\\d+\\/\\d+/');
    await expect(counter.first()).toBeVisible();

    // Click "Next ›"
    const nextBtn = page.locator('button:has-text("Next")');
    if (await nextBtn.isEnabled()) {
      const currentUrl = page.url();
      await nextBtn.click();
      // URL should have changed to a different exercise
      await expect(page).not.toHaveURL(currentUrl);
      await page.waitForSelector('.cm-editor');

      // Click "‹ Prev" to go back
      const prevBtn = page.locator('button:has-text("Prev")');
      if (await prevBtn.isEnabled()) {
        await prevBtn.click();
        await expect(page).toHaveURL(currentUrl);
      }
    }
  });

  test('random button navigates to an exercise', async ({ page }) => {
    await page.goto('/exercises');
    // Look for the random/shuffle button
    const randomBtn = page.locator('button[title*="Random"], button[title*="random"], button:has-text("🎲")');
    if (await randomBtn.count() > 0) {
      await randomBtn.first().click();
      // Should navigate to an exercise page
      await expect(page).toHaveURL(/\/exercises\/\d+/);
    }
  });
});

test.describe('Reset Flow', () => {
  test('reset button opens confirmation modal', async ({ page }) => {
    await page.goto('/exercises/1');
    await page.waitForSelector('.cm-editor');

    // Type something to enable the reset button
    await page.click('.cm-editor');
    await page.keyboard.press('Control+a');
    await page.keyboard.type('const x = 1;');

    // Run tests to create a saved solution
    await page.click('button:has-text("Run Tests")');
    await page.waitForTimeout(2000);

    // Look for the reset button
    const resetBtn = page.locator('button:has-text("Reset")');
    if (await resetBtn.isVisible()) {
      await resetBtn.click();
      // Modal should appear
      await expect(page.locator('text=Reset Exercise?')).toBeVisible();
      await expect(page.locator('button:has-text("Cancel")')).toBeVisible();
    }
  });

  test('cancel closes the reset modal', async ({ page }) => {
    await page.goto('/exercises/1');
    await page.waitForSelector('.cm-editor');
    await page.click('.cm-editor');
    await page.keyboard.press('Control+a');
    await page.keyboard.type('const x = 1;');
    await page.click('button:has-text("Run Tests")');
    await page.waitForTimeout(2000);

    const resetBtn = page.locator('button:has-text("Reset")');
    if (await resetBtn.isVisible()) {
      await resetBtn.click();
      await expect(page.locator('text=Reset Exercise?')).toBeVisible();

      // Click cancel
      await page.click('button:has-text("Cancel")');
      await expect(page.locator('text=Reset Exercise?')).not.toBeVisible();
    }
  });

  test('Escape key closes the reset modal', async ({ page }) => {
    await page.goto('/exercises/1');
    await page.waitForSelector('.cm-editor');
    await page.click('.cm-editor');
    await page.keyboard.press('Control+a');
    await page.keyboard.type('const x = 1;');
    await page.click('button:has-text("Run Tests")');
    await page.waitForTimeout(2000);

    const resetBtn = page.locator('button:has-text("Reset")');
    if (await resetBtn.isVisible()) {
      await resetBtn.click();
      await expect(page.locator('text=Reset Exercise?')).toBeVisible();

      // Press Escape
      await page.keyboard.press('Escape');
      await expect(page.locator('text=Reset Exercise?')).not.toBeVisible();
    }
  });
});

test.describe('Keyboard Navigation', () => {
  test('exercise cards are keyboard-accessible with Tab and Enter', async ({ page }) => {
    await page.goto('/exercises');
    await page.click('text=JS Fundamentals');

    // Wait for exercise cards to load
    const card = page.locator('article[role="button"]').first();
    await expect(card).toBeVisible();

    // Tab to the first card and check tabindex
    await card.focus();
    expect(await card.getAttribute('tabindex')).toBe('0');

    // Press Enter to navigate
    const currentUrl = page.url();
    await page.keyboard.press('Enter');
    await expect(page).not.toHaveURL(currentUrl);
  });

  test('exercise cards respond to Space key', async ({ page }) => {
    await page.goto('/exercises');
    await page.click('text=JS Fundamentals');

    const card = page.locator('article[role="button"]').first();
    await expect(card).toBeVisible();
    await card.focus();

    // Press Space to navigate
    const currentUrl = page.url();
    await page.keyboard.press('Space');
    await expect(page).not.toHaveURL(currentUrl);
  });
});

test.describe('Accessibility Attributes', () => {
  test('instructions panel has proper tab ARIA roles', async ({ page }) => {
    await page.goto('/exercises/1');

    // Tab list should exist
    const tablist = page.locator('[role="tablist"]');
    await expect(tablist).toBeVisible();

    // Individual tabs
    const tabs = page.locator('[role="tab"]');
    await expect(tabs.first()).toBeVisible();

    // Tab panel
    const tabpanel = page.locator('[role="tabpanel"]');
    await expect(tabpanel).toBeVisible();

    // Check aria-selected on active tab
    const activeTab = page.locator('[role="tab"][aria-selected="true"]');
    await expect(activeTab).toBeVisible();
  });

  test('progress bar in header has progressbar role', async ({ page }) => {
    await page.goto('/exercises');
    const progressbar = page.locator('[role="progressbar"]');
    if (await progressbar.count() > 0) {
      const first = progressbar.first();
      expect(await first.getAttribute('aria-valuemin')).toBe('0');
      expect(await first.getAttribute('aria-valuemax')).toBe('100');
      const valueNow = await first.getAttribute('aria-valuenow');
      expect(valueNow).toBeTruthy();
      expect(Number(valueNow)).toBeGreaterThanOrEqual(0);
    }
  });

  test('skip-to-main link exists and targets main content', async ({ page }) => {
    await page.goto('/exercises');
    // Skip link should exist (sr-only means visually hidden but in DOM)
    const skipLink = page.locator('a[href="#main-content"]');
    await expect(skipLink).toBeAttached();

    // Main content target should exist
    const main = page.locator('#main-content');
    await expect(main).toBeAttached();
  });

  test('reset modal has proper dialog semantics', async ({ page }) => {
    await page.goto('/exercises/1');
    await page.waitForSelector('.cm-editor');
    await page.click('.cm-editor');
    await page.keyboard.press('Control+a');
    await page.keyboard.type('const x = 1;');
    await page.click('button:has-text("Run Tests")');
    await page.waitForTimeout(2000);

    const resetBtn = page.locator('button:has-text("Reset")');
    if (await resetBtn.isVisible()) {
      await resetBtn.click();
      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();
      expect(await dialog.getAttribute('aria-modal')).toBe('true');
      expect(await dialog.getAttribute('aria-labelledby')).toBe('reset-modal-title');
    }
  });

  test('test results have live region for screen readers', async ({ page }) => {
    await page.goto('/exercises/1');
    await page.waitForSelector('.cm-editor');
    await page.evaluate(() => {
      const container = document.querySelector('[data-testid="code-editor"]') as any;
      const view = container?.__cmView;
      if (view) view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: 'function greet(name) { return "Hello, " + name + "!"; }' } });
    });
    await page.click('button:has-text("Run Tests")');
    await expect(page.locator('text=All Passing')).toBeVisible({ timeout: 10000 });

    // Check for aria-live region on the test results (not CodeMirror's internal .cm-announced)
    const liveRegion = page.locator('[role="status"][aria-live="polite"]');
    await expect(liveRegion).toBeVisible();
  });
});
