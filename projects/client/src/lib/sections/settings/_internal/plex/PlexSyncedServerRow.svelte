<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import ServerIcon from "$lib/components/icons/ServerIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useQuery } from "$lib/features/query/useQuery.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { plexServerAccountsQuery } from "$lib/requests/plex/plexServerAccountsQuery.ts";
  import { iffy } from "$lib/utils/function/iffy.ts";
  import { map } from "rxjs";
  import SettingsGroupRow from "../SettingsGroupRow.svelte";
  import SettingsStatusBadge from "../SettingsStatusBadge.svelte";
  import PlexServerDrawerHost from "./PlexServerDrawerHost.svelte";

  const {
    serverId,
    serverName,
    libraryUuids,
    isSyncing,
    onSyncNow,
    onForget,
    initiallyManaging = false,
  }: {
    serverId: string;
    serverName: string;
    libraryUuids: string[];
    isSyncing: boolean;
    onSyncNow: (serverId: string) => void;
    onForget: (serverId: string) => void;
    initiallyManaging?: boolean;
  } = $props();

  let isManaging = $state(iffy(() => initiallyManaging));

  const libraries = useQuery(
    plexServerAccountsQuery({ serverId: iffy(() => serverId) }),
  ).pipe(
    map((query) =>
      query.data && !("errorCode" in query.data) ? query.data.libraries : []
    ),
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
      {#if libraryUuids.length > 0}
        <SettingsStatusBadge label={m.tag_plex_syncing()} />
      {/if}
    {/snippet}
    <RenderFor audience="vip">
      <Button
        size="small"
        color="purple"
        label={m.button_label_plex_sync_now()}
        onclick={() => onSyncNow(serverId)}
        disabled={isSyncing || libraryUuids.length === 0}
      >
        {m.button_plex_sync_now()}
      </Button>
    </RenderFor>
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
  <PlexServerDrawerHost
    {serverId}
    {serverName}
    onClose={() => {
      isManaging = false;

      if (libraryUuids.length === 0) {
        onForget(serverId);
      }
    }}
    onRemoved={() => {
      isManaging = false;
      onForget(serverId);
    }}
  />
{/if}
