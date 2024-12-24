import { describe, expect, it } from 'vitest';
import { toTranslatedValue } from './toTranslatedValue.ts';

describe('toTranslatedValue', () => {
  it('should return the value if there is no translation for it', () => {
    expect(toTranslatedValue('test', 'Not Translated')).toBe('Not Translated');
  });

  it('should translate an existing value', () => {
    const translatedValue = toTranslatedValue('test', 'Translated Value');
    expect(translatedValue).toBe('My Translated Value');
  });
});
