<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import Button from "$lib/components/buttons/Button.svelte";
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import DeleteIcon from "$lib/components/icons/DeleteIcon.svelte";
  import LoadingIndicator from "$lib/components/icons/LoadingIndicator.svelte";
  import PlexLibraryIcon from "$lib/components/icons/PlexLibraryIcon.svelte";
  import ProfileIcon from "$lib/components/icons/ProfileIcon.svelte";
  import SingleSelect from "$lib/components/select/SingleSelect.svelte";
  import Switch from "$lib/components/toggles/Switch.svelte";
  import { ConfirmationType } from "$lib/features/confirmation/models/ConfirmationType.ts";
  import { useConfirm } from "$lib/features/confirmation/useConfirm.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import { iffy } from "$lib/utils/function/iffy.ts";
  import SettingsGroupCard from "../SettingsGroupCard.svelte";
  import SettingsGroupRow from "../SettingsGroupRow.svelte";
  import SyncLoadError from "../SyncLoadError.svelte";
  import { toPlexErrorCopy } from "./toPlexErrorCopy.ts";
  import { usePlexServer } from "./usePlexServer.ts";

  const {
    serverId,
    serverName,
    onClose,
    onRemoved,
  }: {
    serverId: string;
    serverName: string | undefined;
    onClose: () => void;
    onRemoved: () => void;
  } = $props();

  const {
    isLoadingAccounts,
    serverAccounts,
    accountsError,
    libraries,
    selectedUserId,
    hasSelection,
    hasChanges,
    toggleLibrary,
    selectAccount,
    saveChanges,
    removeServer,
  } = usePlexServer({ serverId: iffy(() => serverId) });

  const { confirm } = useConfirm();

  const serverLabel = $derived(serverName ?? m.label_plex_server());

  const accountsErrorCopy = $derived(toPlexErrorCopy($accountsError?.code));

  let isSaving = $state(false);
  let isRemoving = $state(false);
  let hasWriteFailed = $state(false);

  const isBusy = $derived(isSaving || isRemoving);

  async function onApply() {
    isSaving = true;
    hasWriteFailed = false;

    try {
      const success = await saveChanges();

      if (success) {
        onClose();
        return;
      }

      hasWriteFailed = true;
    } finally {
      isSaving = false;
    }
  }

  const confirmRemove = $derived(
    confirm({
      type: ConfirmationType.RemovePlexServer,
      server: serverLabel,
      onConfirm: async () => {
        isRemoving = true;

        try {
          const success = await removeServer();

          if (!success) {
            hasWriteFailed = true;
            return;
          }

          onRemoved();
        } finally {
          isRemoving = false;
        }
      },
    }),
  );

  function handleClose() {
    if (!$hasChanges) {
      onClose();
      return;
    }

    confirm({
      type: ConfirmationType.DiscardChanges,
      onConfirm: onClose,
    })();
  }

  const noneAccount = "__none__";

  const accountOptions = $derived([
    { value: noneAccount, label: "—" },
    ...($serverAccounts?.accounts ?? []).map((account) => ({
      value: String(account.id),
      label: account.name,
    })),
  ]);

  const selectedAccountValue = $derived(
    $selectedUserId === "" ? noneAccount : $selectedUserId,
  );
</script>

{#snippet badge()}
  <ActionButton
    size="small"
    variant="secondary"
    style="ghost"
    color="red"
    label={m.button_label_plex_remove_server({ server: serverLabel })}
    disabled={isBusy}
    onclick={confirmRemove}
  >
    <DeleteIcon />
  </ActionButton>
{/snippet}

<Drawer onClose={handleClose} title={serverLabel} size="auto" {badge}>
  <SettingsGroupCard variant="bare">
    {#if $isLoadingAccounts}
      <div class="loading-container">
        <LoadingIndicator />
      </div>
    {:else if $accountsError}
      <SyncLoadError
        {...accountsErrorCopy}
        variant="plain"
        onRetry={$accountsError.retry}
      />
    {:else if $serverAccounts}
      {#if hasWriteFailed}
        <SyncLoadError message={m.error_text_failed_update()} variant="plain" />
      {/if}

      {#if $serverAccounts.accounts.length > 0}
        <SettingsGroupRow title={m.label_plex_sync_as()} variant="custom">
          {#snippet icon()}<ProfileIcon />{/snippet}
          <SingleSelect
            options={accountOptions}
            value={selectedAccountValue}
            placeholder={m.label_plex_sync_as()}
            autoWidth
            onChange={(value) =>
              selectAccount(value === noneAccount ? "" : value)}
          />
        </SettingsGroupRow>
      {/if}

      {#each $libraries as lib (lib.uuid)}
        <SettingsGroupRow
          title={lib.title}
          description={lib.type}
          variant="custom"
        >
          {#snippet icon()}<PlexLibraryIcon />{/snippet}
          <Switch
            label={lib.title}
            checked={lib.isSelected}
            onclick={() => toggleLibrary(lib.uuid)}
            color="purple"
          />
        </SettingsGroupRow>
      {/each}
    {/if}
  </SettingsGroupCard>

  <div class="drawer-actions">
    <Button
      size="small"
      variant="secondary"
      color="default"
      label={m.button_label_cancel()}
      disabled={isBusy}
      onclick={handleClose}
    >
      {m.button_text_cancel()}
    </Button>
    <Button
      size="small"
      variant="primary"
      color="purple"
      label={m.button_label_apply()}
      disabled={isBusy || !$hasChanges || !$hasSelection}
      onclick={onApply}
    >
      {m.button_text_apply()}
    </Button>

    {#if $serverAccounts && !$hasSelection}
      <p class="library-hint secondary small">
        {m.text_plex_library_required()}
      </p>
    {/if}
  </div>
</Drawer>

<style lang="scss">
  .library-hint {
    margin: 0;
    text-align: end;
  }

  .drawer-actions {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);

    padding-top: var(--gap-m);
  }

  .loading-container {
    display: flex;
    justify-content: center;

    padding: var(--gap-l);
  }
</style>
