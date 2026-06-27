import { firstValueFrom } from 'rxjs';
import { describe, expect, it } from 'vitest';
import { useCarouselScroll } from './useCarouselScroll.ts';

type ScrollPosition = {
  scrollLeft: number;
  scrollWidth: number;
  clientWidth: number;
};

function listAt({ scrollLeft, scrollWidth, clientWidth }: ScrollPosition) {
  const node = globalThis.document.createElement('ul');
  Object.defineProperty(node, 'scrollWidth', { value: scrollWidth });
  Object.defineProperty(node, 'clientWidth', { value: clientWidth });
  node.scrollLeft = scrollLeft;
  return node;
}

describe('util: useCarouselScroll', () => {
  describe('affordances at the start', () => {
    it('should not allow scrolling further toward the start', async () => {
      const { canScrollToStart, scrollObserver } = useCarouselScroll();
      scrollObserver(
        listAt({ scrollLeft: 0, scrollWidth: 1000, clientWidth: 300 }),
      );

      expect(await firstValueFrom(canScrollToStart)).toBe(false);
    });

    it('should allow scrolling toward the end', async () => {
      const { canScrollToEnd, scrollObserver } = useCarouselScroll();
      scrollObserver(
        listAt({ scrollLeft: 0, scrollWidth: 1000, clientWidth: 300 }),
      );

      expect(await firstValueFrom(canScrollToEnd)).toBe(true);
    });
  });

  describe('when content fits without overflow', () => {
    it('should disable both affordances', async () => {
      const { canScrollToStart, canScrollToEnd, scrollObserver } =
        useCarouselScroll();
      scrollObserver(
        listAt({ scrollLeft: 0, scrollWidth: 300, clientWidth: 300 }),
      );

      expect(await firstValueFrom(canScrollToStart)).toBe(false);
      expect(await firstValueFrom(canScrollToEnd)).toBe(false);
    });
  });

  describe('mid-scroll in LTR (positive scrollLeft)', () => {
    it('should allow scrolling toward both edges', async () => {
      const { canScrollToStart, canScrollToEnd, scrollObserver } =
        useCarouselScroll();
      scrollObserver(
        listAt({ scrollLeft: 350, scrollWidth: 1000, clientWidth: 300 }),
      );

      expect(await firstValueFrom(canScrollToStart)).toBe(true);
      expect(await firstValueFrom(canScrollToEnd)).toBe(true);
    });
  });

  describe('mid-scroll in RTL (negative scrollLeft)', () => {
    it('should normalize the sign and allow scrolling toward both edges', async () => {
      const { canScrollToStart, canScrollToEnd, scrollObserver } =
        useCarouselScroll();
      scrollObserver(
        listAt({ scrollLeft: -350, scrollWidth: 1000, clientWidth: 300 }),
      );

      expect(await firstValueFrom(canScrollToStart)).toBe(true);
      expect(await firstValueFrom(canScrollToEnd)).toBe(true);
    });

    it('should not allow scrolling past the RTL end', async () => {
      const { canScrollToEnd, scrollObserver } = useCarouselScroll();
      scrollObserver(
        listAt({ scrollLeft: -700, scrollWidth: 1000, clientWidth: 300 }),
      );

      expect(await firstValueFrom(canScrollToEnd)).toBe(false);
    });
  });
});
