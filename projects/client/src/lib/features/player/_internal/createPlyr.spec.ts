import { beforeEach, describe, expect, it, vi } from 'vitest';

const SCRIPT_SELECTOR = 'script[src="https://cdn.plyr.io/3.8.3/plyr.js"]';
const STYLESHEET_SELECTOR = 'link[href="https://cdn.plyr.io/3.8.3/plyr.css"]';

async function importCreatePlyr() {
  vi.resetModules();
  const { createPlyr } = await import('./createPlyr.ts');
  return createPlyr;
}

function failPendingElement(selector: string) {
  document.querySelector(selector)?.dispatchEvent(new Event('error'));
}

function countOf(selector: string) {
  return document.querySelectorAll(selector).length;
}

async function attemptAndFail(
  createPlyr: Awaited<ReturnType<typeof importCreatePlyr>>,
) {
  const pending = createPlyr(document.createElement('div'), {});
  failPendingElement(SCRIPT_SELECTOR);
  await expect(pending).rejects.toThrow('Plyr failed to load');
}

describe('util: createPlyr', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
  });

  it('should inject the script on first use', async () => {
    const createPlyr = await importCreatePlyr();

    createPlyr(document.createElement('div'), {}).catch(() => {});

    expect(countOf(SCRIPT_SELECTOR)).toBe(1);
  });

  it('should remove the script element when loading fails', async () => {
    const createPlyr = await importCreatePlyr();

    await attemptAndFail(createPlyr);

    expect(countOf(SCRIPT_SELECTOR)).toBe(0);
  });

  it('should not accumulate script elements across retries', async () => {
    const createPlyr = await importCreatePlyr();

    for (const _ of Array.from({ length: 3 })) {
      await attemptAndFail(createPlyr);
    }

    expect(countOf(SCRIPT_SELECTOR)).toBe(0);
  });

  it('should remove the stylesheet when it fails so a retry can re-add it', async () => {
    const createPlyr = await importCreatePlyr();

    createPlyr(document.createElement('div'), {}).catch(() => {});
    expect(countOf(STYLESHEET_SELECTOR)).toBe(1);

    failPendingElement(STYLESHEET_SELECTOR);
    expect(countOf(STYLESHEET_SELECTOR)).toBe(0);

    createPlyr(document.createElement('div'), {}).catch(() => {});
    expect(countOf(STYLESHEET_SELECTOR)).toBe(1);
  });
});
