import type { CreditGroup } from '$lib/sections/summary/models/CreditGroup.ts';
import { describe, expect, it } from 'vitest';
import { toActiveCreditsType } from './toActiveCreditsType.ts';

const toGroup = (type: CreditGroup['type']): CreditGroup => ({
  id: type,
  type,
  label: type,
  members: [],
});

describe('util: toActiveCreditsType', () => {
  it('should keep the selected type when its group exists', () => {
    expect(
      toActiveCreditsType({
        groups: [toGroup('main'), toGroup('supporting'), toGroup('crew')],
        creditsType: 'supporting',
      }),
    ).toBe('supporting');
  });

  it('should fall back to the first group when the selected one is missing', () => {
    expect(
      toActiveCreditsType({
        groups: [toGroup('main'), toGroup('crew')],
        creditsType: 'supporting',
      }),
    ).toBe('main');
  });

  it('should fall back to main when there are no groups', () => {
    expect(toActiveCreditsType({ groups: [], creditsType: 'crew' })).toBe(
      'main',
    );
  });
});
