import { PlexSettingsResponseMock } from '../response/PlexSettingsResponseMock.ts';

export const PlexSettingsMappedMock = {
  connection: {
    isConnected: PlexSettingsResponseMock.connection.connected,
    username: PlexSettingsResponseMock.connection.username,
  },
  webhook: {
    url: PlexSettingsResponseMock.webhook.url,
    lastEventAt: new Date('2024-03-15T10:30:00.000Z'),
    eventCount: PlexSettingsResponseMock.webhook.event_count,
    homeUsers: PlexSettingsResponseMock.webhook.home_users,
  },
  sync: {
    isConfigured: PlexSettingsResponseMock.sync.configured,
    hasError: PlexSettingsResponseMock.sync.error,
    selection: {
      serverIds: PlexSettingsResponseMock.sync.selection.server_ids,
      libraryIds: PlexSettingsResponseMock.sync.selection.library_ids.map(
        ({ server_id, uuid }) => ({ serverId: server_id, uuid }),
      ),
      userIds: PlexSettingsResponseMock.sync.selection.user_ids,
    },
    toggles: PlexSettingsResponseMock.sync.toggles,
  },
  scrobbler: {
    toggles: PlexSettingsResponseMock.scrobbler.toggles,
  },
};
