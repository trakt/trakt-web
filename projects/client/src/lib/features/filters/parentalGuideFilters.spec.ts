import { getGlobalFilterDependencies } from '$lib/requests/_internal/getGlobalFilterDependencies.ts';
import { getAppliedFilters } from './_internal/getAppliedFilters.ts';
import { processFilterParams } from './_internal/processFilterParams.ts';
import { parentalGuideFilters } from './parentalGuideFilters.ts';
import { describe, expect, it } from 'vitest';

const keys = [
  'parental_nudity',
  'parental_violence',
  'parental_profanity',
  'parental_alcohol',
  'parental_frightening',
];

describe('parentalGuideFilters', () => {
  it('should expose all five categories only in advanced filters with ordered severity labels', () => {
    expect(parentalGuideFilters.map((filter) => filter.key)).toEqual(keys);
    parentalGuideFilters.forEach((filter) => {
      expect(filter.advancedOnly).toBe(true);
      expect(filter.range).toEqual({ min: 0, max: 3 });
      expect([0, 1, 2, 3].map((value) => filter.ticks?.formatter(value)))
        .toEqual(['None', 'Mild', 'Moderate', 'Severe']);
      expect(filter.formatLabel({ min: 0, max: 0 })).toContain('None to None');
    });
  });

  it('should preserve none-only ranges when applying and saving filters', () => {
    const params = new URLSearchParams(keys.map((key) => [key, '0-0']));
    const saved: Record<string, unknown> = {};

    processFilterParams(params.entries(), (key, value) => {
      saved[key] = value;
    });

    expect(saved).toEqual(Object.fromEntries(params));
    expect(getAppliedFilters(params).map((filter) => filter.key)).toEqual(keys);
  });

  it.each(keys)('should invalidate queries when %s changes', (key) => {
    expect(getGlobalFilterDependencies({ [key]: '0-0' }))
      .not.toEqual(getGlobalFilterDependencies({ [key]: '0-1' }));
  });
});
