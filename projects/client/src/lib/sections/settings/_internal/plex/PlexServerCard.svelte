<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import LoadingIndicator from "$lib/components/icons/LoadingIndicator.svelte";
  import PlexLibraryIcon from "$lib/components/icons/PlexLibraryIcon.svelte";
  import ProfileIcon from "$lib/components/icons/ProfileIcon.svelte";
  import SingleSelect from "$lib/components/select/SingleSelect.svelte";
  import Switch from "$lib/components/toggles/Switch.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { iffy } from "$lib/utils/function/iffy.ts";
  import SettingsGroupCard from "../SettingsGroupCard.svelte";
  import SettingsGroupRow from "../SettingsGroupRow.svelte";
  import { usePlexServer } from "./usePlexServer.ts";

  const {
    serverId,
    serverName,
    isSyncing,
    onSyncNow,
  }: {
    serverId: string;
    serverName: string;
    isSyncing: boolean;
    onSyncNow: () => void;
  } = $props();

  const {
    isLoadingAccounts,
    serverAccounts,
    libraries,
    selectedUserId,
    toggleLibrary,
    selectAccount,
  } = usePlexServer({ serverId: iffy(() => serverId) });

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

<div class="trakt-plex-server-settings">
  <div class="plex-server-header">
    <span class="server-name">{serverName}</span>
    <Button
      size="small"
      color="purple"
      label={m.button_label_plex_sync_now()}
      onclick={onSyncNow}
      disabled={isSyncing}
    >
      {m.button_plex_sync_now()}
    </Button>
  </div>

  <SettingsGroupCard>
    {#if $isLoadingAccounts}
      <div class="loading-container">
        <LoadingIndicator />
      </div>
    {:else if $serverAccounts}
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
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-plex-server-settings {
    display: flex;
    flex-direction: column;
    gap: 0;
    max-width: var(--ni-640);
  }

  .plex-server-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: var(--gap-m) var(--ni-0) var(--gap-xs);

    @include for-tablet-sm-and-below {
      padding: var(--gap-m) var(--gap-m) var(--gap-xs);
    }
  }

  .server-name {
    font-size: var(--font-size-title);
    font-weight: bold;
    color: var(--color-text-primary);
  }

  .loading-container {
    padding: var(--gap-l);
  }
</style>
