const TIMEOUT_MS = 5000;

self.onmessage = async (e: MessageEvent<{ code: string; testRunnerStr: string }>) => {
  const { code, testRunnerStr } = e.data;
  const timer = setTimeout(() => {
    self.postMessage({
      error: `Test timed out after ${TIMEOUT_MS / 1000}s — your code may contain an infinite loop`,
    });
    self.close();
  }, TIMEOUT_MS);

  try {
    const runner = new Function(`return (${testRunnerStr})`)() as (
      code: string
    ) => { pass: boolean; description: string; got?: unknown }[]
       | Promise<{ pass: boolean; description: string; got?: unknown }[]>;

    const results = await runner(code);
    clearTimeout(timer);

    self.postMessage({
      results: results.map((r) => ({
        pass: Boolean(r.pass),
        description: r.description,
        got: r.got,
      })),
    });
  } catch (err) {
    clearTimeout(timer);
    const message = err instanceof Error ? err.message : String(err);
    self.postMessage({ error: message });
  }
};

// The worker receives { code, testRunnerStr } via postMessage. It:

// 1. Starts a 5-second self-destruct timer. If the student's code contains an infinite loop, the timer fires, posts an error message, 
// and calls self.close() to terminate the worker.
// 2. Compiles the testRunnerStr using new Function() -- the same pattern as the direct execution path.
// 3. Runs the compiled runner with the student's code.
// 4. Posts back { results } on success or { error } on failure.

// Why does both the worker AND the caller have a 5-second timeout? Defense in depth. 
// The worker's timeout handles infinite loops inside the student's code. 
// The caller's timeout (in runInWorker) handles cases where the worker itself hangs -- 
// for example, if new Function() throws synchronously before the timer starts, or if self.close() does not work reliably in all browsers. 
// Either timeout is sufficient; having both ensures the UI never freezes.