<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import PopupMenu from "$lib/components/buttons/popup/PopupMenu.svelte";
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import LoadingIndicator from "$lib/components/icons/LoadingIndicator.svelte";
  import PlexLogo from "$lib/components/icons/PlexLogo.svelte";
  import PlusIcon from "$lib/components/icons/PlusIcon.svelte";
  import ServerIcon from "$lib/components/icons/ServerIcon.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import { slide } from "svelte/transition";
  import SettingsGroupCard from "../SettingsGroupCard.svelte";
  import SettingsHighlightCard from "../SettingsHighlightCard.svelte";
  import SettingsSection from "../SettingsSection.svelte";
  import SettingsVipUpsell from "../SettingsVipUpsell.svelte";
  import SyncLoadError from "../SyncLoadError.svelte";
  import PlexSyncedServerRow from "./PlexSyncedServerRow.svelte";
  import type { PlexSyncedServersProps } from "./PlexSyncedServersProps.ts";
  import { usePlexSelectedLibraries } from "./usePlexSelectedLibraries.ts";

  // FIXME: replace with sync.server_limit from plexSettingsQuery once
  // @trakt/api ships it (merged in ef2722b, unreleased as of 0.5.4).
  const FREE_SERVER_LIMIT = 1;

  const {
    servers,
    serversState,
    isSyncing,
    onSyncNow,
    onRetryServers,
  }: PlexSyncedServersProps = $props();

  const { user } = useUser();
  const isVip = $derived($user?.isVip ?? false);

  const selectedLibraries = usePlexSelectedLibraries();

  let pendingServerIds = $state<string[]>([]);
  let isUpsellVisible = $state(false);

  const persistedServers = $derived.by(() => {
    const serverIds = [
      ...new Set($selectedLibraries.map((library) => library.serverId)),
    ];

    return serverIds.map((serverId) => ({
      serverId,
      libraryUuids: $selectedLibraries
        .filter((library) => library.serverId === serverId)
        .map((library) => library.uuid),
    }));
  });

  const syncedServers = $derived.by(() => {
    const persistedIds = persistedServers.map((server) => server.serverId);
    const pending = pendingServerIds
      .filter((serverId) => !persistedIds.includes(serverId))
      .map((serverId) => ({ serverId, libraryUuids: [] as string[] }));

    return [...persistedServers, ...pending].map((server) => ({
      ...server,
      serverName: servers.find(({ id }) => id === server.serverId)?.name,
      isPending: !persistedIds.includes(server.serverId),
    }));
  });

  const candidateServers = $derived(
    servers.filter(
      (server) => !syncedServers.some(({ serverId }) => serverId === server.id),
    ),
  );

  const isAtFreeLimit = $derived(
    !isVip && syncedServers.length >= FREE_SERVER_LIMIT,
  );

  function addServer(serverId: string) {
    pendingServerIds = [...pendingServerIds, serverId];
  }

  function forgetServer(serverId: string) {
    pendingServerIds = pendingServerIds.filter((id) => id !== serverId);
  }
</script>

{#snippet plexIcon()}
  <PlexLogo />
{/snippet}

{#snippet emptyIcon()}
  <span class="empty-icon"><ServerIcon /></span>
{/snippet}

{#snippet emptyPrimary()}
  <span class="bold">{m.header_plex_no_synced_servers()}</span>
{/snippet}

{#snippet emptySecondary()}
  {m.description_plex_no_synced_servers()}
{/snippet}

{#snippet addServerAction()}
  {#if isAtFreeLimit}
    <ActionButton
      size="small"
      style="ghost"
      label={m.button_label_plex_add_server()}
      onclick={() => (isUpsellVisible = !isUpsellVisible)}
    >
      <PlusIcon />
    </ActionButton>
  {:else}
    <PopupMenu
      size="small"
      mode="standalone"
      label={m.button_label_plex_add_server()}
      title={m.button_plex_add_server()}
      disabled={candidateServers.length === 0}
    >
      {#snippet icon()}<PlusIcon />{/snippet}
      {#snippet items()}
        {#each candidateServers as server (server.id)}
          <DropdownItem onclick={() => addServer(server.id)}>
            {server.name}
          </DropdownItem>
        {/each}
      {/snippet}
    </PopupMenu>
  {/if}
{/snippet}

<div class="trakt-plex-synced-servers">
  <SettingsSection
    title={m.header_plex_synced_servers()}
    description={m.description_plex_synced_servers()}
    action={addServerAction}
  >
    {#if isUpsellVisible}
      <div transition:slide={{ duration: 150, axis: "y" }}>
        <SettingsVipUpsell
          icon={plexIcon}
          title={m.header_plex_vip_upsell_add_server()}
          description={m.description_plex_vip_upsell_add_server()}
          source="plex-settings-add-server"
        />
      </div>
    {/if}

    <SettingsGroupCard>
      {#if serversState === "error"}
        <SyncLoadError
          variant="plain"
          message={m.error_text_plex_unavailable()}
          hint={m.error_text_plex_unavailable_hint()}
          onRetry={onRetryServers}
        />
      {/if}

      {#each syncedServers as synced (synced.serverId)}
        <PlexSyncedServerRow
          serverId={synced.serverId}
          serverName={synced.serverName}
          libraryUuids={synced.libraryUuids}
          initiallyManaging={synced.isPending}
          {isSyncing}
          {onSyncNow}
          onForget={forgetServer}
        />
      {:else}
        {#if serversState === "loading"}
          <div class="loading-container">
            <LoadingIndicator />
          </div>
        {:else if serversState === "loaded"}
          <SettingsHighlightCard
            icon={emptyIcon}
            primary={emptyPrimary}
            secondary={emptySecondary}
          />
        {/if}
      {/each}
    </SettingsGroupCard>
  </SettingsSection>
</div>

<style lang="scss">
  .trakt-plex-synced-servers {
    .loading-container {
      display: flex;
      justify-content: center;

      padding: var(--gap-l);
    }

    .empty-icon {
      display: flex;
      align-items: center;
      justify-content: center;

      width: var(--ni-36);
      height: var(--ni-36);
      border-radius: var(--border-radius-m);

      background: color-mix(in srgb, var(--purple-500) 15%, transparent);
      color: var(--purple-500);

      :global(svg) {
        width: var(--ni-20);
        height: var(--ni-20);
      }
    }
  }
</style>
