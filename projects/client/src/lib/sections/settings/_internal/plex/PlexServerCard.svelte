<script lang="ts">
  import Button from '$lib/components/buttons/Button.svelte';
  import * as m from '$lib/features/i18n/messages.ts';
  import { useQuery } from '$lib/features/query/useQuery.ts';
  import { plexServerAccountsQuery } from '$lib/requests/plex/plexServerAccountsQuery.ts';
  import { plexSettingsQuery } from '$lib/requests/plex/plexSettingsQuery.ts';
  import { plexUpdateSettingsRequest } from '$lib/requests/plex/plexUpdateSettingsRequest.ts';
  import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
  import { useInvalidator } from '$lib/stores/useInvalidator.ts';
  import { map } from 'rxjs';

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

  const { invalidate } = useInvalidator();

  const serverAccounts = useQuery(plexServerAccountsQuery({ serverId })).pipe(
    map((q) => q.data),
  );

  const plexSettings = useQuery(plexSettingsQuery()).pipe(
    map((q) => q.data),
  );

  type LibraryState = {
    id: number;
    uuid: string;
    title: string;
    type: string;
    isSelected: boolean;
  };

  let libraries = $state<LibraryState[]>([]);
  let selectedUserId = $state<string>('');

  $effect(() => {
    const data = $serverAccounts;
    if (!data) return;
    libraries = data.libraries.map((lib) => ({ ...lib }));
  });

  $effect(() => {
    const settings = $plexSettings;
    if (!settings) return;
    const userIds = settings.sync.selection.userIds;
    if (userIds.length > 0) {
      selectedUserId = userIds.at(0) ?? '';
    }
  });

  async function toggleLibrary(uuid: string) {
    const lib = libraries.find((l) => l.uuid === uuid);
    if (!lib) return;

    lib.isSelected = !lib.isSelected;

    const otherServerLibs = ($plexSettings?.sync.selection.libraryIds ?? [])
      .filter((l) => l.serverId !== serverId)
      .map((l) => ({ server_id: l.serverId, uuid: l.uuid }));

    const thisServerLibs = libraries
      .filter((l) => l.isSelected)
      .map((l) => ({ server_id: serverId, uuid: l.uuid }));

    await plexUpdateSettingsRequest({
      settings: {
        sync: {
          selection: { library_ids: [...otherServerLibs, ...thisServerLibs] },
        },
      },
    });

    await invalidate([InvalidateAction.Plex.Settings]);
  }

  async function selectAccount(userId: string) {
    selectedUserId = userId;
    await plexUpdateSettingsRequest({
      settings: {
        sync: { selection: { user_ids: userId ? [userId] : [] } },
      },
    });
  }
</script>

<div class="plex-server-card">
  <div class="plex-server-card-header">
    <span class="server-name bold">{serverName}</span>
    <Button size="small" color="purple" onclick={onSyncNow} disabled={isSyncing}>
      {m.button_plex_sync_now()}
    </Button>
  </div>

  {#if $serverAccounts}
    {#if $serverAccounts.accounts.length > 0}
      <div class="plex-sync-as-row">
        <span class="secondary">{m.label_plex_sync_as()}</span>
        <select
          class="plex-account-select"
          value={selectedUserId}
          onchange={(e) => selectAccount((e.target as HTMLSelectElement).value)}
        >
          <option value="">—</option>
          {#each $serverAccounts.accounts as account (account.id)}
            <option value={String(account.id)}>{account.name}</option>
          {/each}
        </select>
      </div>
    {/if}

    {#if libraries.length > 0}
      <table class="plex-library-table">
        <thead>
          <tr>
            <th class="secondary">{m.text_library()}</th>
            <th class="secondary">{m.label_plex_library_table_type()}</th>
            <th class="secondary sync-col">{m.label_plex_library_table_sync()}</th>
          </tr>
        </thead>
        <tbody>
          {#each libraries as lib (lib.uuid)}
            <tr>
              <td>{lib.title}</td>
              <td class="secondary">{lib.type}</td>
              <td class="sync-col">
                <input
                  type="checkbox"
                  checked={lib.isSelected}
                  onchange={() => toggleLibrary(lib.uuid)}
                  class="plex-library-checkbox"
                />
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
  {/if}
</div>

<style lang="scss">
  .plex-server-card {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);

    padding: var(--ni-16);
    border-radius: var(--border-radius-m);
    border: var(--border-thickness-xs) solid var(--color-border);
    background-color: var(--color-background-elevated);
  }

  .plex-server-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .plex-sync-as-row {
    display: flex;
    align-items: center;
    gap: var(--gap-m);
  }

  .plex-account-select {
    background: var(--color-input-background);
    color: var(--color-text-primary);
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius-s);
    padding: var(--ni-6) var(--ni-10);
    font-size: var(--font-size-text);
    cursor: pointer;
    min-width: var(--ni-160);
  }

  .plex-library-table {
    width: 100%;
    border-collapse: collapse;

    th,
    td {
      padding: var(--ni-8) var(--ni-4);
      text-align: left;

      &.sync-col {
        text-align: right;
        width: var(--ni-60);
      }
    }

    thead th {
      font-size: var(--font-size-label);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: var(--border-thickness-xs) solid var(--color-border);
    }

    tbody tr:not(:last-child) td {
      border-bottom: var(--border-thickness-xxs) solid
        color-mix(in srgb, var(--color-border) 50%, transparent);
    }
  }

  .plex-library-checkbox {
    accent-color: var(--color-background-purple);
    width: var(--ni-16);
    height: var(--ni-16);
    cursor: pointer;
  }
</style>
