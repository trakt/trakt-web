// Cooperative scheduling: yields control to the browser between chunks so it
// can handle frames and input without blocking the main thread.
// https://web.dev/articles/optimize-long-tasks

// scheduler.yield() (Chrome 129+) is the standard primitive; setTimeout(0) is
// the pre-standard fallback — both suspend the current task and reschedule it.
function yieldToMain(): Promise<void> {
  const scheduler = (globalThis as { scheduler?: { yield?: () => Promise<void> } }).scheduler;
  if (typeof scheduler?.yield === 'function') {
    return scheduler.yield();
  }
  return new Promise((resolve) => setTimeout(resolve, 0));
}

export async function chunkedReduce<T, A>(
  iterable: Iterable<T>,
  reducer: (acc: A, item: T) => A,
  initial: A,
  chunkSize = 5_000,
): Promise<A> {
  let acc = initial;
  let i = 0;
  for (const item of iterable) {
    acc = reducer(acc, item);
    if (++i % chunkSize === 0) await yieldToMain();
  }
  return acc;
}
