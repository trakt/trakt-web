import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { pauseScrollSnap } from '$lib/utils/scroll/pauseScrollSnap.ts';
import { resetScroll } from './resetScroll.ts';

function flushMutations() {
  return new Promise<void>((resolve) => queueMicrotask(resolve));
}

function nextFrame() {
  return new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
}

describe('action: resetScroll', () => {
  let node: HTMLElement;

  beforeEach(() => {
    node = document.createElement('div');
    document.body.appendChild(node);
  });

  afterEach(() => {
    node.remove();
  });

  describe('with a key', () => {
    it('should pause snapping while the children change', async () => {
      resetScroll(node, 'a');

      node.appendChild(document.createElement('span'));
      await flushMutations();

      expect(node.style.scrollSnapType).toBe('none');
    });

    it('should resume snapping once the change has been laid out', async () => {
      resetScroll(node, 'a');

      node.appendChild(document.createElement('span'));
      await flushMutations();
      await nextFrame();
      await nextFrame();

      expect(node.style.scrollSnapType).toBe('');
    });

    it('should keep snapping paused while another holder is still active', async () => {
      resetScroll(node, 'a');
      const release = pauseScrollSnap(node);

      node.appendChild(document.createElement('span'));
      await flushMutations();
      await nextFrame();
      await nextFrame();

      expect(node.style.scrollSnapType).toBe('none');
      release();
      expect(node.style.scrollSnapType).toBe('');
    });

    it('should keep snapping paused when another holder arrives during the change', async () => {
      resetScroll(node, 'a');

      node.appendChild(document.createElement('span'));
      await flushMutations();
      const release = pauseScrollSnap(node);
      await nextFrame();
      await nextFrame();

      expect(node.style.scrollSnapType).toBe('none');
      release();
      expect(node.style.scrollSnapType).toBe('');
    });

    it('should resume snapping when the other holder released during the change', async () => {
      resetScroll(node, 'a');
      const release = pauseScrollSnap(node);

      node.appendChild(document.createElement('span'));
      await flushMutations();
      release();
      node.appendChild(document.createElement('span'));
      await flushMutations();
      await nextFrame();
      await nextFrame();

      expect(node.style.scrollSnapType).toBe('');
    });

    it('should keep snapping paused across back-to-back changes', async () => {
      resetScroll(node, 'a');

      node.appendChild(document.createElement('span'));
      await flushMutations();
      await nextFrame();
      node.appendChild(document.createElement('span'));
      await flushMutations();
      await nextFrame();

      expect(node.style.scrollSnapType).toBe('none');
    });

    it('should not reset the scroll offset when the children change', async () => {
      resetScroll(node, 'a');
      node.scrollLeft = 120;

      node.appendChild(document.createElement('span'));
      await flushMutations();
      await nextFrame();

      expect(node.scrollLeft).toBe(120);
    });

    it('should reset the scroll offset when the key changes', async () => {
      const action = resetScroll(node, 'a');
      node.scrollLeft = 120;

      action.update?.('b');
      await vi.waitFor(() => expect(node.scrollLeft).toBe(0));
    });

    it('should stop watching on destroy', async () => {
      const action = resetScroll(node, 'a');
      action.destroy?.();

      node.appendChild(document.createElement('span'));
      await flushMutations();

      expect(node.style.scrollSnapType).toBe('');
    });
  });

  describe('without a key', () => {
    it('should reset the scroll offset when the children change', async () => {
      resetScroll(node);
      node.scrollLeft = 120;

      node.appendChild(document.createElement('span'));
      await vi.waitFor(() => expect(node.scrollLeft).toBe(0));
    });
  });
});
