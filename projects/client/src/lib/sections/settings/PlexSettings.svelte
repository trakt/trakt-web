<script lang="ts">
  import CheckIcon from "$lib/components/icons/CheckIcon.svelte";
  import LoadingIndicator from "$lib/components/icons/LoadingIndicator.svelte";
  import PlexLogo from "$lib/components/icons/PlexLogo.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import SettingsGroupCard from "./_internal/SettingsGroupCard.svelte";
  import SettingsGroupRow from "./_internal/SettingsGroupRow.svelte";
  import SettingsSectionLabel from "./_internal/SettingsSectionLabel.svelte";
  import PlexConnect from "./_internal/plex/PlexConnect.svelte";
  import PlexServerCard from "./_internal/plex/PlexServerCard.svelte";
  import PlexServers from "./_internal/plex/PlexServers.svelte";
  import PlexSyncHistory from "./_internal/plex/PlexSyncHistory.svelte";
  import PlexSyncSettings from "./_internal/plex/PlexSyncSettings.svelte";
  import { usePlexSync } from "./_internal/plex/usePlexSync.ts";

  const {
    isConnected,
    servers,
    authState,
    selectedServerId,
    isSyncing,
    startAuth,
    disconnect,
    selectServer,
    syncNow,
  } = usePlexSync();

  const selectedServer = $derived(
    $servers.find((s) => s.id === $selectedServerId) ?? null,
  );
</script>

<div class="trakt-plex-settings">
  <SettingsSectionLabel title={m.header_plex_sync()} />

  <SettingsGroupCard>
    {#if $isConnected === null}
      <div class="loading-container">
        <LoadingIndicator />
      </div>
    {:else}
      <SettingsGroupRow
        title={m.label_plex_connection()}
        description={m.description_plex_sync()}
        variant="custom"
      >
        {#snippet icon()}<PlexLogo />{/snippet}
        {#snippet tag()}
          {#if $isConnected}
            <span class="connected-badge bold tag">
              <CheckIcon />
              {m.label_plex_connected()}
            </span>
          {/if}
        {/snippet}
        <PlexConnect
          isConnected={$isConnected}
          authState={$authState}
          onStartAuth={startAuth}
          onDisconnect={disconnect}
        />
      </SettingsGroupRow>

      {#if $isConnected && $servers.length > 1}
        <PlexServers
          servers={$servers}
          selectedServerId={$selectedServerId}
          onSelectServer={selectServer}
        />
      {/if}
    {/if}
  </SettingsGroupCard>

  {#if $isConnected && selectedServer}
    {#key selectedServer.id}
      <PlexServerCard
        serverId={selectedServer.id}
        serverName={selectedServer.name}
        isSyncing={$isSyncing}
        onSyncNow={syncNow}
      />
    {/key}
  {/if}

  {#if $isConnected}
    <PlexSyncSettings />
    <PlexSyncHistory />
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .loading-container {
    padding: var(--gap-l);
  }

  .connected-badge {
    display: inline-flex;
    align-items: center;
    gap: var(--gap-xxs);

    padding: var(--ni-2) var(--ni-8);
    border-radius: var(--border-radius-xl);

    background: color-mix(in srgb, var(--green-500) 10%, transparent);
    color: var(--green-500);

    :global(svg) {
      width: var(--ni-10);
      height: var(--ni-10);
    }
  }

  .trakt-plex-settings {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);
    min-width: 0;

    @include for-tablet-sm-and-below {
      padding: 0;
    }
  }
</style>
