import { describe, expect, it } from 'vitest';
import { matchesOptionSearch } from './matchesOptionSearch.ts';

const option = {
  label: 'Best Picture',
  value: 'oscars-best-picture',
  keywords: ['Academy Awards', 'oscars'],
};

describe('util: matchesOptionSearch', () => {
  it('should match the label', () => {
    expect(matchesOptionSearch({ option, search: 'picture' })).toBe(true);
  });

  it('should match a keyword', () => {
    expect(matchesOptionSearch({ option, search: 'oscar' })).toBe(true);
    expect(matchesOptionSearch({ option, search: 'academy' })).toBe(true);
  });

  it('should not match the value', () => {
    expect(
      matchesOptionSearch({
        option: { label: 'German', value: 'de' },
        search: 'de',
      }),
    ).toBe(false);
  });

  it('should not match unrelated text', () => {
    expect(matchesOptionSearch({ option, search: 'emmy' })).toBe(false);
  });
});
