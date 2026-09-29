import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { warmImages } from './warmImages.ts';

describe('util: warmImages', () => {
  const sources: string[] = [];

  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal('requestIdleCallback', undefined);
    vi.stubGlobal(
      'Image',
      class {
        decoding = '';
        onload: (() => void) | null = null;
        onerror: (() => void) | null = null;
        set src(value: string) {
          sources.push(value);
          queueMicrotask(() => this.onload?.());
        }
      },
    );
  });

  afterEach(() => {
    sources.length = 0;
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it('should load images in batches once idle', async () => {
    warmImages(['a', 'b', 'c', 'd', 'e']);

    expect(sources).toEqual([]);
    await vi.advanceTimersByTimeAsync(200);
    expect(sources).toEqual(['a', 'b', 'c', 'd']);
    await vi.advanceTimersByTimeAsync(200);
    expect(sources).toEqual(['a', 'b', 'c', 'd', 'e']);
  });

  it('should not load anything when cancelled before idle', async () => {
    const cancel = warmImages(['a', 'b']);

    cancel();
    await vi.advanceTimersByTimeAsync(1000);

    expect(sources).toEqual([]);
  });

  it('should stop after the current batch when cancelled', async () => {
    const cancel = warmImages(['a', 'b', 'c', 'd', 'e']);

    await vi.advanceTimersByTimeAsync(200);
    cancel();
    await vi.advanceTimersByTimeAsync(1000);

    expect(sources).toEqual(['a', 'b', 'c', 'd']);
  });
});
