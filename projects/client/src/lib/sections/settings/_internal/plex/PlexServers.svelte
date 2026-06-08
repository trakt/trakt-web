<script lang="ts">
  import Button from '$lib/components/buttons/Button.svelte';
  import * as m from '$lib/features/i18n/messages.ts';
  import type { PlexServer } from '$lib/requests/plex/plexServersQuery.ts';
  import SettingsRow from '../SettingsRow.svelte';

  const {
    servers,
    selectedServerId,
    isSyncing,
    onSelectServer,
    onSyncNow,
  }: {
    servers: PlexServer[];
    selectedServerId: string | null;
    isSyncing: boolean;
    onSelectServer: (id: string) => void;
    onSyncNow: () => void;
  } = $props();
</script>

{#if servers.length === 0}
  <p class="secondary">{m.label_plex_no_servers()}</p>
{:else}
  <SettingsRow title={m.label_plex_server()}>
    {#snippet children()}
      <select
        class="plex-server-select"
        value={selectedServerId}
        onchange={(e) => onSelectServer((e.target as HTMLSelectElement).value)}
      >
        {#each servers as server (server.id)}
          <option value={server.id}>{server.name}</option>
        {/each}
      </select>
    {/snippet}

    {#snippet action()}
      <Button
        size="small"
        color="default"
        onclick={onSyncNow}
        disabled={isSyncing || !selectedServerId}
      >
        {m.button_plex_sync_now()}
      </Button>
    {/snippet}
  </SettingsRow>
{/if}

<style>
  .plex-server-select {
    background: var(--color-input-background);
    color: var(--color-text-primary);
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius-s);
    padding: var(--ni-6) var(--ni-10);
    font-size: var(--font-size-text);
    cursor: pointer;
    min-width: var(--ni-180);
  }
</style>
