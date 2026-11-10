import { describe, expect, it } from 'vitest';
import { getSmartListFilterLabels } from './getSmartListFilterLabels.ts';

describe('getSmartListFilterLabels', () => {
  it('should label an open ended vote floor', () => {
    const [, label] = getSmartListFilterLabels({
      source: 'popular',
      filters: { imdb_votes: [5000, 999_999_999] },
    });

    expect(label).toBe('5,000+ IMDb votes');
  });

  it('should label a bounded vote range', () => {
    const [, label] = getSmartListFilterLabels({
      source: 'popular',
      filters: { votes: [100, 500] },
    });

    expect(label).toBe('100 to 500 Trakt votes');
  });

  it('should label a release window', () => {
    const [, label] = getSmartListFilterLabels({
      source: 'discover',
      filters: { released_within_days: 90 },
    });

    expect(label).toBe('Released in the last 90 days');
  });

  it('should label tmdb ratings', () => {
    const [, label] = getSmartListFilterLabels({
      source: 'discover',
      filters: { tmdb_ratings: [7, 10] },
    });

    expect(label).toBe('TMDB 7 to 10');
  });

  it('should label keywords, people and studios', () => {
    const [, ...labels] = getSmartListFilterLabels({
      source: 'discover',
      filters: {
        keywords: ['time-travel'],
        people: ['christopher-nolan'],
        studios: ['a24'],
      },
    });

    expect(labels).toEqual(['Time Travel', 'Christopher Nolan', 'A24']);
  });

  it('should label an open ended runtime with its unit', () => {
    const [, label] = getSmartListFilterLabels({
      source: 'discover',
      filters: { runtimes: [80] },
    });

    expect(label).toBe('80+ minutes');
  });

  it('should label a bounded runtime', () => {
    const [, label] = getSmartListFilterLabels({
      source: 'discover',
      filters: { runtimes: [60, 120] },
    });

    expect(label).toBe('Runtime of 60 to 120 minutes.');
  });

  it('should label a runtime that starts at zero as an upper bound', () => {
    const [, label] = getSmartListFilterLabels({
      source: 'discover',
      filters: { runtimes: [0, 95] },
    });

    expect(label).toBe('Up to 95 minutes');
  });

  it('should label countries by name', () => {
    const [, ...labels] = getSmartListFilterLabels({
      source: 'discover',
      filters: { countries: ['kr', 'us'] },
    });

    expect(labels).toEqual(['South Korea', 'United States']);
  });

  it('should label languages by name', () => {
    const [, ...labels] = getSmartListFilterLabels({
      source: 'discover',
      filters: { languages: ['ko', 'en'] },
    });

    expect(labels).toEqual(['Korean', 'English']);
  });

  it('should label an excluded genre', () => {
    const [, ...labels] = getSmartListFilterLabels({
      source: 'discover',
      filters: { genres: ['science-fiction', '-superhero'] },
    });

    expect(labels).toEqual(['Science Fiction', 'Not Superhero']);
  });

  it('should label an excluded country by name', () => {
    const [, label] = getSmartListFilterLabels({
      source: 'discover',
      filters: { countries: ['-kr'] },
    });

    expect(label).toBe('Not South Korea');
  });

  it('should label statuses and streaming options with the filter names', () => {
    const [, ...labels] = getSmartListFilterLabels({
      source: 'discover',
      filters: { statuses: ['ended'], watchnow: ['subscriptions'] },
    });

    expect(labels).toEqual(['Ended', 'Streaming now']);
  });

  it('should keep certifications as upper case codes', () => {
    const [, label] = getSmartListFilterLabels({
      source: 'discover',
      filters: { certifications: ['pg-13'] },
    });

    expect(label).toBe('PG-13');
  });

  it('should label the award filters', () => {
    const [, ...labels] = getSmartListFilterLabels({
      source: 'discover',
      filters: {
        awards: ['oscars-best-picture', 'baftas-best-film'],
        award_won: true,
        award_years: [2000, 2026],
      },
    });

    expect(labels).toEqual([
      'Oscars Best Picture',
      'Baftas Best Film',
      'Winners only',
      'Ceremony year: 2000 to 2026',
    ]);
  });

  it('should use the award names from the catalog', () => {
    const [, ...labels] = getSmartListFilterLabels(
      {
        source: 'discover',
        filters: { awards: ['oscars-best-picture', 'golden-bear'] },
      },
      new Map([
        [
          'oscars-best-picture',
          {
            ceremonySlug: 'oscars',
            ceremony: 'Academy Awards',
            name: 'Academy Award for Best Picture',
            shortName: 'Best Picture',
          },
        ],
      ]),
    );

    expect(labels).toEqual(['Academy Award for Best Picture', 'Golden Bear']);
  });
});
