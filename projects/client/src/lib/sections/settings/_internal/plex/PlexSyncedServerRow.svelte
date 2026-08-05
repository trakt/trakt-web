<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import CheckIcon from "$lib/components/icons/CheckIcon.svelte";
  import ServerIcon from "$lib/components/icons/ServerIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useQuery } from "$lib/features/query/useQuery.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { plexServerAccountsQuery } from "$lib/requests/plex/plexServerAccountsQuery.ts";
  import { iffy } from "$lib/utils/function/iffy.ts";
  import { map } from "rxjs";
  import SettingsGroupRow from "../SettingsGroupRow.svelte";

  const {
    serverId,
    serverName,
    libraryUuids,
    isSyncing,
    onSyncNow,
  }: {
    serverId: string;
    serverName: string;
    libraryUuids: string[];
    isSyncing: boolean;
    onSyncNow: (serverId: string) => void;
  } = $props();

  const libraries = useQuery(
    plexServerAccountsQuery({ serverId: iffy(() => serverId) }),
  ).pipe(
    map((query) => query.data?.libraries ?? []),
  );

  const libraryTitles = $derived(
    $libraries
      .filter((library) => libraryUuids.includes(library.uuid))
      .map((library) => library.title),
  );
</script>

<SettingsGroupRow
  title={serverName}
  description={libraryTitles.join(", ") || undefined}
  variant="custom"
>
  {#snippet icon()}<ServerIcon />{/snippet}
  {#snippet tag()}
    <span class="syncing-badge bold tag">
      <CheckIcon />
      {m.tag_plex_syncing()}
    </span>
  {/snippet}
  <RenderFor audience="vip">
    <Button
      size="small"
      color="purple"
      label={m.button_label_plex_sync_now()}
      onclick={() => onSyncNow(serverId)}
      disabled={isSyncing}
    >
      {m.button_plex_sync_now()}
    </Button>
  </RenderFor>
</SettingsGroupRow>

<style lang="scss">
  .syncing-badge {
    display: inline-flex;
    align-items: center;
    gap: var(--gap-xxs);

    padding: var(--ni-2) var(--ni-8);
    border-radius: var(--border-radius-xl);

    background: color-mix(in srgb, var(--green-500) 10%, transparent);
    color: var(--green-500);

    :global(svg) {
      width: var(--ni-10);
      height: var(--ni-10);
    }
  }
</style>
