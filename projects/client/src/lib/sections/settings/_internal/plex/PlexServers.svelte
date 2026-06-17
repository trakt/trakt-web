<script lang="ts">
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import DropdownList from "$lib/components/dropdown/DropdownList.svelte";
  import ServerIcon from "$lib/components/icons/ServerIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { PlexServer } from "$lib/requests/plex/plexServersQuery.ts";
  import SettingsGroupRow from "../SettingsGroupRow.svelte";

  const {
    servers,
    selectedServerId,
    onSelectServer,
  }: {
    servers: PlexServer[];
    selectedServerId: string | null;
    onSelectServer: (id: string) => void;
  } = $props();

  const selectedServer = $derived(
    servers.find((s) => s.id === selectedServerId),
  );
</script>

{#if servers.length > 0}
  <SettingsGroupRow title={m.label_plex_server()} variant="custom">
    {#snippet icon()}<ServerIcon />{/snippet}
    <div class="trakt-server-controls">
      <DropdownList
        size="small"
        color="default"
        style="flat"
        preferNative
        label={m.label_plex_server()}
      >
        {selectedServer?.name ?? "—"}
        {#snippet items()}
          {#each servers as server (server.id)}
            <DropdownItem
              color="default"
              disabled={server.id === selectedServerId}
              onclick={() => onSelectServer(server.id)}
            >
              {server.name}
            </DropdownItem>
          {/each}
        {/snippet}
      </DropdownList>
    </div>
  </SettingsGroupRow>
{/if}

<style>
  .trakt-server-controls {
    display: flex;
    align-items: center;
    gap: var(--gap-s);
    flex-shrink: 0;
  }
</style>
