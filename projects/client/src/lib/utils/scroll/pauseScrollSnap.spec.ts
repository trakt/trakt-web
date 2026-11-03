import { describe, expect, it } from 'vitest';
import { pauseScrollSnap } from './pauseScrollSnap.ts';

describe('util: pauseScrollSnap', () => {
  it('should pause snapping while held', () => {
    const node = document.createElement('div');

    const release = pauseScrollSnap(node);

    expect(node.style.scrollSnapType).toBe('none');
    release();
    expect(node.style.scrollSnapType).toBe('');
  });

  it('should keep snapping paused until the last holder releases', () => {
    const node = document.createElement('div');

    const releaseFirst = pauseScrollSnap(node);
    const releaseSecond = pauseScrollSnap(node);

    releaseFirst();
    expect(node.style.scrollSnapType).toBe('none');
    releaseSecond();
    expect(node.style.scrollSnapType).toBe('');
  });

  it('should ignore a repeated release', () => {
    const node = document.createElement('div');

    const releaseFirst = pauseScrollSnap(node);
    const releaseSecond = pauseScrollSnap(node);

    releaseFirst();
    releaseFirst();
    expect(node.style.scrollSnapType).toBe('none');
    releaseSecond();
    expect(node.style.scrollSnapType).toBe('');
  });

  it('should track each node on its own', () => {
    const first = document.createElement('div');
    const second = document.createElement('div');

    const release = pauseScrollSnap(first);
    pauseScrollSnap(second);
    release();

    expect(first.style.scrollSnapType).toBe('');
    expect(second.style.scrollSnapType).toBe('none');
  });
});
