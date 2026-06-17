import type { PlexSettingsResponse } from '@trakt/api';

export const PlexSettingsResponseMock: PlexSettingsResponse = {
  connection: {
    connected: true,
    username: 'plexuser',
  },
  webhook: {
    url: 'https://scrobblers.trakt.tv/plex/mock/mock',
    last_event_at: '2024-03-15T10:30:00.000Z',
    event_count: 42,
    home_users: null,
  },
  sync: {
    configured: true,
    error: false,
    selection: {
      server_ids: ['abc123server'],
      library_ids: [
        {
          server_id: 'abc123server',
          uuid: 'lib-movies-uuid',
        },
      ],
      user_ids: ['1'],
    },
    toggles: {
      movie: {
        watching: false,
        watched: true,
        rated: true,
        collected: true,
        watchlist: false,
      },
      show: {
        rated: true,
        watchlist: false,
      },
      season: {
        rated: true,
      },
      episode: {
        watching: false,
        watched: true,
        rated: true,
        collected: true,
      },
    },
  },
  scrobbler: {
    toggles: {
      movie: {
        watching: true,
        watched: true,
        rated: true,
        collected: true,
      },
      show: {
        rated: true,
      },
      season: {
        rated: true,
      },
      episode: {
        watching: true,
        watched: true,
        rated: true,
        collected: true,
      },
    },
  },
};
