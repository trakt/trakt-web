<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import Button from "$lib/components/buttons/Button.svelte";
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import DeleteIcon from "$lib/components/icons/DeleteIcon.svelte";
  import PlexLibraryIcon from "$lib/components/icons/PlexLibraryIcon.svelte";
  import Switch from "$lib/components/toggles/Switch.svelte";
  import { ConfirmationType } from "$lib/features/confirmation/models/ConfirmationType.ts";
  import { useConfirm } from "$lib/features/confirmation/useConfirm.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaSyncConnection } from "$lib/requests/media-sync/models/MediaSyncConnection.ts";
  import type { MediaSyncFeed } from "$lib/requests/media-sync/models/MediaSyncFeed.ts";
  import { iffy } from "$lib/utils/function/iffy.ts";
  import SettingsGroupCard from "../SettingsGroupCard.svelte";
  import SettingsGroupRow from "../SettingsGroupRow.svelte";
  import SyncLoadError from "../SyncLoadError.svelte";
  import PlexFeedSwitches from "./PlexFeedSwitches.svelte";
  import PlexProfilePicker from "./PlexProfilePicker.svelte";
  import PlexProfilePickerSkeleton from "./PlexProfilePickerSkeleton.svelte";
  import { toManageChanges } from "./toManageChanges.ts";
  import { useManageServer } from "./useManageServer.ts";

  const {
    connection,
    onClose,
  }: {
    connection: MediaSyncConnection;
    onClose: () => void;
  } = $props();

  const { accounts, save, remove, isBusy } = useManageServer(
    iffy(() => connection.id),
  );
  const { confirm } = useConfirm();

  const serverLabel = $derived(connection.serverName ?? m.label_plex_server());

  let enabledLibraryIds = $state(
    iffy(() =>
      connection.libraries
        .filter((library) => library.enabled)
        .map((library) => library.id)
    ),
  );
  let feeds = $state(iffy(() => connection.feeds));
  let pickedAccountId = $state<string | null>(null);
  let hasWriteFailed = $state(false);

  const currentAccountId = $derived(
    $accounts?.find((account) => account.selected)?.accountId ?? null,
  );

  const changes = $derived(
    toManageChanges({
      libraries: connection.libraries,
      enabledLibraryIds,
      currentFeeds: connection.feeds,
      feeds,
      currentAccountId,
      accountId: pickedAccountId ?? currentAccountId,
    }),
  );
  const hasChanges = $derived(Object.keys(changes).length > 0);

  function isRemoving(libraryId: number): boolean {
    const library = connection.libraries.find(({ id }) => id === libraryId);
    return Boolean(library?.enabled) && !enabledLibraryIds.includes(libraryId);
  }

  function toggleLibrary(libraryId: number) {
    enabledLibraryIds = enabledLibraryIds.includes(libraryId)
      ? enabledLibraryIds.filter((id) => id !== libraryId)
      : [...enabledLibraryIds, libraryId];
  }

  function toggleFeed(feed: MediaSyncFeed) {
    feeds = feeds.includes(feed)
      ? feeds.filter((current) => current !== feed)
      : [...feeds, feed];
  }

  async function onApply() {
    hasWriteFailed = false;

    if (await save(changes)) {
      onClose();
      return;
    }

    hasWriteFailed = true;
  }

  const confirmRemove = $derived(
    confirm({
      type: ConfirmationType.RemoveMediaSyncServer,
      server: serverLabel,
      onConfirm: async () => {
        if (await remove()) {
          onClose();
          return;
        }

        hasWriteFailed = true;
      },
    }),
  );

  function handleClose() {
    if (!hasChanges) {
      onClose();
      return;
    }

    confirm({
      type: ConfirmationType.DiscardChanges,
      onConfirm: onClose,
    })();
  }
</script>

{#snippet badge()}
  <ActionButton
    size="small"
    variant="secondary"
    style="ghost"
    color="red"
    label={m.button_label_plex_remove_server({ server: serverLabel })}
    disabled={$isBusy}
    onclick={confirmRemove}
  >
    <DeleteIcon />
  </ActionButton>
{/snippet}

<Drawer onClose={handleClose} title={serverLabel} size="auto" {badge}>
  <div class="trakt-plex-manage-drawer">
    {#if hasWriteFailed}
      <SyncLoadError message={m.error_text_failed_update()} variant="plain" />
    {/if}

    {#if !$accounts}
      <PlexProfilePickerSkeleton />
    {:else if $accounts.length > 1}
      <PlexProfilePicker
        accounts={$accounts}
        pickedAccountId={pickedAccountId ?? currentAccountId}
        onPick={(accountId) => (pickedAccountId = accountId)}
      />
    {/if}

    <PlexFeedSwitches {feeds} onToggle={toggleFeed} />

    <SettingsGroupCard variant="bare" title={m.header_media_sync_libraries()}>
      {#each connection.libraries as library (library.id)}
        <SettingsGroupRow
          title={library.title}
          description={isRemoving(library.id)
            ? m.text_media_sync_library_removal()
            : undefined}
          variant="custom"
        >
          {#snippet icon()}<PlexLibraryIcon />{/snippet}
          <Switch
            label={library.title}
            checked={enabledLibraryIds.includes(library.id)}
            onclick={() => toggleLibrary(library.id)}
          />
        </SettingsGroupRow>
      {/each}
    </SettingsGroupCard>

    <div class="drawer-actions">
      <Button
        size="small"
        variant="secondary"
        color="default"
        label={m.button_label_cancel()}
        disabled={$isBusy}
        onclick={handleClose}
      >
        {m.button_text_cancel()}
      </Button>
      <Button
        size="small"
        variant="primary"
        color="purple"
        label={m.button_label_apply()}
        disabled={$isBusy ||
          !hasChanges ||
          enabledLibraryIds.length === 0 ||
          feeds.length === 0}
        onclick={onApply}
      >
        {m.button_text_apply()}
      </Button>

      {#if enabledLibraryIds.length === 0}
        <p class="library-hint secondary small">
          {m.text_plex_library_required()}
        </p>
      {/if}

      {#if feeds.length === 0}
        <p class="library-hint secondary small">
          {m.text_media_sync_feed_required()}
        </p>
      {/if}
    </div>
  </div>
</Drawer>

<style lang="scss">
  .trakt-plex-manage-drawer {
    display: flex;
    flex-direction: column;
    gap: var(--gap-l);
  }

  .library-hint {
    margin: 0;
    text-align: end;
  }

  .drawer-actions {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
  }
</style>
