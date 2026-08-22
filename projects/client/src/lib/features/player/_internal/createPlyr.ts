import { time } from '$lib/utils/timing/time';

const PLYR_VERSION = '3.8.3';
const PLYR_SCRIPT_URL = `https://cdn.plyr.io/${PLYR_VERSION}/plyr.js`;
const PLYR_STYLESHEET_URL = `https://cdn.plyr.io/${PLYR_VERSION}/plyr.css`;

type PlyrConstructor = new (
  node: string | HTMLElement,
  options: Plyr.Options,
) => Plyr;

function readGlobalPlyr(): PlyrConstructor | undefined {
  return (globalThis as { Plyr?: PlyrConstructor }).Plyr;
}

function injectStylesheet() {
  if (document.querySelector(`link[href="${PLYR_STYLESHEET_URL}"]`)) {
    return;
  }

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = PLYR_STYLESHEET_URL;
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

    const fail = () => {
      script.remove();
      reject(new Error('Plyr failed to load'));
    };

    const timeout = setTimeout(fail, time.seconds(10));

    const settle = (PlyrClass: PlyrConstructor | undefined) => {
      clearTimeout(timeout);

      if (!PlyrClass) {
        fail();
        return;
      }

      resolve(PlyrClass);
    };

    script.addEventListener('load', () => settle(readGlobalPlyr()));
    script.addEventListener('error', () => settle(undefined));

    document.head.appendChild(script);
  });
}

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
