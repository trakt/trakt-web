<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import JellyfinLogo from "$lib/components/icons/JellyfinLogo.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useQuery } from "$lib/features/query/useQuery.ts";
  import type { VipUpsellSource } from "$lib/features/upsell/models/VipUpsellSource.ts";
  import { mediaSyncConnectionsQuery } from "$lib/requests/media-sync/mediaSyncConnectionsQuery.ts";
  import { map } from "rxjs";
  import { slide } from "svelte/transition";
  import SettingsGroupCard from "../SettingsGroupCard.svelte";
  import SettingsGroupRow from "../SettingsGroupRow.svelte";
  import SettingsGroupRowSkeleton from "../SettingsGroupRowSkeleton.svelte";
  import SettingsPill from "../SettingsPill.svelte";
  import SettingsVipUpsell from "../SettingsVipUpsell.svelte";
  import SyncLoadError from "../SyncLoadError.svelte";
  import JellyfinConnectDrawer from "./JellyfinConnectDrawer.svelte";
  import SyncedServers from "./SyncedServers.svelte";
  import { useJellyfinConnect } from "./useJellyfinConnect.ts";

  const query = useQuery(mediaSyncConnectionsQuery({}));

  const connections = query.pipe(
    map(({ data }) =>
      data?.filter((connection) =>
        connection.provider === "jellyfin" &&
        connection.status !== "disconnected"
      )
    ),
  );
  const hasFailed = query.pipe(map(({ isError }) => isError));

  let isConnecting = $state(false);

  const connect = useJellyfinConnect({
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

  const { user } = useUser();
  let isUpsellVisible = $state(false);

  const isConnected = $derived(($connections?.length ?? 0) > 0);
  const isLocked = $derived(!$user.isVip && !isConnected);

  function addServer() {
    if ($user.isVip) {
      startConnect();
      return;
    }
    isUpsellVisible = !isUpsellVisible;
  }
</script>

{#snippet jellyfinIcon()}
  <span class="upsell-logo"><JellyfinLogo /></span>
{/snippet}

{#snippet upsell(source: VipUpsellSource)}
  <SettingsVipUpsell
    icon={jellyfinIcon}
    title={m.header_jellyfin_vip_upsell()}
    description={m.description_jellyfin_vip_upsell()}
    {source}
  />
{/snippet}

<div class="trakt-jellyfin-sync">
  {#if $connections && !$hasFailed && isLocked}
    {@render upsell("jellyfin-settings-sync")}
  {:else}
    <SettingsGroupCard>
      {#if $hasFailed}
        <SyncLoadError variant="plain" />
      {:else if !$connections}
        <SettingsGroupRowSkeleton />
      {:else}
        <SettingsGroupRow
          title={m.label_media_server_jellyfin()}
          description={isConnected
            ? m.description_media_sync_add_jellyfin_server()
            : m.description_jellyfin_sync()}
          variant="custom"
        >
          {#snippet icon()}<JellyfinLogo />{/snippet}
          {#snippet tag()}
            <SettingsPill label={m.badge_text_beta()} />
          {/snippet}
          {#if isConnected}
            <Button
              size="small"
              color="default"
              label={m.button_label_jellyfin_add_server()}
              onclick={addServer}
            >
              {m.button_plex_add_server()}
            </Button>
          {:else}
            <Button
              size="small"
              color="default"
              label={m.button_label_jellyfin_connect()}
              onclick={startConnect}
            >
              {m.button_connect_jellyfin()}
            </Button>
          {/if}
        </SettingsGroupRow>
      {/if}
    </SettingsGroupCard>
  {/if}

  {#if isUpsellVisible}
    <div transition:slide={{ duration: 150, axis: "y" }}>
      {@render upsell("jellyfin-settings-add-server")}
    </div>
  {/if}

  {#if isConnected}
    <SyncedServers
      title={m.header_jellyfin_synced_servers()}
      description={m.description_jellyfin_synced_servers()}
      connections={$connections ?? []}
      onReconnect={startConnect}
    />
  {/if}
</div>

{#if isConnecting}
  <JellyfinConnectDrawer
    flow={$connectState}
    onSignIn={connect.signIn}
    onBackToSignIn={connect.start}
    onToggleFeed={connect.toggleFeed}
    onChooseImportHistory={connect.chooseImportHistory}
    onToggleLibrary={connect.toggleLibrary}
    onConnect={connect.connect}
    onClose={closeConnect}
  />
{/if}

<style lang="scss">
  .trakt-jellyfin-sync {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xl);
    min-width: 0;
  }

  .upsell-logo {
    display: inline-flex;
    justify-content: center;
    width: var(--ni-40);
  }
</style>
