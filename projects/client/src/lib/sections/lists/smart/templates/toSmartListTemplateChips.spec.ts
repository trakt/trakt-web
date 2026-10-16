import { describe, expect, it } from 'vitest';
import { toSmartListTemplateChips } from './toSmartListTemplateChips.ts';

describe('util: toSmartListTemplateChips', () => {
  it('should move the showcase chip to the front', () => {
    const chips = toSmartListTemplateChips({
      source: 'discover',
      filters: { ratings: [78], votes: [300, 3000], metascores: [65] },
      showcase: 'votes',
    });

    expect(chips).toEqual([
      '300 to 3,000 Trakt votes',
      'Trakt 78% and up',
      'Metascore 65 and up',
    ]);
  });

  it('should not include the source label', () => {
    const chips = toSmartListTemplateChips({
      source: 'trending',
      filters: { ignore_watched: true },
      showcase: 'ignore_watched',
    });

    expect(chips).toEqual(['Hide Watched']);
  });

  it('should keep the order when the showcase filter is absent', () => {
    const chips = toSmartListTemplateChips({
      source: 'discover',
      filters: { ignore_watched: true, ignore_watchlisted: true },
      showcase: 'votes',
    });

    expect(chips).toEqual(['Hide Watched', 'Hide Watchlisted']);
  });

  it('should lead with the first label of a multi value filter', () => {
    const chips = toSmartListTemplateChips({
      source: 'discover',
      filters: { ratings: [75], genres: ['crime', 'mystery'] },
      showcase: 'genres',
    });

    expect(chips).toEqual(['Crime', 'Trakt 75% and up', 'Mystery']);
  });
});
