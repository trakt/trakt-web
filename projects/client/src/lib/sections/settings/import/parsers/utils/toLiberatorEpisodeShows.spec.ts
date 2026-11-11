import { describe, expect, it } from 'vitest';
import { toLiberatorEpisodeShows } from './toLiberatorEpisodeShows.ts';

describe('util: toLiberatorEpisodeShows', () => {
  it('should map episodes to their show, season and episode from shows.json', () => {
    const result = toLiberatorEpisodeShows({
      shows: [
        {
          id: { tvdb: 900 },
          seasons: [
            {
              number: 2,
              episodes: [{ id: { tvdb: 501 }, number: 3 }, { number: 4 }],
            },
          ],
        },
      ],
      episodeWatches: [],
    });

    expect(result.get(501)).toEqual({ showTvdb: 900, season: 2, episode: 3 });
    expect(result.size).toBe(1);
  });

  it('should map episodes to their show from episode_watches.json', () => {
    const result = toLiberatorEpisodeShows({
      shows: [],
      episodeWatches: [{ episode_id: 501, series_id: 900 }],
    });

    expect(result.get(501)).toEqual({ showTvdb: 900 });
  });

  it('should prefer shows.json since it carries season and episode numbers', () => {
    const result = toLiberatorEpisodeShows({
      shows: [
        {
          id: { tvdb: 900 },
          seasons: [
            { number: 1, episodes: [{ id: { tvdb: 501 }, number: 1 }] },
          ],
        },
      ],
      episodeWatches: [{ episode_id: 501, series_id: 900 }],
    });

    expect(result.get(501)).toEqual({ showTvdb: 900, season: 1, episode: 1 });
  });

  it('should ignore entries of an unknown shape', () => {
    const result = toLiberatorEpisodeShows({
      shows: [{ meta: { id: 900 } }, null, 'text'],
      episodeWatches: [{ episode_id: 'x' }, null],
    });

    expect(result.size).toBe(0);
  });
});
