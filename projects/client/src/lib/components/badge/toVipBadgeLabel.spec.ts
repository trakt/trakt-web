import { describe, expect, it } from 'vitest';
import { toVipBadgeLabel } from './toVipBadgeLabel.ts';

describe('util: toVipBadgeLabel', () => {
  it('should label directors as such, whatever the tier label', () => {
    expect(toVipBadgeLabel({ isDirector: true, label: 'Legend' })).toBe(
      'DIRECTOR',
    );
  });

  it('should use the tier label when there is one', () => {
    expect(toVipBadgeLabel({ label: 'Legend' })).toBe('Legend');
  });

  it('should fall back to VIP', () => {
    expect(toVipBadgeLabel({})).toBe('VIP');
  });
});
