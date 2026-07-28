import type { MediaEntry } from '$lib/requests/models/MediaEntry.ts';
import type { UpcomingEpisodeEntry } from '$lib/requests/queries/calendars/upcomingEpisodesQuery.ts';
import { describe, expect, it } from 'vitest';
import { matchesEpisodeTypeFilter } from './matchesEpisodeTypeFilter.ts';

type EpisodeStub = { type: string; episodes?: Array<{ type: string }> };

const episode = ({ type, episodes }: EpisodeStub) =>
  ({ show: { id: 1 }, type, episodes }) as unknown as UpcomingEpisodeEntry;

const movie = () => ({ type: 'movie' }) as unknown as MediaEntry;

const nothing = { included: [], excluded: [] };

describe('util: matchesEpisodeTypeFilter', () => {
  it('should keep everything when nothing is selected', () => {
    expect(matchesEpisodeTypeFilter(episode({ type: 'standard' }), nothing))
      .toBe(true);
    expect(matchesEpisodeTypeFilter(movie(), nothing)).toBe(true);
  });

  describe('for a single episode', () => {
    it('should keep an included role', () => {
      expect(matchesEpisodeTypeFilter(episode({ type: 'season_finale' }), {
        included: ['season_finale'],
        excluded: [],
      })).toBe(true);
    });

    it('should drop a role that was not included', () => {
      expect(matchesEpisodeTypeFilter(episode({ type: 'standard' }), {
        included: ['season_finale'],
        excluded: [],
      })).toBe(false);
    });

    it('should drop an excluded role', () => {
      expect(matchesEpisodeTypeFilter(episode({ type: 'season_finale' }), {
        included: [],
        excluded: ['season_finale'],
      })).toBe(false);
    });

    it('should keep an unrelated role when another is excluded', () => {
      expect(matchesEpisodeTypeFilter(episode({ type: 'standard' }), {
        included: [],
        excluded: ['season_finale'],
      })).toBe(true);
    });
  });

  describe('for a grouped day', () => {
    const grouped = episode({
      type: 'multiple_episodes',
      episodes: [{ type: 'standard' }, { type: 'season_finale' }],
    });

    it('should match on any of the grouped episodes', () => {
      expect(matchesEpisodeTypeFilter(grouped, {
        included: ['season_finale'],
        excluded: [],
      })).toBe(true);
    });

    it('should drop the group when one of its episodes is excluded', () => {
      expect(matchesEpisodeTypeFilter(grouped, {
        included: [],
        excluded: ['season_finale'],
      })).toBe(false);
    });

    it('should answer to any premiere or finale role for a full season', () => {
      const fullSeason = episode({ type: 'full_season' });

      expect(matchesEpisodeTypeFilter(fullSeason, {
        included: ['season_finale'],
        excluded: [],
      })).toBe(true);
      expect(matchesEpisodeTypeFilter(fullSeason, {
        included: ['season_premiere'],
        excluded: [],
      })).toBe(true);
      expect(matchesEpisodeTypeFilter(fullSeason, {
        included: ['mid_season_finale'],
        excluded: [],
      })).toBe(false);
    });
  });

  describe('for a movie', () => {
    it('should drop movies when a role is included', () => {
      expect(matchesEpisodeTypeFilter(movie(), {
        included: ['season_finale'],
        excluded: [],
      })).toBe(false);
    });

    it('should keep movies when a role is only excluded', () => {
      expect(matchesEpisodeTypeFilter(movie(), {
        included: [],
        excluded: ['season_finale'],
      })).toBe(true);
    });
  });
});
