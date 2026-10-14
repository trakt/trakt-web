import type { StreamingConnection } from '$lib/requests/models/StreamingConnection.ts';
import { UserNetworkMappedMock } from '$mocks/data/users/mapped/UserNetworkMappedMock.ts';
import { describe, expect, it } from 'vitest';
import { toNextStepSignals } from './toNextStepSignals.ts';

function connection(
  id: string,
  isConnected: boolean,
): StreamingConnection {
  return {
    id,
    key: `streaming-connection-${id}`,
    name: id,
    isConnectable: true,
    isConnected,
    isActive: isConnected,
  };
}

const rated = (id: number) => ({
  id,
  rating: 8,
  ratedAt: new Date('2026-01-01'),
});

const LOADED = {
  user: {
    genres: { loved: [] },
    services: { country: 'us', favorites: ['us-netflix', 'us-hulu'] },
  },
  watchlist: { movies: new Set([1, 2]), shows: new Set([3]) },
  ratings: {
    movies: new Map([[1, rated(1)]]),
    shows: new Map(),
    seasons: new Map(),
    episodes: new Map([[9, rated(9)]]),
  },
  network: UserNetworkMappedMock,
  connections: [connection('netflix', true), connection('hbomax', false)],
  watchedCount: 1,
  listsCount: 0,
  commentsCount: 1,
};

describe('util: toNextStepSignals', () => {
  it('should collapse every source into counts', () => {
    expect(toNextStepSignals(LOADED)).toEqual({
      watchedCount: 1,
      watchlistCount: 3,
      ratingsCount: 2,
      lovedGenresCount: 0,
      favoriteServicesCount: 2,
      streamingConnectionsCount: 1,
      followingCount: UserNetworkMappedMock.following.length,
      listsCount: 0,
      commentsCount: 1,
    });
  });

  it('should not count services from the catalog that are not connected', () => {
    const signals = toNextStepSignals({
      ...LOADED,
      connections: [connection('netflix', false), connection('hbomax', false)],
    });

    expect(signals?.streamingConnectionsCount).toBe(0);
  });

  it('should only count favorite services for the current country', () => {
    const signals = toNextStepSignals({
      ...LOADED,
      user: {
        ...LOADED.user,
        services: { country: 'fr', favorites: ['us-netflix', 'fr-canal'] },
      },
    });

    expect(signals?.favoriteServicesCount).toBe(1);
  });

  it('should count legacy favorites stored without a country', () => {
    const signals = toNextStepSignals({
      ...LOADED,
      user: {
        ...LOADED.user,
        services: { country: 'us', favorites: ['netflix', 'max'] },
      },
    });

    expect(signals?.favoriteServicesCount).toBe(2);
  });

  it('should count every favorite when no country is set', () => {
    const signals = toNextStepSignals({
      ...LOADED,
      user: { ...LOADED.user, services: { favorites: ['us-netflix'] } },
    });

    expect(signals?.favoriteServicesCount).toBe(1);
  });

  it('should wait until every source has settled', () => {
    expect(toNextStepSignals({ ...LOADED, user: undefined })).toBeNull();
    expect(toNextStepSignals({ ...LOADED, watchlist: undefined })).toBeNull();
    expect(toNextStepSignals({ ...LOADED, ratings: undefined })).toBeNull();
    expect(toNextStepSignals({ ...LOADED, network: undefined })).toBeNull();
    expect(toNextStepSignals({ ...LOADED, connections: null })).toBeNull();
    expect(toNextStepSignals({ ...LOADED, watchedCount: null })).toBeNull();
    expect(toNextStepSignals({ ...LOADED, listsCount: null })).toBeNull();
    expect(toNextStepSignals({ ...LOADED, commentsCount: null })).toBeNull();
  });
});
