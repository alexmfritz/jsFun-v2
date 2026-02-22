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

// The needsDOM() function is the routing decision. 
// Most JS exercises run pure logic -- they do not need document.createElement or window. 
// Those run in a Web Worker (fastest, most isolated). 
// The few exercises that test DOM manipulation (creating elements, dispatching events) get routed to an iframe instead, 
// because Workers have no DOM.

export async function runJsTests(code: string, testRunnerStr: string): Promise<TestResult[]> {
  if (!testRunnerStr.trim()) {
    return [{ pass: false, description: 'No test runner defined', got: undefined }];
  }

  // In test environments (Vitest/jsdom), Workers aren't available
  if (typeof Worker === 'undefined') {
    return runDirect(code, testRunnerStr);
  }

  if (needsDOM(testRunnerStr)) {
    return runInIframeSandbox(code, testRunnerStr);
  }

  return runInWorker(code, testRunnerStr);
}

// Three paths:
// 1. runDirect() -- fallback for Vitest/jsdom where Worker is undefined. Uses new Function() in the main thread. Only used during testing, never in the real app.
// 2. runInIframeSandbox() -- for DOM exercises. Creates a hidden <iframe sandbox="allow-scripts"> off-screen, writes a <script> that compiles and runs the test, and receives results via parent.postMessage. The sandbox attribute prevents the iframe from accessing the parent origin.
// 3. runInWorker() -- the primary path. Spawns a Web Worker, sends the code and testRunner string, waits for results.

function runInWorker(code: string, testRunnerStr: string): Promise<TestResult[]> {
  return new Promise((resolve) => {
    let settled = false;

    const worker = new Worker(new URL('./testWorker.ts', import.meta.url), { type: 'module' });

    const timer = setTimeout(() => {
      if (!settled) {
        settled = true;
        worker.terminate();
        resolve([{
          pass: false,
          description: `Test timed out after ${TIMEOUT_MS / 1000}s — your code may contain an infinite loop`,
        }]);
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

// Why the settled flag? 
// A race condition exists: the timeout might fire at the exact moment the worker posts its results. 
// Without the flag, resolve() would be called twice, which is harmless in JavaScript (second call is ignored) but makes the logic confusing. 
// The flag makes the mutual exclusion explicit: whichever event fires first wins, and the other is ignored.

function runInIframeSandbox(code: string, testRunnerStr: string): Promise<TestResult[]> {
  return new Promise((resolve) => {
    let settled = false;
    const iframe = document.createElement('iframe');
    iframe.sandbox.add('allow-scripts');
    iframe.style.cssText = 'position:absolute;left:-9999px;top:-9999px;width:0;height:0;';
    document.body.appendChild(iframe);

    // ... timeout and message handler with settled flag ...

    const script = `
      <script>
        (async () => {
          try {
            const runner = new Function('return (' + ${JSON.stringify(testRunnerStr)} + ')')();
            const results = await runner(${JSON.stringify(code)});
            parent.postMessage({ results: results.map(r => ({
              pass: Boolean(r.pass), description: r.description, got: r.got,
            })) }, '*');
          } catch (err) {
            parent.postMessage({ error: err instanceof Error ? err.message : String(err) }, '*');
          }
        })();
      ${'<'}/script>
    `;

    const doc = iframe.contentDocument;
    if (doc) {
      doc.open();
      doc.write(`<!DOCTYPE html><html><body>${script}</body></html>`);
      doc.close();
    }
  });
}