import { describe, expect, it } from 'vitest';
import { CookieCategory } from '../models/CookieCategory.ts';
import { mapToCategories } from './mapToCategories.ts';

describe('mapToCategories', () => {
  it('should return all categories when consent is "all"', () => {
    const result = mapToCategories('all');

    expect(result).toEqual([
      CookieCategory.Necessary,
      CookieCategory.Functionality,
      CookieCategory.Analytics,
    ]);
  });

  it('should return necessary and functionality when consent is "functional"', () => {
    const result = mapToCategories('functional');

    expect(result).toEqual([
      CookieCategory.Necessary,
      CookieCategory.Functionality,
    ]);
  });

  it('should return empty array when consent is "none"', () => {
    const result = mapToCategories('none');

    expect(result).toEqual([]);
  });
});
