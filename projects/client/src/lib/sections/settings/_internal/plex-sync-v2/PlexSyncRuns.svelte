<script lang="ts">
  import PlexLogo from "$lib/components/icons/PlexLogo.svelte";
  import { getLocale } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useQuery } from "$lib/features/query/useQuery.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { mediaSyncRunsQuery } from "$lib/requests/media-sync/mediaSyncRunsQuery.ts";
  import type { MediaSyncConnection } from "$lib/requests/media-sync/models/MediaSyncConnection.ts";
  import { iffy } from "$lib/utils/function/iffy.ts";
  import { toHumanDate } from "$lib/utils/formatting/date/toHumanDate.ts";
  import { map } from "rxjs";
  import SettingsGroupCard from "../SettingsGroupCard.svelte";
  import SettingsGroupRowSkeleton from "../SettingsGroupRowSkeleton.svelte";
  import SettingsVipUpsell from "../SettingsVipUpsell.svelte";
  import SyncLoadError from "../SyncLoadError.svelte";
  import type { SyncCycle } from "./models/SyncCycle.ts";
  import { coalesceQuietCycles } from "./coalesceQuietCycles.ts";
  import { toFeedTitle } from "./toFeedTitle.ts";
  import { toSyncCycles } from "./toSyncCycles.ts";

  const { connection }: { connection: MediaSyncConnection } = $props();

  const query = useQuery(
    mediaSyncRunsQuery({ connectionId: iffy(() => connection.id) }),
  );
  const SHOWN_CYCLES = 5;

  const cycles = query.pipe(
    map(({ data }) =>
      data &&
      coalesceQuietCycles(toSyncCycles(data)).slice(0, SHOWN_CYCLES)
    ),
  );
  const hasFailed = query.pipe(map(({ isError }) => isError));

  const serverLabel = $derived(connection.serverName ?? m.label_plex_server());

  const STATUS_LABEL: Record<SyncCycle["status"], () => string> = {
    running: m.tag_media_sync_run_running,
    done: m.tag_media_sync_run_done,
    failed: m.tag_media_sync_run_failed,
  };

  function toTitle(cycle: SyncCycle): string {
    const when = toHumanDate(new Date(), cycle.startedAt, getLocale());
    switch (cycle.kind) {
      case "full":
        return `${when} · ${m.tag_media_sync_run_full()}`;
      case "invalidate":
        return `${when} · ${m.tag_media_sync_run_check()}`;
      default:
        return when;
    }
  }

  function toSummary(cycle: SyncCycle): string {
    if (cycle.status === "failed") return m.text_media_sync_run_failed();

    if (cycle.kind === "invalidate") {
      return m.text_media_sync_run_checked({
        checked: cycle.itemsSeen,
        removed: cycle.itemsRemoved,
      });
    }

    const added = Object.entries(cycle.addedByFeed).map(([feed, count]) =>
      m.text_media_sync_run_added({ feed: toFeedTitle(feed), count })
    );

    if (added.length > 0) return added.join(" · ");

    return cycle.quietCount > 1
      ? m.text_media_sync_run_nothing_new_since({
        count: cycle.quietCount,
        when: toHumanDate(new Date(), cycle.quietSince, getLocale()),
      })
      : m.text_media_sync_run_nothing_new();
  }
</script>

{#snippet plexIcon()}
  <PlexLogo />
{/snippet}

<div class="trakt-plex-sync-runs">
  {#if connection.collectionLimitReached}
    <RenderFor audience="free">
      <SettingsVipUpsell
        icon={plexIcon}
        title={m.header_media_sync_collection_limit()}
        description={m.description_media_sync_collection_limit()}
        source="plex-settings-collection-limit"
      />
    </RenderFor>
  {/if}

  <SettingsGroupCard
    title={m.header_media_sync_runs()}
    description={m.description_media_sync_runs({ server: serverLabel })}
  >
    {#if $hasFailed}
      <SyncLoadError variant="plain" />
    {:else if !$cycles}
      {#each { length: 3 }, index (index)}
        <SettingsGroupRowSkeleton />
      {/each}
    {:else}
      {#each $cycles as cycle (cycle.id)}
        <div class="sync-cycle">
          <div class="cycle-copy">
            <p class="bold">{toTitle(cycle)}</p>
            <p class="secondary small">{toSummary(cycle)}</p>
          </div>
          <span class="cycle-status bold tag" data-status={cycle.status}>
            {STATUS_LABEL[cycle.status]()}
          </span>
        </div>
      {:else}
        <p class="secondary no-runs">{m.text_media_sync_no_runs()}</p>
      {/each}
    {/if}
  </SettingsGroupCard>
</div>

<style lang="scss">
  .trakt-plex-sync-runs {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);
  }

  .sync-cycle {
    display: flex;
    align-items: center;
    gap: var(--gap-m);

    padding: var(--gap-s) var(--gap-m);

    p {
      margin: 0;
    }
  }

  .cycle-copy {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xxs);
    flex: 1;
    min-width: 0;
  }

  .cycle-status {
    flex-shrink: 0;

    padding: var(--ni-2) var(--ni-8);
    border-radius: var(--border-radius-xl);

    --status-color: var(--green-500);
    background: color-mix(in srgb, var(--status-color) 10%, transparent);
    color: var(--status-color);

    &[data-status="running"] {
      --status-color: var(--purple-500);
    }

    &[data-status="failed"] {
      --status-color: var(--red-500);
    }
  }

  .no-runs {
    margin: 0;
    padding: var(--gap-m);
  }
</style>
