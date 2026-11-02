import { describe, expect, it } from 'vitest';
import { toVipBadgeLabel } from './toVipBadgeLabel.ts';

describe('util: toVipBadgeLabel', () => {
  it('should label directors as such', () => {
    expect(toVipBadgeLabel({ isDirector: true })).toBe('DIRECTOR');
  });

  it('should fall back to VIP', () => {
    expect(toVipBadgeLabel({})).toBe('VIP');
  });
});
