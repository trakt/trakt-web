import { describe, expect, it } from 'vitest';
import { toHumanPlanTerm } from './toHumanPlanTerm.ts';

describe('util: toHumanPlanTerm', () => {
  it('should express whole years as years', () => {
    expect(toHumanPlanTerm({ months: 24, locale: 'en' })).toBe('2 years');
  });

  it('should express other lengths as months', () => {
    expect(toHumanPlanTerm({ months: 18, locale: 'en' })).toBe('18 months');
  });
});
