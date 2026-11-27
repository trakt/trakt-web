import { describe, expect, it } from 'vitest';
import { isLoreFilmGuarded } from './isLoreFilmGuarded.ts';

describe('util: isLoreFilmGuarded', () => {
  it('should guard an unwatched film when the account hides spoilers', () => {
    expect(
      isLoreFilmGuarded({
        isSpoilerHidden: true,
        isWatched: false,
        isRevealed: false,
      }),
    ).toBe(true);
  });

  it('should not guard anything when the account shows spoilers', () => {
    expect(
      isLoreFilmGuarded({
        isSpoilerHidden: false,
        isWatched: false,
        isRevealed: false,
      }),
    ).toBe(false);
  });

  it('should guard until the preference is known', () => {
    expect(
      isLoreFilmGuarded({
        isSpoilerHidden: undefined,
        isWatched: false,
        isRevealed: false,
      }),
    ).toBe(true);
  });

  it('should not guard a watched film', () => {
    expect(
      isLoreFilmGuarded({
        isSpoilerHidden: true,
        isWatched: true,
        isRevealed: false,
      }),
    ).toBe(false);
  });

  it('should not guard a film the viewer revealed', () => {
    expect(
      isLoreFilmGuarded({
        isSpoilerHidden: true,
        isWatched: false,
        isRevealed: true,
      }),
    ).toBe(false);
  });
});
