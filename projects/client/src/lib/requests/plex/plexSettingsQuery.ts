import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { time } from '$lib/utils/timing/time.ts';
import { z } from 'zod';

const PlexSyncTogglesSchema = z.object({
  movie: z.object({
    watching: z.boolean(),
    watched: z.boolean(),
    rated: z.boolean(),
    collected: z.boolean(),
    watchlist: z.boolean(),
  }),
  show: z.object({
    rated: z.boolean(),
    watchlist: z.boolean(),
  }),
  season: z.object({
    rated: z.boolean(),
  }),
  episode: z.object({
    watching: z.boolean(),
    watched: z.boolean(),
    rated: z.boolean(),
    collected: z.boolean(),
  }),
});

const PlexScrobblerTogglesSchema = z.object({
  movie: z.object({
    watching: z.boolean(),
    watched: z.boolean(),
    rated: z.boolean(),
    collected: z.boolean(),
  }),
  show: z.object({
    rated: z.boolean(),
  }),
  season: z.object({
    rated: z.boolean(),
  }),
  episode: z.object({
    watching: z.boolean(),
    watched: z.boolean(),
    rated: z.boolean(),
    collected: z.boolean(),
  }),
});

export const PlexSettingsSchema = z.object({
  connection: z.object({
    isConnected: z.boolean(),
    username: z.string().nullable(),
  }),
  webhook: z.object({
    url: z.string().nullable(),
    lastEventAt: z.date().nullable(),
    eventCount: z.number(),
    homeUsers: z.string().nullable(),
  }),
  sync: z.object({
    isConfigured: z.boolean(),
    hasError: z.boolean(),
    selection: z.object({
      serverIds: z.string().array(),
      libraryIds: z.array(z.object({
        serverId: z.string(),
        uuid: z.string(),
      })),
      userIds: z.string().array(),
    }),
    toggles: PlexSyncTogglesSchema,
  }),
  scrobbler: z.object({
    toggles: PlexScrobblerTogglesSchema,
  }),
});

export type PlexSettings = z.infer<typeof PlexSettingsSchema>;

const plexSettingsRequest = ({ fetch }: ApiParams) =>
  api({ fetch }).users.plex.settings();

function mapToPlexSettings(body: {
  connection: { connected: boolean; username: string | null };
  webhook: {
    url: string | null;
    last_event_at: string | null;
    event_count: number;
    home_users: string | null;
  };
  sync: {
    configured: boolean;
    error: boolean;
    selection: {
      server_ids: string[];
      library_ids: { server_id: string; uuid: string }[];
      user_ids: string[];
    };
    toggles: typeof PlexSyncTogglesSchema._type;
  };
  scrobbler: { toggles: typeof PlexScrobblerTogglesSchema._type };
}): PlexSettings {
  return {
    connection: {
      isConnected: body.connection.connected,
      username: body.connection.username,
    },
    webhook: {
      url: body.webhook.url,
      lastEventAt: body.webhook.last_event_at
        ? new Date(body.webhook.last_event_at)
        : null,
      eventCount: body.webhook.event_count,
      homeUsers: body.webhook.home_users,
    },
    sync: {
      isConfigured: body.sync.configured,
      hasError: body.sync.error,
      selection: {
        serverIds: body.sync.selection.server_ids,
        libraryIds: body.sync.selection.library_ids.map(({ server_id, uuid }) => ({
          serverId: server_id,
          uuid,
        })),
        userIds: body.sync.selection.user_ids,
      },
      toggles: body.sync.toggles,
    },
    scrobbler: {
      toggles: body.scrobbler.toggles,
    },
  };
}

export const plexSettingsQuery = defineQuery({
  key: 'plexSettings',
  invalidations: [InvalidateAction.Plex.Settings],
  dependencies: () => [],
  request: plexSettingsRequest,
  mapper: (response) => mapToPlexSettings(response.body),
  schema: PlexSettingsSchema,
  ttl: time.minutes(5),
});
