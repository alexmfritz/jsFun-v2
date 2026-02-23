import { TestResult } from '../types';

const TIMEOUT_MS = 5000;

/**
 * Detect whether a test runner needs real DOM APIs (document.createElement,
 * dispatchEvent, etc.) that aren't available in a Web Worker.
 * DOMParser IS available in workers, so we only flag the heavier DOM usage.
 */
function needsDOM(testRunnerStr: string): boolean {
  return (
    /\bdocument\.createElement\b/.test(testRunnerStr) ||
    /\bdispatchEvent\b/.test(testRunnerStr) ||
    /\bwindow\./.test(testRunnerStr)
  );
}

/**
 * Run JS tests in a sandboxed Web Worker with a timeout.
 * Falls back to a sandboxed iframe for exercises that need real DOM APIs.
 * Falls back to Function constructor in test environments where Workers
 * are not available.
 */
export async function runJsTests(code: string, testRunnerStr: string): Promise<TestResult[]> {
  if (!testRunnerStr.trim()) {
    return [{ pass: false, description: 'No test runner defined', got: undefined }];
  }

  // In test environments (Vitest/jsdom), Workers aren't available — use direct execution
  if (typeof Worker === 'undefined') {
    return runDirect(code, testRunnerStr);
  }

  if (needsDOM(testRunnerStr)) {
    return runInIframeSandbox(code, testRunnerStr);
  }

  return runInWorker(code, testRunnerStr);
}

/**
 * Direct execution fallback for test environments.
 * Uses Function constructor (not eval) for slightly better static analysis.
 */
async function runDirect(code: string, testRunnerStr: string): Promise<TestResult[]> {
  try {
    const runner = new Function(`return (${testRunnerStr})`)() as (
      code: string
    ) => TestResult[] | Promise<TestResult[]>;
    const results = await runner(code);
    return results.map((r) => ({
      pass: Boolean(r.pass),
      description: r.description,
      got: r.got,
    }));
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return [{ pass: false, description: `Runtime error: ${message}`, got: undefined }];
  }
}

/**
 * Primary path: execute tests in an isolated Web Worker.
 * No DOM, no window, no document — fully sandboxed with timeout.
 */
function runInWorker(code: string, testRunnerStr: string): Promise<TestResult[]> {
  return new Promise((resolve) => {
    let settled = false;

    // Dynamically import the worker to avoid issues in non-browser environments
    const worker = new Worker(new URL('./testWorker.ts', import.meta.url), { type: 'module' });

    const timer = setTimeout(() => {
      if (!settled) {
        settled = true;
        worker.terminate();
        resolve([
          {
            pass: false,
            description: `Test timed out after ${TIMEOUT_MS / 1000}s — your code may contain an infinite loop`,
          },
        ]);
      }
    }, TIMEOUT_MS);

    worker.onmessage = (e: MessageEvent<{ results?: TestResult[]; error?: string }>) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      worker.terminate();

      if (e.data.error) {
        resolve([{ pass: false, description: `Runtime error: ${e.data.error}`, got: undefined }]);
      } else {
        resolve(e.data.results ?? []);
      }
    };

    worker.onerror = (e) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      worker.terminate();
      resolve([{ pass: false, description: `Worker error: ${e.message}`, got: undefined }]);
    };

    worker.postMessage({ code, testRunnerStr });
  });
}

/**
 * Fallback path: execute tests in a sandboxed iframe for exercises
 * that need real DOM APIs (createElement, dispatchEvent, etc.).
 * The iframe has sandbox="allow-scripts" — no access to parent origin.
 */
function runInIframeSandbox(code: string, testRunnerStr: string): Promise<TestResult[]> {
  return new Promise((resolve) => {
    let settled = false;

    const iframe = document.createElement('iframe');
    iframe.sandbox.add('allow-scripts');
    iframe.style.cssText = 'position:absolute;left:-9999px;top:-9999px;width:0;height:0;';
    document.body.appendChild(iframe);

    const cleanup = () => {
      window.removeEventListener('message', handleMessage);
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
    };

    const timer = setTimeout(() => {
      if (!settled) {
        settled = true;
        cleanup();
        resolve([
          {
            pass: false,
            description: `Test timed out after ${TIMEOUT_MS / 1000}s — your code may contain an infinite loop`,
          },
        ]);
      }
    }, TIMEOUT_MS);

    const handleMessage = (e: MessageEvent) => {
      // Only accept messages from our iframe
      if (e.source !== iframe.contentWindow) return;
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      cleanup();

      const data = e.data as { results?: TestResult[]; error?: string };
      if (data.error) {
        resolve([{ pass: false, description: `Runtime error: ${data.error}`, got: undefined }]);
      } else {
        resolve(data.results ?? []);
      }
    };

    window.addEventListener('message', handleMessage);

    const script = `
      <script>
        (async () => {
          try {
            const runner = new Function('return (' + ${JSON.stringify(testRunnerStr)} + ')')();
            const results = await runner(${JSON.stringify(code)});
            parent.postMessage({
              results: results.map(r => ({
                pass: Boolean(r.pass),
                description: r.description,
                got: r.got,
              })),
            }, '*');
          } catch (err) {
            parent.postMessage({
              error: err instanceof Error ? err.message : String(err),
            }, '*');
          }
        })();
      ${'<'}/script>
    `;

    const doc = iframe.contentDocument;
    if (doc) {
      doc.open();
      doc.write(`<!DOCTYPE html><html><body>${script}</body></html>`);
      doc.close();
    } else {
      iframe.srcdoc = `<!DOCTYPE html><html><body>${script}</body></html>`;
    }
  });
}
