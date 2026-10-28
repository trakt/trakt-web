import { afterEach, describe, expect, it, vi } from 'vitest';
import { riseFade } from './riseFade.ts';

function mockReducedMotion(matches: boolean) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => ({ matches, media: query })),
  );
}

describe('util: riseFade', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  const node = {} as Element;

  describe('by default', () => {
    it('should be fully transparent and offset at the start', () => {
      mockReducedMotion(false);

      const css = riseFade(node, { distance: 6 }).css(0);

      expect(css).toContain('opacity: 0');
      expect(css).toContain('translateY(6px)');
    });

    it('should be opaque and settled at the end', () => {
      mockReducedMotion(false);

      const css = riseFade(node, { distance: 6 }).css(1);

      expect(css).toContain('opacity: 1');
      expect(css).toContain('translateY(0px)');
    });

    it('should pass the delay through so callers can stagger', () => {
      mockReducedMotion(false);

      expect(riseFade(node, { delay: 70 }).delay).toBe(70);
    });
  });

  describe('when reduced motion is preferred', () => {
    it('should drop the travel entirely', () => {
      mockReducedMotion(true);

      const css = riseFade(node, { distance: 20 }).css(0);

      expect(css).toContain('translateY(0px)');
    });

    it('should still fade rather than skipping the transition', () => {
      mockReducedMotion(true);

      const transition = riseFade(node);

      expect(transition.duration).toBeGreaterThan(0);
      expect(transition.css(0)).toContain('opacity: 0');
      expect(transition.css(1)).toContain('opacity: 1');
    });

    it('should shorten the fade', () => {
      mockReducedMotion(true);

      expect(riseFade(node, { duration: 400 }).duration).toBeLessThan(400);
    });
  });

  describe('without matchMedia', () => {
    it('should assume motion is fine rather than throwing', () => {
      vi.stubGlobal('matchMedia', undefined);

      expect(() => riseFade(node)).not.toThrow();
      expect(riseFade(node, { distance: 6 }).css(0)).toContain(
        'translateY(6px)',
      );
    });
  });
});
