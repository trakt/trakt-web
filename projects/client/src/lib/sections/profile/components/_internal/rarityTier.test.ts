import { describe, expect, it } from 'vitest';
import { rarityTier } from './rarityTier.ts';

describe('rarityTier', () => {
  it('returns "unknown" when rarity is undefined', () => {
    expect(rarityTier(undefined)).toBe('unknown');
  });

  it('returns "common" below the notable threshold', () => {
    expect(rarityTier(0)).toBe('common');
    expect(rarityTier(0.1)).toBe('common');
    expect(rarityTier(0.3299)).toBe('common');
  });

  it('returns "notable" between the notable and rare thresholds', () => {
    expect(rarityTier(0.33)).toBe('notable');
    expect(rarityTier(0.5)).toBe('notable');
    expect(rarityTier(0.6599)).toBe('notable');
  });

  it('returns "rare" at or above the rare threshold', () => {
    expect(rarityTier(0.66)).toBe('rare');
    expect(rarityTier(0.85)).toBe('rare');
    expect(rarityTier(1)).toBe('rare');
  });
});
