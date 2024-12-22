import { describe, expect, it } from 'vitest';
import { toLanguageName } from './toLanguageName.ts';

describe('toLanguageName', () => {
  it('will display romeno', () => {
    const displayName = toLanguageName('ro', 'pt');

    expect(displayName).toBe('romeno');
  });

  it('will display Dutch', () => {
    const displayName = toLanguageName('nl', 'fr');

    expect(displayName).toBe('néerlandais');
  });

  it('will display English', () => {
    const displayName = toLanguageName('en', 'en');

    expect(displayName).toBe('English');
  });
});
