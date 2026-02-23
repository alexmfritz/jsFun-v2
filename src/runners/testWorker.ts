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