<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import ServerIcon from "$lib/components/icons/ServerIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { getLocale } from "$lib/features/i18n";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { MediaSyncConnection } from "$lib/requests/media-sync/models/MediaSyncConnection.ts";
  import { iffy } from "$lib/utils/function/iffy.ts";
  import { toHumanDate } from "$lib/utils/formatting/date/toHumanDate.ts";
  import SettingsGroupRow from "../SettingsGroupRow.svelte";
  import { PLEX_ACCOUNT_SERVER_ID } from "./PLEX_ACCOUNT_SERVER_ID.ts";
  import PlexManageDrawer from "./PlexManageDrawer.svelte";
  import type { ServerSyncStatus } from "./models/ServerSyncStatus.ts";
  import { toServerSyncStatus } from "./toServerSyncStatus.ts";
  import { useServerActions } from "./useServerActions.ts";
  import { useSyncAccounts } from "./useSyncAccounts.ts";

  const {
    connection,
    onReconnect,
  }: {
    connection: MediaSyncConnection;
    onReconnect: () => void;
  } = $props();

  const { syncNow, retry, isBusy } = useServerActions(
    iffy(() => connection.id),
  );

  const accounts = useSyncAccounts(iffy(() => connection.id));

  $effect(() => {
    const subscription = accounts.subscribe();
    return () => subscription.unsubscribe();
  });

  let isManaging = $state(false);

  const status = $derived(toServerSyncStatus(connection));

  const needsAttention = $derived(
    status.kind === "unreachable" || status.kind === "unauthorized",
  );

  const isAccountOnly = $derived(
    connection.serverId === PLEX_ACCOUNT_SERVER_ID,
  );

  const libraryTitles = $derived(
    connection.libraries
      .filter((library) => library.enabled)
      .map((library) => library.title)
      .join(", "),
  );

  function toStatusText(current: ServerSyncStatus): string {
    switch (current.kind) {
      case "synced":
        return m.description_media_sync_synced_at({
          when: toHumanDate(new Date(), current.at, getLocale()),
        });
      case "never":
        return m.description_media_sync_never_synced();
      case "paused":
        return m.description_media_sync_paused();
      case "unreachable":
        return m.description_media_sync_unreachable();
      case "unauthorized":
        return m.description_media_sync_unauthorized();
    }
  }

  const description = $derived(
    [libraryTitles, toStatusText(status)].filter(Boolean).join(" · "),
  );
</script>

<SettingsGroupRow
  title={isAccountOnly
    ? m.label_media_sync_plex_watchlist()
    : connection.serverName ?? m.label_plex_server()}
  {description}
  variant="custom"
>
  {#snippet icon()}<ServerIcon />{/snippet}
  {#snippet tag()}
    {#if needsAttention}
      <span class="needs-attention bold tag">
        {m.tag_media_sync_needs_attention()}
      </span>
    {/if}
  {/snippet}

  {#if status.kind === "unreachable"}
    <Button
      size="small"
      color="purple"
      label={m.button_label_media_sync_retry()}
      onclick={retry}
      disabled={$isBusy}
    >
      {m.button_media_sync_retry()}
    </Button>
  {:else if status.kind === "unauthorized"}
    <Button
      size="small"
      color="purple"
      label={m.button_label_media_sync_reconnect()}
      onclick={onReconnect}
    >
      {m.button_media_sync_reconnect()}
    </Button>
  {:else}
    <RenderFor audience="vip">
      <Button
        size="small"
        color="purple"
        label={m.button_label_plex_sync_now()}
        onclick={syncNow}
        disabled={$isBusy || status.kind === "paused"}
      >
        {m.button_plex_sync_now()}
      </Button>
    </RenderFor>
  {/if}
  <Button
    size="small"
    color="purple"
    label={m.button_label_plex_manage_server()}
    onclick={() => (isManaging = true)}
  >
    {m.button_plex_manage_server()}
  </Button>
</SettingsGroupRow>

{#if isManaging}
  <PlexManageDrawer {connection} onClose={() => (isManaging = false)} />
{/if}

<style lang="scss">
  .needs-attention {
    flex-shrink: 0;

    padding: var(--ni-2) var(--ni-8);
    border-radius: var(--border-radius-xl);

    background: color-mix(in srgb, var(--orange-500) 10%, transparent);
    color: var(--orange-500);
  }
</style>
