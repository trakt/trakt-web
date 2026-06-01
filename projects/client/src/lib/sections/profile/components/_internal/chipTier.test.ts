import { describe, expect, it } from 'vitest';
import { chipTier } from './chipTier.ts';

describe('chipTier', () => {
  describe('positional fallback (no rarity supplied)', () => {
    it('crowns the top chip (index 0) as rare', () => {
      expect(chipTier(0, undefined)).toBe('rare');
    });

    it('marks the next two chips (index 1, 2) as notable', () => {
      expect(chipTier(1, undefined)).toBe('notable');
      expect(chipTier(2, undefined)).toBe('notable');
    });

    it('drops anything past index 2 to common', () => {
      expect(chipTier(3, undefined)).toBe('common');
      expect(chipTier(4, undefined)).toBe('common');
      expect(chipTier(10, undefined)).toBe('common');
    });

    it('handles negative indices defensively (clamps to rare)', () => {
      expect(chipTier(-1, undefined)).toBe('rare');
    });
  });

  describe('unicorn override (genuine cross-axis rarity)', () => {
    it('upgrades to unicorn when rarity clears the threshold', () => {
      expect(chipTier(5, 0.9)).toBe('unicorn');
      expect(chipTier(0, 1)).toBe('unicorn');
    });

    it('upgrades to unicorn exactly at the threshold', () => {
      expect(chipTier(5, 0.5)).toBe('unicorn');
    });

    it('falls back to positional below the threshold', () => {
      expect(chipTier(5, 0.49)).toBe('common');
      expect(chipTier(0, 0.4)).toBe('rare');
      expect(chipTier(1, 0.2)).toBe('notable');
    });

    it('non-top chip with high rarity still wins the unicorn upgrade', () => {
      // The classic case: server ranks a common-but-heavily-watched slug
      // at index 0, while a genuinely rare slug sits lower in the list.
      // The unicorn tier still flags the rare slug.
      expect(chipTier(4, 0.85)).toBe('unicorn');
    });
  });
});
