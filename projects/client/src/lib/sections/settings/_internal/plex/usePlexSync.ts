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
export type PlexServersState = 'loading' | 'loaded' | 'error';

export function usePlexSync() {
  const isConnected = new BehaviorSubject<boolean | null>(null);
  const servers = new BehaviorSubject<PlexServer[]>([]);
  const serversState = new BehaviorSubject<PlexServersState>('loading');
  const authState = new BehaviorSubject<PlexAuthState>('idle');
  const isSyncing = new BehaviorSubject(false);

  onDestroy(() => {
    isConnected.complete();
    servers.complete();
    serversState.complete();
    authState.complete();
    isSyncing.complete();
  });

  async function loadConnection(): Promise<boolean> {
    const response = await api().users.plex.settings();
    const connected = response.status === 200 &&
      response.body.connection.connected;

    isConnected.next(connected);
    return connected;
  }

  async function loadServers(): Promise<void> {
    serversState.next('loading');

    try {
      servers.next(await plexServersQuery());
      serversState.next('loaded');
    } catch {
      servers.next([]);
      serversState.next('error');
    }
  }

  async function load(): Promise<void> {
    if (!await loadConnection()) {
      servers.next([]);
      serversState.next('loaded');
      return;
    }

    await loadServers();
  }

  function cleanPlexStatusParam() {
    const url = new URL(globalThis.window.location.href);
    if (!url.searchParams.has('plex_status')) return;
    url.searchParams.delete('plex_status');
    globalThis.window.history.replaceState({}, '', url);
  }

  if (browser) {
    cleanPlexStatusParam();
    load();
  }

  return {
    isConnected: isConnected.asObservable(),
    servers: servers.asObservable(),
    serversState: serversState.asObservable(),
    authState: authState.asObservable(),
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
      await load();
      authState.next('idle');
    },

    retryServers: loadServers,

    cancelAuth: () => {
      authState.next('idle');
    },

    disconnect: async () => {
      authState.next('disconnecting');

      await plexRevokeRequest();

      isConnected.next(false);
      servers.next([]);
      serversState.next('loaded');
      authState.next('idle');
    },

    syncNow: async (serverId: string) => {
      isSyncing.next(true);
      try {
        await plexSyncRequest({ serverId });
      } finally {
        isSyncing.next(false);
      }
    },
  };
}
