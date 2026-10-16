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

  it('should name the country and language of a template', () => {
    const chips = toSmartListTemplateChips({
      source: 'discover',
      filters: { countries: ['kr'], languages: ['ko'], ratings: [75] },
      showcase: 'countries',
    });

    expect(chips).toEqual(['South Korea', 'Korean', 'Trakt 75% and up']);
  });

  it('should word an excluded genre as not that genre', () => {
    const chips = toSmartListTemplateChips({
      source: 'discover',
      filters: { genres: ['science-fiction', '-superhero'], ratings: [75] },
      showcase: 'genres',
    });

    expect(chips).toEqual([
      'Science Fiction',
      'Not Superhero',
      'Trakt 75% and up',
    ]);
  });

  it('should word a runtime from zero as an upper bound', () => {
    const chips = toSmartListTemplateChips({
      source: 'discover',
      filters: { runtimes: [0, 95], ratings: [75] },
      showcase: 'runtimes',
    });

    expect(chips).toEqual(['Up to 95 minutes', 'Trakt 75% and up']);
  });
});
