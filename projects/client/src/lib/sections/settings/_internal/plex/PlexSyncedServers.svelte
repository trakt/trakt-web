<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import { useQuery } from "$lib/features/query/useQuery.ts";
  import type { PlexServer } from "$lib/requests/plex/plexServersQuery.ts";
  import { plexSettingsQuery } from "$lib/requests/plex/plexSettingsQuery.ts";
  import { map } from "rxjs";
  import SettingsGroupCard from "../SettingsGroupCard.svelte";
  import PlexSyncedServerRow from "./PlexSyncedServerRow.svelte";

  const {
    servers,
    isSyncing,
    onSyncNow,
  }: {
    servers: PlexServer[];
    isSyncing: boolean;
    onSyncNow: (serverId: string) => void;
  } = $props();

  const selectedLibraries = useQuery(plexSettingsQuery()).pipe(
    map((query) => query.data?.sync.selection.libraryIds ?? []),
  );

  // One entry per server referenced by the persisted library selection, in
  // selection order (the order the API uses when capping free accounts).
  const syncedServers = $derived.by(() => {
    const serverIds = [
      ...new Set($selectedLibraries.map((library) => library.serverId)),
    ];

    return serverIds.map((serverId) => ({
      serverId,
      serverName: servers.find((server) => server.id === serverId)?.name ??
        serverId,
      libraryUuids: $selectedLibraries
        .filter((library) => library.serverId === serverId)
        .map((library) => library.uuid),
    }));
  });
</script>

{#if syncedServers.length > 0}
  <SettingsGroupCard title={m.header_plex_synced_servers()}>
    {#each syncedServers as synced (synced.serverId)}
      <PlexSyncedServerRow {...synced} {isSyncing} {onSyncNow} />
    {/each}
  </SettingsGroupCard>
{/if}
