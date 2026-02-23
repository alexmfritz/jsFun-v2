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

/** Fallback for Vitest/jsdom where Worker is undefined. */
function runDirect(code: string, testRunnerStr: string): Promise<TestResult[]> {
  return new Promise((resolve) => {
    try {
      const runner = new Function(`return (${testRunnerStr})`)() as (
        code: string
      ) =>
        | { pass: boolean; description: string; got?: unknown }[]
        | Promise<{ pass: boolean; description: string; got?: unknown }[]>;

      const result = runner(code);
      const normalize = (
        results: { pass: boolean; description: string; got?: unknown }[]
      ): TestResult[] =>
        results.map((r) => ({
          pass: Boolean(r.pass),
          description: r.description,
          got: r.got,
        }));

      if (result instanceof Promise) {
        result
          .then((r) => resolve(normalize(r)))
          .catch((err) =>
            resolve([
              {
                pass: false,
                description: `Runtime error: ${err instanceof Error ? err.message : String(err)}`,
                got: undefined,
              },
            ])
          );
      } else {
        resolve(normalize(result));
      }
    } catch (err) {
      resolve([
        {
          pass: false,
          description: `Runtime error: ${err instanceof Error ? err.message : String(err)}`,
          got: undefined,
        },
      ]);
    }
  });
}

/** Primary path: run tests in a sandboxed Web Worker. */
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

/** For DOM exercises that need document.createElement, dispatchEvent, etc. */
function runInIframeSandbox(code: string, testRunnerStr: string): Promise<TestResult[]> {
  return new Promise((resolve) => {
    let settled = false;
    const iframe = document.createElement('iframe');
    iframe.sandbox.add('allow-scripts');
    iframe.style.cssText = 'position:absolute;left:-9999px;top:-9999px;width:0;height:0;';
    document.body.appendChild(iframe);

    const timer = setTimeout(() => {
      if (!settled) {
        settled = true;
        cleanup();
        resolve([{
          pass: false,
          description: `Test timed out after ${TIMEOUT_MS / 1000}s — your code may contain an infinite loop`,
        }]);
      }
    }, TIMEOUT_MS);

    const onMessage = (e: MessageEvent<{ results?: TestResult[]; error?: string }>) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      cleanup();

      if (e.data.error) {
        resolve([{ pass: false, description: `Runtime error: ${e.data.error}`, got: undefined }]);
      } else {
        resolve(e.data.results ?? []);
      }
    };

    window.addEventListener('message', onMessage);

    const cleanup = () => {
      window.removeEventListener('message', onMessage);
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
    };

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
