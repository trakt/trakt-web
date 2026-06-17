import { browser } from '$app/environment';
import { api } from '$lib/requests/api.ts';
import { plexConnectRequest } from '$lib/requests/plex/plexConnectRequest.ts';
import { plexRevokeRequest } from '$lib/requests/plex/plexRevokeRequest.ts';
import type { PlexServer } from '$lib/requests/plex/plexServersQuery.ts';
import { plexServersQuery } from '$lib/requests/plex/plexServersQuery.ts';
import { plexSyncRequest } from '$lib/requests/plex/plexSyncRequest.ts';
import { onDestroy } from 'svelte';
import { BehaviorSubject } from 'rxjs';

export type PlexAuthState = 'idle' | 'waiting' | 'connecting' | 'disconnecting';

export function usePlexSync() {
  const isConnected = new BehaviorSubject<boolean | null>(null);
  const servers = new BehaviorSubject<PlexServer[]>([]);
  const authState = new BehaviorSubject<PlexAuthState>('idle');
  const selectedServerId = new BehaviorSubject<string | null>(null);
  const isSyncing = new BehaviorSubject(false);

  onDestroy(() => {
    isConnected.complete();
    servers.complete();
    authState.complete();
    selectedServerId.complete();
    isSyncing.complete();
  });

  async function loadServers(): Promise<void> {
    const [settingsResponse, result] = await Promise.all([
      api().users.plex.settings(),
      plexServersQuery(),
    ]);

    if (
      settingsResponse.status !== 200 ||
      !settingsResponse.body.connection.connected
    ) {
      isConnected.next(false);
      servers.next([]);
      return;
    }

    isConnected.next(true);

    const serverList = result ?? [];
    servers.next(serverList);

    if (serverList.length > 0 && !selectedServerId.getValue()) {
      selectedServerId.next(serverList.at(0)?.id ?? null);
    }
  }

  function cleanPlexStatusParam() {
    const url = new URL(globalThis.window.location.href);
    if (!url.searchParams.has('plex_status')) return;
    url.searchParams.delete('plex_status');
    globalThis.window.history.replaceState({}, '', url);
  }

  if (browser) {
    cleanPlexStatusParam();
    loadServers();
  }

  return {
    isConnected: isConnected.asObservable(),
    servers: servers.asObservable(),
    authState: authState.asObservable(),
    selectedServerId: selectedServerId.asObservable(),
    isSyncing: isSyncing.asObservable(),

    startAuth: async () => {
      const url = await plexConnectRequest({
        returnUrl: globalThis.window.location.href,
      });
      if (!url) return;

      globalThis.window.location.href = url;
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

      await plexRevokeRequest();

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
        await plexSyncRequest({ serverId });
      } finally {
        isSyncing.next(false);
      }
    },
  };
}
