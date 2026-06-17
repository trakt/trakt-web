import { api, type ApiParams } from '$lib/requests/api.ts';

type PlexLibrarySelection = {
  server_id: string;
  uuid: string;
};

type PlexSyncTogglesPartial = {
  movie?: Partial<{
    watching: boolean;
    watched: boolean;
    rated: boolean;
    collected: boolean;
    watchlist: boolean;
  }>;
  show?: Partial<{ rated: boolean; watchlist: boolean }>;
  season?: Partial<{ rated: boolean }>;
  episode?: Partial<{
    watching: boolean;
    watched: boolean;
    rated: boolean;
    collected: boolean;
  }>;
};

type PlexScrobblerTogglesPartial = {
  movie?: Partial<{
    watching: boolean;
    watched: boolean;
    rated: boolean;
    collected: boolean;
  }>;
  show?: Partial<{ rated: boolean }>;
  season?: Partial<{ rated: boolean }>;
  episode?: Partial<{
    watching: boolean;
    watched: boolean;
    rated: boolean;
    collected: boolean;
  }>;
};

type PlexUpdateSettingsBody = {
  sync?: {
    selection?: {
      server_ids?: string[];
      library_ids?: PlexLibrarySelection[];
      user_ids?: string[];
    };
    toggles?: PlexSyncTogglesPartial;
  };
  scrobbler?: {
    toggles?: PlexScrobblerTogglesPartial;
  };
  webhook?: {
    home_users?: string | null;
  };
  trigger_sync?: {
    watched_all_data?: boolean;
    collection_all_data?: boolean;
    ratings_all_data?: boolean;
    watchlist_all_data?: boolean;
  };
};

type PlexUpdateSettingsParams = {
  settings: PlexUpdateSettingsBody;
} & ApiParams;

export function plexUpdateSettingsRequest(
  { settings, fetch }: PlexUpdateSettingsParams,
): Promise<boolean> {
  return api({ fetch }).users.plex.updateSettings({ body: settings })
    .then(({ status }) => status === 204);
}
