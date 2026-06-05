import type { ReleasesCalendarEntry } from '$lib/requests/queries/calendars/releasesCalendarQuery.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { UpcomingEpisodesMappedMock } from '$mocks/data/calendars/mapped/UpcomingEpisodesMappedMock.ts';
import { UpcomingMoviesMappedMock } from '$mocks/data/calendars/mapped/UpcomingMoviesMappedMock.ts';
import { describe, expect, it } from 'vitest';
import { filterReleasesItems } from './filterReleasesItems.ts';

const baseEpisode = assertDefined(UpcomingEpisodesMappedMock.at(0));
const baseMovie = assertDefined(UpcomingMoviesMappedMock.at(0));

function releaseDate(day: number) {
  return new Date(`2026-01-${day.toString().padStart(2, '0')}T00:00:00.000Z`);
}

function episodeOn(day: number, id: number): ReleasesCalendarEntry {
  const date = releaseDate(day);

  return {
    ...baseEpisode,
    airDate: date,
    effectiveReleaseDate: date,
    id,
    key: `episode-${id}`,
    number: id,
    releaseDate: date,
  };
}

function movieOn(day: number, id: number): ReleasesCalendarEntry {
  const date = releaseDate(day);

  return {
    ...baseMovie,
    airDate: date,
    effectiveReleaseDate: date,
    id,
    key: `movie-${id}`,
    releaseDate: date,
    slug: `movie-${id}`,
  };
}

describe('filterReleasesItems', () => {
  it('should keep only future items and the next episode per show', () => {
    const pastEpisode = episodeOn(1, 100);
    const movie = movieOn(2, 200);
    const firstShowEpisode = episodeOn(3, 101);
    const secondShowEpisode = episodeOn(4, 102);

    const result = filterReleasesItems({
      entries: [
        secondShowEpisode,
        pastEpisode,
        movie,
        firstShowEpisode,
      ],
      limit: 10,
      now: releaseDate(1),
    });

    expect(result).to.deep.equal([
      movie,
      firstShowEpisode,
    ]);
  });

  it('should return no items when the limit is not positive', () => {
    const result = filterReleasesItems({
      entries: [movieOn(2, 200)],
      limit: 0,
      now: releaseDate(1),
    });

    expect(result).to.deep.equal([]);
  });
});
