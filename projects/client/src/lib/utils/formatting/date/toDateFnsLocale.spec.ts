import { describe, expect, it } from 'vitest';
import { LOCALE_MAP } from './LOCALE_MAP.ts';
import { toDateFnsLocale } from './toDateFnsLocale.ts';

describe('util: toDateFnsLocale', () => {
  it('should return the date-fns locale for a known key', () => {
    expect(toDateFnsLocale('de-DE')).toBe(LOCALE_MAP['de-DE']);
  });

  it('should fall back to english for an unmapped key', () => {
    expect(toDateFnsLocale('xx' as 'en')).toBe(LOCALE_MAP['en']);
  });
});
