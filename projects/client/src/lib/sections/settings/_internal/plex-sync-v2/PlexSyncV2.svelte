<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import PlexLogo from "$lib/components/icons/PlexLogo.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useQuery } from "$lib/features/query/useQuery.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { mediaSyncConnectionsQuery } from "$lib/requests/media-sync/mediaSyncConnectionsQuery.ts";
  import { map } from "rxjs";
  import SettingsGroupCard from "../SettingsGroupCard.svelte";
  import SettingsGroupRow from "../SettingsGroupRow.svelte";
  import SettingsGroupRowSkeleton from "../SettingsGroupRowSkeleton.svelte";
  import SettingsSection from "../SettingsSection.svelte";
  import SettingsStatusBadge from "../SettingsStatusBadge.svelte";
  import SettingsVipUpsell from "../SettingsVipUpsell.svelte";
  import SyncLoadError from "../SyncLoadError.svelte";
  import PlexConnectDrawer from "./PlexConnectDrawer.svelte";
  import PlexSyncServerRow from "./PlexSyncServerRow.svelte";
  import { usePlexConnect } from "./usePlexConnect.ts";

  const query = useQuery(mediaSyncConnectionsQuery({}));

  const connections = query.pipe(
    map(({ data }) =>
      data?.filter((connection) =>
        connection.provider === "plex" && connection.status !== "disconnected"
      )
    ),
  );
  const hasFailed = query.pipe(map(({ isError }) => isError));

  let isConnecting = $state(false);

  const connect = usePlexConnect({
    onConnected: () => (isConnecting = false),
  });
  const connectState = connect.state;

  function startConnect() {
    isConnecting = true;
    connect.start();
  }

  function closeConnect() {
    connect.cancel();
    isConnecting = false;
  }

  const isConnected = $derived(($connections?.length ?? 0) > 0);
</script>

{#snippet plexIcon()}
  <PlexLogo />
{/snippet}

<div class="trakt-plex-sync-v2">
  {#if $connections && !isConnected}
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
    {#if $hasFailed}
      <SyncLoadError variant="plain" />
    {:else if !$connections}
      <SettingsGroupRowSkeleton />
    {:else}
      <SettingsGroupRow
        title={m.label_plex_connection()}
        description={m.description_plex_sync()}
        variant="custom"
      >
        {#snippet icon()}<PlexLogo />{/snippet}
        {#snippet tag()}
          {#if isConnected}
            <SettingsStatusBadge label={m.label_plex_connected()} />
          {/if}
        {/snippet}
        <Button
          size="small"
          color="default"
          label={m.button_label_plex_connect()}
          onclick={startConnect}
        >
          {m.button_connect_plex()}
        </Button>
      </SettingsGroupRow>
    {/if}
  </SettingsGroupCard>

  {#if isConnected}
    <SettingsSection
      title={m.header_plex_synced_servers()}
      description={m.description_plex_synced_servers()}
    >
      <SettingsGroupCard>
        {#each $connections ?? [] as connection (connection.id)}
          <PlexSyncServerRow {connection} onReconnect={startConnect} />
        {/each}
      </SettingsGroupCard>
    </SettingsSection>
  {/if}
</div>

{#if isConnecting}
  <PlexConnectDrawer
    state={$connectState}
    onOpenSignIn={connect.openSignIn}
    onChooseServer={connect.chooseServer}
    onChooseAccount={connect.chooseAccount}
    onToggleLibrary={connect.toggleLibrary}
    onConnect={connect.connect}
    onRestart={connect.start}
    onClose={closeConnect}
  />
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-plex-sync-v2 {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xl);
    min-width: 0;

    @include for-tablet-sm-and-below {
      padding: 0;
    }
  }
</style>
