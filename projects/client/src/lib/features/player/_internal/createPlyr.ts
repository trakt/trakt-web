import { time } from '$lib/utils/timing/time';

/**
 * Plyr is only needed once a viewer opens a trailer, so its script and
 * stylesheet are injected on first use instead of from `app.html`. Loading them
 * up front cost every visitor a cross-origin script and stylesheet during page
 * load -- and the deferred script still had to execute before
 * `DOMContentLoaded`.
 */
const PLYR_VERSION = '3.8.3';
const PLYR_SCRIPT_URL = `https://cdn.plyr.io/${PLYR_VERSION}/plyr.js`;
const PLYR_STYLESHEET_URL = `https://cdn.plyr.io/${PLYR_VERSION}/plyr.css`;

type PlyrConstructor = new (...args: unknown[]) => Plyr;

function readGlobalPlyr(): PlyrConstructor | undefined {
  return (globalThis as { Plyr?: PlyrConstructor }).Plyr;
}

function injectStylesheet() {
  const isPresent = document.querySelector(
    `link[href="${PLYR_STYLESHEET_URL}"]`,
  );

  if (isPresent) {
    return;
  }

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = PLYR_STYLESHEET_URL;
  /**
   * A failed link left in the DOM would satisfy the presence check above
   * forever, so the next open could never retry the stylesheet.
   */
  link.addEventListener('error', () => link.remove());
  document.head.appendChild(link);
}

function injectScript(): Promise<PlyrConstructor> {
  const preloaded = readGlobalPlyr();

  if (preloaded) {
    return Promise.resolve(preloaded);
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = PLYR_SCRIPT_URL;
    script.async = true;

    /**
     * Every failure path removes the element, timeout included -- there the
     * request may still be in flight and would otherwise resolve into a
     * detached attempt. A failed tag left in the DOM would leak one element
     * per retry and re-download on a flaky connection.
     */
    const settle = (PlyrClass: PlyrConstructor | undefined) => {
      clearTimeout(timeout);

      if (!PlyrClass) {
        script.remove();
        reject(new Error('Plyr failed to load'));
        return;
      }

      resolve(PlyrClass);
    };

    const timeout = setTimeout(() => settle(undefined), time.seconds(10));

    script.addEventListener('load', () => settle(readGlobalPlyr()));
    script.addEventListener('error', () => settle(undefined));

    document.head.appendChild(script);
  });
}

/**
 * Module-scoped so concurrent and repeat opens share one script injection. A
 * failed load is cleared so the next open retries rather than replaying the
 * rejection forever.
 */
let scriptLoad: Promise<PlyrConstructor> | null = null;

export async function createPlyr(
  node: string | HTMLElement,
  options: Plyr.Options,
): Promise<Plyr> {
  injectStylesheet();

  scriptLoad ??= injectScript().catch((error: unknown) => {
    scriptLoad = null;
    throw error;
  });

  const PlyrClass = await scriptLoad;
  return new PlyrClass(node, options);
}
