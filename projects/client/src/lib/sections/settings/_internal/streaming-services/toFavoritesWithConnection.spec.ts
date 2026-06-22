import { describe, expect, it } from 'vitest';
import { toFavoritesWithConnection } from './toFavoritesWithConnection.ts';

describe('util: toFavoritesWithConnection', () => {
  it('should add the mapped watch-now slug as a country-prefixed favorite', () => {
    const result = toFavoritesWithConnection({
      serviceId: 'disneyplus',
      country: 'us',
      favorites: ['us-netflix'],
    });

    expect(result).to.deep.equal(['us-netflix', 'us-disney_plus']);
  });

  it('should map younify ids that diverge from the watch-now slug', () => {
    const result = toFavoritesWithConnection({
      serviceId: 'vudu',
      country: 'us',
      favorites: [],
    });

    expect(result).to.deep.equal(['us-fandango']);
  });

  it('should drop favorites from other countries', () => {
    const result = toFavoritesWithConnection({
      serviceId: 'disneyplus',
      country: 'us',
      favorites: ['nl-max', 'us-netflix'],
    });

    expect(result).to.deep.equal(['us-netflix', 'us-disney_plus']);
  });

  it('should return null when the service is already a favorite', () => {
    const result = toFavoritesWithConnection({
      serviceId: 'paramountplus',
      country: 'us',
      favorites: ['us-paramount_plus'],
    });

    expect(result).to.equal(null);
  });
});
