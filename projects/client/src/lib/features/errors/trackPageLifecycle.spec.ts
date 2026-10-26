import { describe, expect, it } from 'vitest';
import { trackPageLifecycle } from './trackPageLifecycle.ts';

describe('trackPageLifecycle', () => {
  it('should describe a page that is still open', () => {
    const readLifecycle = trackPageLifecycle(window);

    expect(readLifecycle()).toMatchObject({
      isUnloading: false,
      visibility: document.visibilityState,
      readyState: document.readyState,
      isOnline: navigator.onLine,
    });
  });

  it('should flag a page that is being left', () => {
    const readLifecycle = trackPageLifecycle(window);

    window.dispatchEvent(new Event('pagehide'));

    expect(readLifecycle().isUnloading).toBe(true);
  });

  it('should clear the flag when the page is restored', () => {
    const readLifecycle = trackPageLifecycle(window);

    window.dispatchEvent(new Event('pagehide'));
    window.dispatchEvent(new Event('pageshow'));

    expect(readLifecycle().isUnloading).toBe(false);
  });
});
