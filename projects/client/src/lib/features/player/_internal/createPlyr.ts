import { time } from "$lib/utils/timing/time";

function waitForGlobalPlyr(): Promise<new (...args: unknown[]) => Plyr> {
  return new Promise((resolve, reject) => {
    let rafId: ReturnType<typeof requestAnimationFrame>;

    const timeout = setTimeout(() => {
      cancelAnimationFrame(rafId);
      reject(new Error("Plyr failed to load"));
    }, time.seconds(10));

    function check() {
      // deno-lint-ignore no-explicit-any
      const PlyrClass = (globalThis as any).Plyr;
      if (PlyrClass) {
        clearTimeout(timeout);
        return resolve(PlyrClass);
      }
      rafId = requestAnimationFrame(check);
    }
    check();
  });
}

export async function createPlyr(
  node: string | HTMLElement,
  options: Plyr.Options,
): Promise<Plyr> {
  const PlyrClass = await waitForGlobalPlyr();
  return new PlyrClass(node, options);
}
