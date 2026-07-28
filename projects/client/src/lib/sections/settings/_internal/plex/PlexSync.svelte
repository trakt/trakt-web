<script lang="ts">
  import LoadingIndicator from "$lib/components/icons/LoadingIndicator.svelte";
  import PlexLogo from "$lib/components/icons/PlexLogo.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { iffy } from "$lib/utils/function/iffy.ts";
  import { map } from "rxjs";
  import SettingsGroupCard from "../SettingsGroupCard.svelte";
  import SettingsGroupRow from "../SettingsGroupRow.svelte";
  import SettingsStatusBadge from "../SettingsStatusBadge.svelte";
  import SettingsVipUpsell from "../SettingsVipUpsell.svelte";
  import PlexConnect from "./PlexConnect.svelte";
  import PlexSyncedServers from "./PlexSyncedServers.svelte";
  import PlexSyncHistory from "./PlexSyncHistory.svelte";
  import PlexSyncSettings from "./PlexSyncSettings.svelte";
  import { usePlexSelectedLibraries } from "./usePlexSelectedLibraries.ts";
  import { usePlexSync } from "./usePlexSync.ts";

  const {
    isConnected,
    servers,
    authState,
    isSyncing,
    startAuth,
    disconnect,
    syncNow,
  } = iffy(() => usePlexSync());

  const hasSyncedServers = usePlexSelectedLibraries().pipe(
    map((libraries) => libraries.length > 0),
  );
</script>

{#snippet plexIcon()}
  <PlexLogo />
{/snippet}

<div class="trakt-plex-settings">
  {#if $isConnected === false}
    <RenderFor audience="free">
      <SettingsVipUpsell
        icon={plexIcon}
        title={m.header_plex_sync_free_limits()}
        description={m.description_plex_sync_free_limits()}
        source="plex-settings-sync"
      />
    </RenderFor>
  {/if}

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
            <SettingsStatusBadge label={m.label_plex_connected()} />
          {/if}
        {/snippet}
        <PlexConnect
          isConnected={$isConnected}
          authState={$authState}
          onStartAuth={startAuth}
          onDisconnect={disconnect}
        />
      </SettingsGroupRow>
    {/if}
  </SettingsGroupCard>

  {#if $isConnected}
    <PlexSyncedServers
      servers={$servers}
      isSyncing={$isSyncing}
      onSyncNow={syncNow}
    />

    {#if $hasSyncedServers}
      <PlexSyncSettings />
    {/if}

    <PlexSyncHistory />
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .loading-container {
    padding: var(--gap-l);
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
