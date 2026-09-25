import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';
import { describe, expect, it } from 'vitest';
import { toReplyThreadUrl } from './toReplyThreadUrl.ts';

function searchParamsOf(url: string) {
  return Object.fromEntries(new URL(url, 'http://localhost').searchParams);
}

describe('util: toReplyThreadUrl', () => {
  it('should open the parent review drawer on a movie', () => {
    const url = toReplyThreadUrl({
      parentId: 42,
      type: 'movie',
      media: MovieHereticMappedMock,
    });

    expect(url).toContain(MovieHereticMappedMock.slug);
    expect(searchParamsOf(url)).toMatchObject({
      view: 'review',
      comment_id: '42',
    });
  });

  it('should keep the season when the reply is on a season', () => {
    const url = toReplyThreadUrl({
      parentId: 42,
      type: 'season',
      season: 2,
      id: 1,
      episodeCount: 10,
      media: ShowSiloMappedMock,
    });

    expect(searchParamsOf(url)).toMatchObject({
      view: 'review',
      comment_id: '42',
      season: '2',
    });
  });

  it('should open the episode drawer when the reply is on an episode', () => {
    const url = toReplyThreadUrl({
      parentId: 42,
      type: 'episode',
      season: 1,
      episode: 3,
      id: 1,
      media: ShowSiloMappedMock,
    });

    expect(searchParamsOf(url)).toMatchObject({
      view: 'episode',
      comment_id: '42',
      season: '1',
      episode: '3',
    });
  });
});
