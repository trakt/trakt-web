<script lang="ts">
  import Popover from "$lib/components/popover/Popover.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useQuery } from "$lib/features/query/useQuery.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { mediaSyncConnectionsQuery } from "$lib/requests/media-sync/mediaSyncConnectionsQuery.ts";
  import GetVIPLink from "$lib/sections/navbar/components/GetVIPLink.svelte";
  import { map } from "rxjs";

  const query = useQuery(mediaSyncConnectionsQuery({}));
  const limitedServers = query.pipe(
    map(({ data }) =>
      (data ?? [])
        .filter((connection) =>
          connection.provider === "plex" && connection.collectionLimitReached
        )
        .map((connection) => connection.serverName ?? m.label_plex_server())
    ),
  );
</script>

{#snippet note()}
  <div class="trakt-library-collection-limit-note">
    <p class="small">
      {m.description_library_collection_limit({
        servers: $limitedServers.join(", "),
      })}
    </p>
    <GetVIPLink source="library-collection-limit" />
  </div>
{/snippet}

{#if $limitedServers.length > 0}
  <RenderFor audience="free">
    <Popover content={note} label={m.label_library_collection_limit()}>
      <span class="trakt-library-collection-limit tag">
        {m.label_library_collection_limit()}
      </span>
    </Popover>
  </RenderFor>
{/if}

<style>
  .trakt-library-collection-limit {
    color: var(--orange-400);
    cursor: pointer;
    white-space: nowrap;
  }

  .trakt-library-collection-limit-note {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);
    max-width: var(--ni-280);
  }
</style>
