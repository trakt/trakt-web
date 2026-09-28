import type { MovieEntry } from '$lib/requests/models/MovieEntry.ts';
import type { WatchlistedItem } from '$lib/requests/queries/users/watchlistQuery.ts';
import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { UpNextMappedMock } from '$mocks/data/sync/mapped/UpNextMappedMock.ts';
import { WatchlistMoviesMappedMock } from '$mocks/data/users/mapped/WatchlistMoviesMappedMock.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { describe, expect, it } from 'vitest';
import { getTodayWindow } from './getTodayWindow.ts';
import { toForYouItems } from './toForYouItems.ts';

const now = new Date('2026-09-28T14:00:00.000Z');
const lastNight = new Date('2026-09-27T20:00:00.000Z');
const later = new Date('2026-09-28T20:00:00.000Z');
const twoDaysAgo = new Date('2026-09-26T20:00:00.000Z');

const upNextEntry = assertDefined(UpNextMappedMock.at(0));
const watchlistItem = assertDefined(WatchlistMoviesMappedMock.at(0));

function watchlisted(entry: MovieEntry): WatchlistedItem {
  return { ...watchlistItem, type: 'movie', entry };
}

describe('util: toForYouItems', () => {
  it('should include episodes that aired in the last 24 hours', () => {
    const items = toForYouItems({
      upNext: [{ ...upNextEntry, effectiveReleaseDate: lastNight }],
      watchlist: [],
      range: getTodayWindow(now),
    });

    expect(items.map((item) => item.type)).toEqual(['up-next']);
  });

  it('should skip episodes older than 24 hours or not aired yet', () => {
    const items = toForYouItems({
      upNext: [
        { ...upNextEntry, effectiveReleaseDate: twoDaysAgo },
        { ...upNextEntry, effectiveReleaseDate: later },
      ],
      watchlist: [],
      range: getTodayWindow(now),
    });

    expect(items).toEqual([]);
  });

  it('should include watchlist titles released in the last 24 hours', () => {
    const released = { ...MovieHereticMappedMock, effectiveReleaseDate: now };
    const items = toForYouItems({
      upNext: [],
      watchlist: [
        watchlisted(released),
        watchlisted({
          ...MovieHereticMappedMock,
          effectiveReleaseDate: twoDaysAgo,
        }),
      ],
      range: getTodayWindow(now),
    });

    expect(items).toEqual([{
      key: `start-watching-movie-${released.id}`,
      type: 'start-watching',
      media: released,
    }]);
  });

  it('should list new episodes before watchlist releases', () => {
    const items = toForYouItems({
      upNext: [{ ...upNextEntry, effectiveReleaseDate: lastNight }],
      watchlist: [
        watchlisted({ ...MovieHereticMappedMock, effectiveReleaseDate: now }),
      ],
      range: getTodayWindow(now),
    });

    expect(items.map((item) => item.type)).toEqual([
      'up-next',
      'start-watching',
    ]);
  });
});
