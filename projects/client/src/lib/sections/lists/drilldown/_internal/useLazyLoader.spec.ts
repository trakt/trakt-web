import { renderStore } from '$test/beds/store/renderStore.ts';
import { cleanup } from '@testing-library/svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useLazyLoader } from './useLazyLoader.ts';

describe('useLazyLoader', () => {
  const nextFrame = () =>
    new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

  function createParent(scrollTop: number) {
    const parent = document.createElement('div');
    vi.spyOn(parent, 'scrollHeight', 'get').mockReturnValue(1000);
    vi.spyOn(parent, 'clientHeight', 'get').mockReturnValue(500);
    parent.scrollTop = scrollTop;
    return parent;
  }

  afterEach(() => {
    cleanup();
  });

  it('should load more once per frame for a burst of scroll events', async () => {
    const loadMore = vi.fn();
    const parent = createParent(400);
    await renderStore(() => useLazyLoader({ loadMore, parent }));

    parent.dispatchEvent(new Event('scroll'));
    parent.dispatchEvent(new Event('scroll'));
    parent.dispatchEvent(new Event('scroll'));
    expect(loadMore).not.toHaveBeenCalled();

    await nextFrame();

    expect(loadMore).toHaveBeenCalledTimes(1);
  });

  it('should not load more when scrolled less than halfway', async () => {
    const loadMore = vi.fn();
    const parent = createParent(100);
    await renderStore(() => useLazyLoader({ loadMore, parent }));

    parent.dispatchEvent(new Event('scroll'));
    await nextFrame();

    expect(loadMore).not.toHaveBeenCalled();
  });

  it('should drop a pending frame when torn down', async () => {
    const loadMore = vi.fn();
    const parent = createParent(400);
    await renderStore(() => useLazyLoader({ loadMore, parent }));

    parent.dispatchEvent(new Event('scroll'));
    cleanup();
    await nextFrame();

    expect(loadMore).not.toHaveBeenCalled();
  });
});
