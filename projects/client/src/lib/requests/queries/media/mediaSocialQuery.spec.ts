import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { mediaSocialQuery } from '$lib/requests/queries/media/mediaSocialQuery.ts';
import { EpisodeSiloResponseMock } from '$mocks/data/summary/episodes/silo/response/EpisodeSiloResponseMock.ts';
import { MediaSocialMappedMock } from '$mocks/data/summary/common/mapped/MediaSocialMappedMock.ts';
import { MovieHereticResponseMock } from '$mocks/data/summary/movies/heretic/response/MovieHereticResponseMock.ts';
import { ShowSiloResponseMock } from '$mocks/data/summary/shows/silo/response/ShowSiloResponseMock.ts';
import { createTestBedInfiniteQuery } from '$test/beds/query/createTestBedInfiniteQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { mapToEntries } from '$test/utils/mapToEntries.ts';
import { describe, expect, it } from 'vitest';

describe('mediaSocialQuery', () => {
  it('should query movie social users', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedInfiniteQuery(
          mediaSocialQuery({
            type: 'movie',
            slug: MovieHereticResponseMock.ids.slug,
            limit: 5,
          }),
        ),
      mapper: mapToEntries,
    });

    expect(result).to.deep.equal(MediaSocialMappedMock);
  });

  it('should query show social users', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedInfiniteQuery(
          mediaSocialQuery({
            type: 'show',
            slug: ShowSiloResponseMock.ids.slug,
            limit: 5,
          }),
        ),
      mapper: mapToEntries,
    });

    expect(result).to.deep.equal(MediaSocialMappedMock);
  });

  it('should query episode social users', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedInfiniteQuery(
          mediaSocialQuery({
            type: 'episode',
            slug: ShowSiloResponseMock.ids.slug,
            season: EpisodeSiloResponseMock.season,
            episode: EpisodeSiloResponseMock.number,
            limit: 5,
          }),
        ),
      mapper: mapToEntries,
    });

    expect(result).to.deep.equal(MediaSocialMappedMock);
  });

  it('should invalidate when social inputs can change', () => {
    const query = mediaSocialQuery({
      type: 'movie',
      slug: MovieHereticResponseMock.ids.slug,
      limit: 5,
    });

    expect(query.queryKey).toContain(InvalidateAction.User.Follow);
    expect(query.queryKey).toContain(InvalidateAction.MarkAsWatched('movie'));
    expect(query.queryKey).toContain(InvalidateAction.Rated('episode'));
    expect(query.queryKey).toContain(InvalidateAction.Watchlisted('show'));
  });
});
