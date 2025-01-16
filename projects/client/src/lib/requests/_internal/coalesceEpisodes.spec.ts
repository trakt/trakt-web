import { EpisodeComputedType } from '$lib/models/EpisodeType';
import { describe, expect, it } from 'vitest';
import type { UpcomingEpisodeEntry } from '../queries/calendars/upcomingEpisodesQuery';
import { coalesceEpisodes } from './coalesceEpisodes';

describe('coalesceEpisodes', () => {
  it('should coalesce season premiere and finale into full season', () => {
    const show = { id: 1, title: 'Test Show' };
    const episodes = [
      {
        show,
        season: 1,
        episode: 1,
        type: 'season_premiere',
        airDate: new Date('2024-01-01'),
      } as unknown as UpcomingEpisodeEntry,
      {
        show,
        season: 1,
        episode: 10,
        type: 'season_finale',
        airDate: new Date('2024-03-01'),
      } as unknown as UpcomingEpisodeEntry,
    ];

    const result = coalesceEpisodes(episodes);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      ...episodes[0],
      type: EpisodeComputedType.FullSeason,
      season: 1,
      show,
    });
  });

  it('should not coalesce regular episodes', () => {
    const show = { id: 1, title: 'Test Show' };
    const episodes = [
      {
        show,
        season: 1,
        episode: 1,
        type: 'regular',
        airDate: new Date('2024-01-01'),
      } as unknown as UpcomingEpisodeEntry,

      {
        show,
        season: 1,
        episode: 2,
        type: 'regular',
        airDate: new Date('2024-01-08'),
      } as unknown as UpcomingEpisodeEntry,
    ];

    const result = coalesceEpisodes(episodes);

    expect(result).toEqual(episodes);
  });

  it('should sort episodes by air date', () => {
    const show = { id: 1, title: 'Test Show' };
    const episodes = [
      {
        show,
        season: 1,
        episode: 2,
        type: 'regular',
        airDate: new Date('2024-01-08'),
      } as unknown as UpcomingEpisodeEntry,
      {
        show,
        season: 1,
        episode: 1,
        type: 'regular',
        airDate: new Date('2024-01-01'),
      } as unknown as UpcomingEpisodeEntry,
    ];

    const result = coalesceEpisodes(episodes);

    expect(result[0].airDate).toEqual(new Date('2024-01-01'));
    expect(result[1].airDate).toEqual(new Date('2024-01-08'));
  });

  it('should not coalesce if there is no season finale', () => {
    const show = { id: 1, title: 'Test Show' };
    const episodes = [
      {
        show,
        season: 1,
        episode: 1,
        type: 'season_premiere',
        airDate: new Date('2024-01-01'),
      } as unknown as UpcomingEpisodeEntry,
      {
        show,
        season: 1,
        episode: 2,
        type: 'regular',
        airDate: new Date('2024-03-01'),
      } as unknown as UpcomingEpisodeEntry,
    ];

    const result = coalesceEpisodes(episodes);

    expect(result).toEqual(episodes);
  });

  it('should not coalesce if there is no season premiere', () => {
    const show = { id: 1, title: 'Test Show' };
    const episodes = [
      {
        show,
        season: 1,
        episode: 9,
        type: 'regular',
        airDate: new Date('2024-01-01'),
      } as unknown as UpcomingEpisodeEntry,
      {
        show,
        season: 1,
        episode: 10,
        type: 'season_finale',
        airDate: new Date('2024-03-01'),
      } as unknown as UpcomingEpisodeEntry,
    ];

    const result = coalesceEpisodes(episodes);

    expect(result).toEqual(episodes);
  });

  it('should not coalesce if one episode from multiple shows', () => {
    const show1 = { id: 1, title: 'Test Show 1' };
    const show2 = { id: 2, title: 'Test Show 2' };
    const episodes = [
      {
        show: show1,
        season: 1,
        episode: 1,
        type: 'season_premiere',
        airDate: new Date('2024-01-01'),
      } as unknown as UpcomingEpisodeEntry,
      {
        show: show2,
        season: 1,
        episode: 10,
        type: 'season_finale',
        airDate: new Date('2024-03-01'),
      } as unknown as UpcomingEpisodeEntry,
    ];

    const result = coalesceEpisodes(episodes);

    expect(result).toEqual(episodes);
  });

  it('should coalesce multiple shows if they fulfill the criteria', () => {
    const show1 = { id: 1, title: 'Test Show 1' };
    const show2 = { id: 2, title: 'Test Show 2' };
    const episodes = [
      {
        show: show1,
        season: 1,
        episode: 1,
        type: 'season_premiere',
        airDate: new Date('2024-01-01'),
      } as unknown as UpcomingEpisodeEntry,
      {
        show: show2,
        season: 1,
        episode: 1,
        type: 'season_premiere',
        airDate: new Date('2024-01-01'),
      } as unknown as UpcomingEpisodeEntry,
      {
        show: show1,
        season: 1,
        episode: 10,
        type: 'season_finale',
        airDate: new Date('2024-03-01'),
      } as unknown as UpcomingEpisodeEntry,
      {
        show: show2,
        season: 1,
        episode: 10,
        type: 'season_finale',
        airDate: new Date('2024-03-01'),
      } as unknown as UpcomingEpisodeEntry,
    ];

    const result = coalesceEpisodes(episodes);

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      ...episodes[0],
      type: EpisodeComputedType.FullSeason,
      season: 1,
      show: show1,
    });
    expect(result[1]).toEqual({
      ...episodes[1],
      type: EpisodeComputedType.FullSeason,
      season: 1,
      show: show2,
    });
  });
});
