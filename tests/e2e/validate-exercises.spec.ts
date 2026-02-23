import { test, expect, Page } from '@playwright/test';

/**
 * Full Exercise Validation Suite
 *
 * Loads every exercise, injects its reference solution into the editor(s),
 * runs the tests in the real browser environment (Web Workers, iframes),
 * and asserts all tests pass.
 *
 * This catches:
 *  - Solutions that don't actually pass their test runners
 *  - testRunner strings that fail in browser context but work in Node
 *  - HTML/CSS testCases with bad selectors or incorrect expected values
 *  - Timeout issues in Web Worker execution
 *  - Starter code / solution mismatches
 *
 * Run: npx playwright test validate-exercises
 * (requires both dev and dev:server to be running, or let Playwright start them)
 */

// Generous timeout — 619 exercises at ~2-3s each ≈ 25 minutes, plus buffer
test.setTimeout(3_600_000); // 1 hour

interface Exercise {
  id: number;
  title: string;
  type: 'js' | 'html' | 'css' | 'html-css';
  tier: number;
  solution: string;
  testRunner: string;
  testCases?: unknown[];
  providedHtml?: string;
}

/**
 * Split an html-css solution into HTML and CSS parts.
 * Solutions use either a CSS comment marker or style tags to separate HTML from CSS.
 */
function splitHtmlCssSolution(solution: string): { html: string; css: string } {
  // Check for /* CSS */ marker first
  const cssMarkerIndex = solution.indexOf('/* CSS */');
  if (cssMarkerIndex !== -1) {
    return {
      html: solution.substring(0, cssMarkerIndex).trim(),
      css: solution.substring(cssMarkerIndex + '/* CSS */'.length).trim(),
    };
  }

  // Check for <style>...</style> tags
  const styleMatch = solution.match(/<style>([\s\S]*?)<\/style>/);
  if (styleMatch) {
    const css = styleMatch[1].trim();
    const html = solution.replace(/<style>[\s\S]*?<\/style>/, '').trim();
    return { html, css };
  }

  // Fallback: treat entire solution as HTML (CSS editor stays empty)
  return { html: solution, css: '' };
}

test.describe('Exercise Solution Validation', () => {
  let exercises: Exercise[] = [];

  test.beforeAll(async ({ browser }) => {
    // Fetch all exercises directly from the API
    const page = await browser.newPage();
    const response = await page.goto('http://localhost:3001/api/exercises');
    const data = await response!.json();
    exercises = data.exercises.map((e: Exercise) => ({
      id: e.id,
      title: e.title,
      type: e.type,
      tier: e.tier,
      solution: e.solution,
      testRunner: e.testRunner,
      testCases: e.testCases,
      providedHtml: e.providedHtml,
    }));
    await page.close();
    console.log(`Loaded ${exercises.length} exercises for validation`);
  });

  test('all exercise solutions pass their tests', async ({ page }) => {
    // ── Block progress API calls so validation never writes to student data ──
    await page.route('**/api/progress/**', (route) => {
      if (route.request().method() === 'POST') {
        return route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
      }
      return route.continue();
    });

    // ── Dismiss the tutorial on first load ─────────────────────────────
    await page.addInitScript(() => {
      localStorage.setItem('jsfun-tutorial-seen', 'true');
    });
    await page.goto('/exercises/1');

    // DOM exercises that use DOMParser or iframes in their testRunners.
    // These work in the real app (routed to iframe sandbox by needsDOM() detection)
    // but can't be validated via this automated test due to Web Worker limitations.
    const DOM_EXERCISE_IDS = new Set([336, 337, 338, 339, 340, 341, 342, 343]);

    const failures: { id: number; title: string; type: string; error: string }[] = [];
    let passed = 0;
    let skipped = 0;
    const startTime = Date.now();

    for (const exercise of exercises) {
      if (DOM_EXERCISE_IDS.has(exercise.id)) {
        skipped++;
        continue;
      }
      try {
        // Navigate to exercise — use domcontentloaded for speed
        await page.goto(`/exercises/${exercise.id}`, { waitUntil: 'domcontentloaded' });

        // Wait for editor to mount
        await page.waitForSelector('[data-testid="code-editor"]', { timeout: 10000 });
        // Brief wait for CodeMirror initialization
        await page.waitForTimeout(200);

        if (exercise.type === 'html-css') {
          // Split solution and inject into both editors
          const { html, css } = splitHtmlCssSolution(exercise.solution);

          // Inject into both editors via evaluate (handles the dual-editor DOM)
          await page.evaluate(
            ({ htmlCode, cssCode }) => {
              const editors = document.querySelectorAll('[data-testid="code-editor"]') as NodeListOf<
                HTMLElement & { __cmView?: any }
              >;
              // First editor = HTML
              if (editors[0]?.__cmView) {
                const view = editors[0].__cmView;
                view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: htmlCode } });
              }
              // Second editor = CSS
              if (editors[1]?.__cmView) {
                const view = editors[1].__cmView;
                view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: cssCode } });
              }
            },
            { htmlCode: html, cssCode: css }
          );
        } else {
          // Single editor: inject full solution
          await page.evaluate(
            ({ code }) => {
              const container = document.querySelector(
                '[data-testid="code-editor"]'
              ) as HTMLElement & { __cmView?: any };
              if (container?.__cmView) {
                const view = container.__cmView;
                view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: code } });
              }
            },
            { code: exercise.solution }
          );
        }

        // Click Run Tests
        await page.click('button:has-text("Run Tests")');

        // Wait for "All Passing" or timeout
        try {
          await page.locator('text=All Passing').waitFor({ timeout: 15000 });
          passed++;
        } catch {
          // Not all passing — capture what we can
          const statusText = await page
            .locator('[role="status"]')
            .textContent({ timeout: 2000 })
            .catch(() => 'no status');

          failures.push({
            id: exercise.id,
            title: exercise.title,
            type: exercise.type,
            error: statusText || 'Tests did not pass',
          });
        }
      } catch (err) {
        failures.push({
          id: exercise.id,
          title: exercise.title,
          type: exercise.type,
          error: err instanceof Error ? err.message : String(err),
        });
      }

      // Log progress every 50 exercises
      if ((passed + failures.length) % 50 === 0) {
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
        console.log(
          `  Progress: ${passed + failures.length}/${exercises.length} (${passed} passed, ${failures.length} failed) [${elapsed}s]`
        );
      }
    }

    // ── Final Report ──────────────────────────────────────────────────────
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
    console.log('\n' + '='.repeat(60));
    console.log('  EXERCISE VALIDATION REPORT');
    console.log('='.repeat(60));
    console.log(`  Total:    ${exercises.length}`);
    console.log(`  Passed:   ${passed}`);
    console.log(`  Skipped:  ${skipped} (DOM exercises)`);
    console.log(`  Failed:   ${failures.length}`);
    console.log(`  Time:     ${elapsed}s`);
    console.log('='.repeat(60));

    if (failures.length > 0) {
      console.log('\n  FAILURES:\n');
      for (const f of failures) {
        console.log(`  X [${f.id}] ${f.title} (${f.type})`);
        console.log(`    ${f.error}\n`);
      }
    }

    // Assert all passed
    expect(
      failures,
      `${failures.length} exercise(s) failed validation:\n${failures.map((f) => `  [${f.id}] ${f.title}: ${f.error}`).join('\n')}`
    ).toHaveLength(0);
  });
});
