import { describe, expect, it } from 'vitest';
import { filterSpotlightRoutes } from './filterSpotlightRoutes.ts';
import type { SpotlightRoute } from './models/SpotlightRoute.ts';

const routes: ReadonlyArray<SpotlightRoute> = [
  { id: 'movies', url: '/movies', label: () => 'Movies', keywords: ['films'] },
  { id: 'shows', url: '/shows', label: () => 'Shows', keywords: ['tv'] },
  {
    id: 'settings',
    url: '/settings',
    label: () => 'Settings',
    keywords: ['preferences'],
  },
];

describe('util: filterSpotlightRoutes', () => {
  it('should return nothing for an empty query', () => {
    expect(filterSpotlightRoutes(routes, '')).toEqual([]);
    expect(filterSpotlightRoutes(routes, '   ')).toEqual([]);
  });

  it('should match on the translated label', () => {
    const result = filterSpotlightRoutes(routes, 'mov');
    expect(result.map((r) => r.id)).toEqual(['movies']);
  });

  it('should match on keyword aliases', () => {
    const result = filterSpotlightRoutes(routes, 'films');
    expect(result.map((r) => r.id)).toEqual(['movies']);
  });

  it('should be case insensitive', () => {
    const result = filterSpotlightRoutes(routes, 'SETTINGS');
    expect(result.map((r) => r.id)).toEqual(['settings']);
  });

  it('should match on translated keywords', () => {
    const translated: ReadonlyArray<SpotlightRoute> = [
      {
        id: 'history',
        url: '/history',
        label: () => 'Geschiedenis',
        keywords: ['history', () => 'Onlangs bekeken'],
      },
    ];

    const result = filterSpotlightRoutes(translated, 'onlangs');
    expect(result.map((r) => r.id)).toEqual(['history']);
  });

  it('should resolve labels and keywords on every call', () => {
    let locale = 'en';

    const translated: ReadonlyArray<SpotlightRoute> = [
      {
        id: 'movies',
        url: '/movies',
        label: () => locale === 'en' ? 'Movies' : 'Films',
        keywords: [() => locale === 'en' ? 'cinema' : 'bioscoop'],
      },
    ];

    expect(filterSpotlightRoutes(translated, 'films').map((r) => r.id))
      .toEqual([]);

    locale = 'nl';

    expect(filterSpotlightRoutes(translated, 'films').map((r) => r.id))
      .toEqual(['movies']);
    expect(filterSpotlightRoutes(translated, 'bioscoop').map((r) => r.id))
      .toEqual(['movies']);
  });

  it('should rank label prefix matches ahead of keyword matches', () => {
    const withOverlap: ReadonlyArray<SpotlightRoute> = [
      { id: 'a', url: '/a', label: () => 'Alpha', keywords: ['show'] },
      { id: 'shows', url: '/shows', label: () => 'Shows', keywords: ['tv'] },
    ];

    const result = filterSpotlightRoutes(withOverlap, 'show');
    expect(result.map((r) => r.id)).toEqual(['shows', 'a']);
  });
});
