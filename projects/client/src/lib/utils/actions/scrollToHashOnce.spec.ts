import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { scrollToHashOnce } from './scrollToHashOnce.ts';

function nextFrame() {
  return new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
}

describe('action: scrollToHashOnce', () => {
  let node: HTMLElement;
  let scrollIntoView: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    node = document.createElement('div');
    node.id = 'target';
    scrollIntoView = vi.fn();
    node.scrollIntoView =
      scrollIntoView as unknown as typeof node.scrollIntoView;
    globalThis.location.hash = '#target';
  });

  afterEach(() => {
    globalThis.location.hash = '';
  });

  it('should scroll once the page is ready', async () => {
    const action = scrollToHashOnce(node, { ready: false });
    await nextFrame();
    expect(scrollIntoView).not.toHaveBeenCalled();

    action.update({ ready: true });
    await nextFrame();
    expect(scrollIntoView).toHaveBeenCalledTimes(1);
  });

  it('should not scroll again when readiness flips back and forth', async () => {
    const action = scrollToHashOnce(node, { ready: true });
    await nextFrame();

    action.update({ ready: false });
    action.update({ ready: true });
    await nextFrame();

    expect(scrollIntoView).toHaveBeenCalledTimes(1);
  });

  it('should leave scroll alone when the hash points elsewhere', async () => {
    globalThis.location.hash = '#other';
    scrollToHashOnce(node, { ready: true });
    await nextFrame();

    expect(scrollIntoView).not.toHaveBeenCalled();
  });

  it('should not scroll a node that was destroyed before the frame', async () => {
    const action = scrollToHashOnce(node, { ready: true });
    action.destroy();
    await nextFrame();

    expect(scrollIntoView).not.toHaveBeenCalled();
  });
});
