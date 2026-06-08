<script lang="ts">
  import * as m from '$lib/features/i18n/messages.ts';
  import SettingsBlock from './_internal/SettingsBlock.svelte';
  import SettingsRow from './_internal/SettingsRow.svelte';
  import PlexConnect from './_internal/plex/PlexConnect.svelte';
  import PlexServerCard from './_internal/plex/PlexServerCard.svelte';
  import PlexServers from './_internal/plex/PlexServers.svelte';
  import PlexSyncHistory from './_internal/plex/PlexSyncHistory.svelte';
  import PlexSyncSettings from './_internal/plex/PlexSyncSettings.svelte';
  import { usePlexSync } from './_internal/plex/usePlexSync.ts';

  const {
    isConnected,
    servers,
    authState,
    selectedServerId,
    isSyncing,
    startAuth,
    confirmAuth,
    cancelAuth,
    disconnect,
    selectServer,
    syncNow,
  } = usePlexSync();

  const selectedServer = $derived(
    $servers.find((s) => s.id === $selectedServerId) ?? null,
  );
</script>

<div class="trakt-plex-settings">
  <SettingsBlock
    title={m.header_plex_sync()}
    description={m.description_plex_sync()}
  >
    <SettingsRow title={m.label_plex_connection()}>
      {#snippet action()}
        <PlexConnect
          isConnected={$isConnected}
          authState={$authState}
          onStartAuth={startAuth}
          onConfirmAuth={confirmAuth}
          onCancelAuth={cancelAuth}
          onDisconnect={disconnect}
        />
      {/snippet}
    </SettingsRow>

    {#if $isConnected}
      {#if $servers.length > 1}
        <PlexServers
          servers={$servers}
          selectedServerId={$selectedServerId}
          isSyncing={$isSyncing}
          onSelectServer={selectServer}
          onSyncNow={syncNow}
        />
      {/if}

      {#if selectedServer}
        <PlexServerCard
          serverId={selectedServer.id}
          serverName={selectedServer.name}
          isSyncing={$isSyncing}
          onSyncNow={syncNow}
        />
      {/if}
    {/if}
  </SettingsBlock>

  {#if $isConnected}
    <PlexSyncSettings />
    <PlexSyncHistory />
  {/if}
</div>

<style>
  .trakt-plex-settings {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xxl);

    max-width: var(--ni-800);
  }
</style>
