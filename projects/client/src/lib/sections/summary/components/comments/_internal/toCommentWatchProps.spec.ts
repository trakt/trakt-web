import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { describe, expect, it } from 'vitest';
import { toCommentWatchProps } from './toCommentWatchProps.ts';

const media = MovieHereticMappedMock;

describe('util: toCommentWatchProps', () => {
  it('should pass a movie through as is', () => {
    expect(toCommentWatchProps({ type: 'movie', media })).to.deep.equal({
      type: 'movie',
      media,
    });
  });

  it('should pass a show through as is', () => {
    expect(toCommentWatchProps({ type: 'show', media })).to.deep.equal({
      type: 'show',
      media,
    });
  });

  it('should scope an episode comment to the episode of the show', () => {
    expect(
      toCommentWatchProps({
        type: 'episode',
        media,
        id: 42,
        season: 2,
        episode: 3,
      }),
    ).to.deep.equal({
      type: 'episode',
      media: { id: 42, season: 2, number: 3 },
      show: { id: media.id, title: media.title },
    });
  });

  it('should only count a season as seen once every episode is released', () => {
    expect(
      toCommentWatchProps({
        type: 'season',
        media,
        id: 7,
        season: 1,
        episodeCount: 10,
      }),
    ).to.deep.equal({
      type: 'season',
      media: { id: 7, number: 1, episodes: { count: 10, aired: 10 } },
      show: { id: media.id },
    });
  });
});
