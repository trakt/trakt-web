import { describe, expect, it } from 'vitest';
import { toVipUpsellSource } from './toVipUpsellSource.ts';

describe('util: toVipUpsellSource', () => {
  it('should keep a known source', () => {
    expect(toVipUpsellSource('navbar-mobile')).toBe('navbar-mobile');
  });

  it('should keep the Reality Check source', () => {
    expect(toVipUpsellSource('reality-check')).toBe('reality-check');
  });

  it('should keep the season recap source', () => {
    expect(toVipUpsellSource('season-recap')).toBe('season-recap');
  });

  it('should keep a promotion source', () => {
    expect(toVipUpsellSource('promotion-black-friday')).toBe(
      'promotion-black-friday',
    );
  });

  it.each([
    ['an unknown source', 'made-up'],
    ['a malformed promotion source', 'promotion-<script>'],
    ['an empty string', ''],
    ['null', null],
    ['undefined', undefined],
  ])('should fall back to direct for %s', (_, raw) => {
    expect(toVipUpsellSource(raw)).toBe('direct');
  });
});
