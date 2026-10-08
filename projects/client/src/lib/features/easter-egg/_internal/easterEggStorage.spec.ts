import { beforeEach, describe, expect, it } from 'vitest';
import { easterEggStorage } from './easterEggStorage.ts';

describe('easterEggStorage', () => {
  beforeEach(() => localStorage.clear());

  it('should read empty progress when nothing is stored', () => {
    expect(easterEggStorage.read()).toEqual({});
  });

  it('should keep other games when writing one', () => {
    localStorage.setItem('trakt-easter-eggs', JSON.stringify({ other: 3 }));

    easterEggStorage.write({ rated_higher_streak: 12 });

    expect(easterEggStorage.read()).toEqual({
      other: 3,
      rated_higher_streak: 12,
    });
  });

  it('should ignore invalid stored data', () => {
    localStorage.setItem('trakt-easter-eggs', 'not json');

    expect(easterEggStorage.read()).toEqual({});
  });

  it('should ignore an invalid streak', () => {
    localStorage.setItem(
      'trakt-easter-eggs',
      JSON.stringify({ rated_higher_streak: 'twelve' }),
    );

    expect(easterEggStorage.read()).toEqual({});
  });
});
