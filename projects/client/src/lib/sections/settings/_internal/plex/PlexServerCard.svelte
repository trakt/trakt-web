<script lang="ts">
  import LoadingIndicator from "$lib/components/icons/LoadingIndicator.svelte";
  import PlexLibraryIcon from "$lib/components/icons/PlexLibraryIcon.svelte";
  import ProfileIcon from "$lib/components/icons/ProfileIcon.svelte";
  import SingleSelect from "$lib/components/select/SingleSelect.svelte";
  import Switch from "$lib/components/toggles/Switch.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { PlexServer } from "$lib/requests/plex/plexServersQuery.ts";
  import { iffy } from "$lib/utils/function/iffy.ts";
  import SettingsGroupCard from "../SettingsGroupCard.svelte";
  import SettingsGroupRow from "../SettingsGroupRow.svelte";
  import { usePlexServer } from "./usePlexServer.ts";

  const {
    serverId,
    serverName,
    servers,
    onSelectServer,
  }: {
    serverId: string;
    serverName: string;
    servers: PlexServer[];
    onSelectServer: (id: string) => void;
  } = $props();

  const serverOptions = $derived(
    servers.map((server) => ({ value: server.id, label: server.name })),
  );

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

{#snippet serverPicker()}
  {#if servers.length > 1}
    <SingleSelect
      options={serverOptions}
      value={serverId}
      placeholder={m.label_plex_server()}
      autoWidth
      onChange={onSelectServer}
    />
  {:else}
    <span class="secondary">{serverName}</span>
  {/if}
{/snippet}

<div class="trakt-plex-server-settings">
  <SettingsGroupCard
    title={m.header_plex_server_settings()}
    description={m.description_plex_server()}
    action={serverPicker}
  >
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
  .trakt-plex-server-settings {
    display: flex;
    flex-direction: column;
    gap: 0;
    max-width: var(--ni-640);
  }

  .loading-container {
    padding: var(--gap-l);
  }
</style>
