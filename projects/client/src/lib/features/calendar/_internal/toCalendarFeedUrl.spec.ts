import { describe, expect, it } from 'vitest';
import { toCalendarFeedUrl } from './toCalendarFeedUrl.ts';

const base = {
  environment: 'https://api.trakt.tv',
  token: 'abc123',
  filters: {},
} as const;

describe('util: toCalendarFeedUrl', () => {
  it('should point the shows calendar at the shows feed with the token', () => {
    expect(toCalendarFeedUrl({ ...base, mode: 'show', episodeType: 'all' }))
      .toEqual({
        https: 'https://api.trakt.tv/calendars/my/shows.ics?slurm=abc123',
        webcal: 'webcal://api.trakt.tv/calendars/my/shows.ics?slurm=abc123',
      });
  });

  it('should use the movies feed in movie mode whatever the episode type', () => {
    expect(
      toCalendarFeedUrl({ ...base, mode: 'movie', episodeType: 'premieres' })
        .https,
    ).toBe('https://api.trakt.tv/calendars/my/movies.ics?slurm=abc123');
  });

  it('should use the merged feed in media mode', () => {
    expect(toCalendarFeedUrl({ ...base, mode: 'media', episodeType: 'all' }).https)
      .toBe('https://api.trakt.tv/calendars/my/media.ics?slurm=abc123');
  });

  it('should narrow episodes to premieres or finales', () => {
    expect(
      toCalendarFeedUrl({ ...base, mode: 'media', episodeType: 'premieres' })
        .https,
    ).toBe(
      'https://api.trakt.tv/calendars/my/shows/premieres.ics?slurm=abc123',
    );
    expect(
      toCalendarFeedUrl({ ...base, mode: 'show', episodeType: 'finales' }).https,
    ).toBe('https://api.trakt.tv/calendars/my/shows/finales.ics?slurm=abc123');
  });

  it('should carry the active filters on the feed', () => {
    expect(
      toCalendarFeedUrl({
        ...base,
        mode: 'show',
        episodeType: 'all',
        filters: { genres: 'drama,comedy', countries: 'us' },
      }).https,
    ).toBe(
      'https://api.trakt.tv/calendars/my/shows.ics?slurm=abc123&genres=drama%2Ccomedy&countries=us',
    );
  });
});
