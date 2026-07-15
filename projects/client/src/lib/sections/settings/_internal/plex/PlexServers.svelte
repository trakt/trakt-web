<script lang="ts">
  import SingleSelect from "$lib/components/select/SingleSelect.svelte";
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

  const options = $derived(
    servers.map((server) => ({ value: server.id, label: server.name })),
  );
</script>

{#if servers.length > 0}
  <SettingsGroupRow title={m.label_plex_server()} variant="custom">
    {#snippet icon()}<ServerIcon />{/snippet}
    <div class="trakt-server-controls">
      <SingleSelect
        {options}
        value={selectedServerId}
        placeholder={m.label_plex_server()}
        autoWidth
        onChange={onSelectServer}
      />
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
