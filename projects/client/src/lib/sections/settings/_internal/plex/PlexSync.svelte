<script lang="ts">
  import CheckIcon from "$lib/components/icons/CheckIcon.svelte";
  import LoadingIndicator from "$lib/components/icons/LoadingIndicator.svelte";
  import PlexLogo from "$lib/components/icons/PlexLogo.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { iffy } from "$lib/utils/function/iffy.ts";
  import SettingsGroupCard from "../SettingsGroupCard.svelte";
  import SettingsGroupRow from "../SettingsGroupRow.svelte";
  import PlexConnect from "./PlexConnect.svelte";
  import PlexServerCard from "./PlexServerCard.svelte";
  import PlexServers from "./PlexServers.svelte";
  import PlexSyncHistory from "./PlexSyncHistory.svelte";
  import PlexSyncSettings from "./PlexSyncSettings.svelte";
  import type { usePlexSync } from "./usePlexSync.ts";

  const { plex }: { plex: ReturnType<typeof usePlexSync> } = $props();

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
  } = iffy(() => plex);

  const selectedServer = $derived(
    $servers.find((s) => s.id === $selectedServerId) ?? null,
  );
</script>

<div class="trakt-plex-settings">
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
    gap: var(--gap-xl);
    min-width: 0;

    @include for-tablet-sm-and-below {
      padding: 0;
    }
  }
</style>
