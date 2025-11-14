import { describe, expect, it } from 'vitest';
import { CookieCategory } from '../models/CookieCategory.ts';
import { mapToConsent } from './mapToConsent.ts';

describe('mapToConsent', () => {
  it('should return "all" when all categories are present', () => {
    const categories = [
      CookieCategory.Necessary,
      CookieCategory.Functionality,
      CookieCategory.Analytics,
    ];

    const result = mapToConsent(categories);

    expect(result).toBe('all');
  });

  it('should return "functional" when only necessary and functionality are present', () => {
    const categories = [CookieCategory.Necessary, CookieCategory.Functionality];

    const result = mapToConsent(categories);

    expect(result).toBe('functional');
  });

  it('should return "none" when only necessary is present', () => {
    const categories = [CookieCategory.Necessary];

    const result = mapToConsent(categories);

    expect(result).toBe('none');
  });

  it('should return "none" when categories array is empty', () => {
    const categories: string[] = [];

    const result = mapToConsent(categories);

    expect(result).toBe('none');
  });

  it('should return "none" when only analytics is present', () => {
    const categories = [CookieCategory.Analytics];

    const result = mapToConsent(categories);

    expect(result).toBe('none');
  });

  it('should return "none" when only functionality is present', () => {
    const categories = [CookieCategory.Functionality];

    const result = mapToConsent(categories);

    expect(result).toBe('none');
  });

  it('should return "none" when necessary and analytics are present without functionality', () => {
    const categories = [CookieCategory.Necessary, CookieCategory.Analytics];

    const result = mapToConsent(categories);

    expect(result).toBe('none');
  });
});
