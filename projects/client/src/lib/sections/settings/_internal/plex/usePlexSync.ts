import { plexConnectRequest } from '$lib/requests/plex/plexConnectRequest.ts';
import { plexRevokeRequest } from '$lib/requests/plex/plexRevokeRequest.ts';
import type { PlexServer } from '$lib/requests/plex/plexServersQuery.ts';
import { plexServersQuery } from '$lib/requests/plex/plexServersQuery.ts';
import { plexSyncRequest } from '$lib/requests/plex/plexSyncRequest.ts';
import { IS_DEV } from '$lib/utils/env/index.ts';
import { BehaviorSubject } from 'rxjs';

export type PlexAuthState = 'idle' | 'waiting' | 'connecting' | 'disconnecting';

const isConnected = new BehaviorSubject<boolean | null>(null);
const servers = new BehaviorSubject<PlexServer[]>([]);
const authState = new BehaviorSubject<PlexAuthState>('idle');
const selectedServerId = new BehaviorSubject<string | null>(null);
const isSyncing = new BehaviorSubject(false);

async function loadServers(): Promise<void> {
  const result = await plexServersQuery();
  if (result === null) {
    isConnected.next(false);
    servers.next([]);
    return;
  }
  isConnected.next(true);
  servers.next(result);
  if (result.length > 0 && !selectedServerId.getValue()) {
    selectedServerId.next(result[0].id);
  }
}

export function usePlexSync() {
  loadServers();

  return {
    isConnected: isConnected.asObservable(),
    servers: servers.asObservable(),
    authState: authState.asObservable(),
    selectedServerId: selectedServerId.asObservable(),
    isSyncing: isSyncing.asObservable(),

    startAuth: async () => {
      if (IS_DEV) {
        authState.next('waiting');
        return;
      }

      const url = await plexConnectRequest({
        returnUrl: globalThis.window.location.href,
      });
      if (!url) return;

      globalThis.window.open(url, '_blank', 'noopener,noreferrer');
      authState.next('waiting');
    },

    confirmAuth: async () => {
      authState.next('connecting');
      await loadServers();
      authState.next('idle');
    },

    cancelAuth: () => {
      authState.next('idle');
    },

    disconnect: async () => {
      authState.next('disconnecting');

      if (!IS_DEV) {
        await plexRevokeRequest();
      }

      isConnected.next(false);
      servers.next([]);
      selectedServerId.next(null);
      authState.next('idle');
    },

    selectServer: (serverId: string) => {
      selectedServerId.next(serverId);
    },

    syncNow: async () => {
      const serverId = selectedServerId.getValue();
      if (!serverId) return;

      isSyncing.next(true);
      try {
        if (!IS_DEV) {
          await plexSyncRequest({ serverId });
        }
      } finally {
        isSyncing.next(false);
      }
    },
  };
}
