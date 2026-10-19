import { describe, expect, it } from 'vitest';
import { toVipUpsellSource } from './toVipUpsellSource.ts';
import { toPromotionUpsellSource } from './toPromotionUpsellSource.ts';

describe('util: toPromotionUpsellSource', () => {
  it.each(['black-friday', 'yir-2025'])(
    'should build a source that survives validation for %s',
    (id) => {
      const source = toPromotionUpsellSource({ id });

      expect(source).toBe(`promotion-${id}`);
      expect(toVipUpsellSource(source)).toBe(source);
    },
  );
});
