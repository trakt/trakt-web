import type { EpisodeType } from '$lib/requests/models/EpisodeType.ts';
import type { MediaEntry } from '$lib/requests/models/MediaEntry.ts';
import type { UpcomingEpisodeEntry } from '$lib/requests/queries/calendars/upcomingEpisodesQuery.ts';
import { describe, expect, it } from 'vitest';
import { matchesEpisodeTypeFilter } from './matchesEpisodeTypeFilter.ts';

type EpisodeStub = {
  type: EpisodeType;
  episodes?: Array<{ type: EpisodeType }>;
};

const episode = ({ type, episodes }: EpisodeStub) =>
  ({ show: { id: 1 }, type, episodes }) as unknown as UpcomingEpisodeEntry;

const movie = () => ({ type: 'movie' }) as unknown as MediaEntry;

describe('util: matchesEpisodeTypeFilter', () => {
  it('should keep everything when showing all', () => {
    expect(matchesEpisodeTypeFilter(episode({ type: 'standard' }), 'all'))
      .toBe(true);
    expect(matchesEpisodeTypeFilter(movie(), 'all')).toBe(true);
  });

  describe('for a single episode', () => {
    it('should keep every kind of premiere', () => {
      const premieres: ReadonlyArray<EpisodeType> = [
        'series_premiere',
        'season_premiere',
        'mid_season_premiere',
      ];

      premieres.forEach((type) => {
        expect(matchesEpisodeTypeFilter(episode({ type }), 'premieres'))
          .toBe(true);
      });
    });

    it('should keep every kind of finale', () => {
      const finales: ReadonlyArray<EpisodeType> = [
        'mid_season_finale',
        'season_finale',
        'series_finale',
      ];

      finales.forEach((type) => {
        expect(matchesEpisodeTypeFilter(episode({ type }), 'finales'))
          .toBe(true);
      });
    });

    it('should drop a standard episode from both filters', () => {
      expect(matchesEpisodeTypeFilter(episode({ type: 'standard' }), 'finales'))
        .toBe(false);
      expect(
        matchesEpisodeTypeFilter(episode({ type: 'standard' }), 'premieres'),
      ).toBe(false);
    });

    it('should not confuse a premiere for a finale', () => {
      expect(
        matchesEpisodeTypeFilter(
          episode({ type: 'season_premiere' }),
          'finales',
        ),
      ).toBe(false);
    });
  });

  describe('for a grouped day', () => {
    it('should match on any of the grouped episodes', () => {
      const grouped = episode({
        type: 'multiple_episodes',
        episodes: [{ type: 'standard' }, { type: 'season_finale' }],
      });

      expect(matchesEpisodeTypeFilter(grouped, 'finales')).toBe(true);
      expect(matchesEpisodeTypeFilter(grouped, 'premieres')).toBe(false);
    });

    it('should answer to both filters for a full season', () => {
      const fullSeason = episode({ type: 'full_season' });

      expect(matchesEpisodeTypeFilter(fullSeason, 'premieres')).toBe(true);
      expect(matchesEpisodeTypeFilter(fullSeason, 'finales')).toBe(true);
    });
  });

  it('should drop movies from a role specific feed', () => {
    expect(matchesEpisodeTypeFilter(movie(), 'premieres')).toBe(false);
    expect(matchesEpisodeTypeFilter(movie(), 'finales')).toBe(false);
  });
});
