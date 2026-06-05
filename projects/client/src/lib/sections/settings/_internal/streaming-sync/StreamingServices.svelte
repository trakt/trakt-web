<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import { useQuery } from "$lib/features/query/useQuery.ts";
  import { streamingConnectionsQuery } from "$lib/requests/queries/streaming-sync/streamingConnectionsQuery.ts";
  import { map } from "rxjs";
  import StreamingServiceTile from "./StreamingServiceTile.svelte";

  const connections = useQuery(streamingConnectionsQuery()).pipe(
    map((query) => query.data ?? []),
  );

  const inactiveNames = $derived(
    ($connections ?? [])
      .filter((connection) => connection.isConnected && !connection.isActive)
      .map((connection) => connection.name),
  );
</script>

<div class="trakt-streaming-services">
  {#if inactiveNames.length > 0}
    <div class="trakt-streaming-warning" role="alert">
      {m.text_reconnect_streaming_warning({
        services: inactiveNames.join(", "),
      })}
    </div>
  {/if}

  <div class="trakt-streaming-services-grid">
    {#each $connections ?? [] as connection (connection.key)}
      <StreamingServiceTile {connection} />
    {/each}
  </div>
</div>

<style lang="scss">
  .trakt-streaming-services {
    display: flex;
    flex-direction: column;
    gap: var(--gap-l);
  }

  .trakt-streaming-warning {
    padding: var(--ni-12) var(--ni-16);

    border-radius: var(--border-radius-m);
    background-color: color-mix(in srgb, var(--color-foreground-red) 12%, transparent);
    color: var(--color-foreground-red);
  }

  .trakt-streaming-services-grid {
    display: grid;
    grid-template-columns: repeat(
      auto-fit,
      minmax(min(var(--ni-320), 100%), 1fr)
    );
    gap: var(--gap-l);
  }
</style>
