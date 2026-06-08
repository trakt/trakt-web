<script lang="ts">
  import Button from '$lib/components/buttons/Button.svelte';
  import PlexLogo from '$lib/components/icons/PlexLogo.svelte';
  import * as m from '$lib/features/i18n/messages.ts';
  import { useInfiniteQuery } from '$lib/features/query/useQuery.ts';
  import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
  import { plexDataSyncsQuery } from '$lib/requests/plex/plexDataSyncsQuery.ts';
  import { plexUndoSyncRequest } from '$lib/requests/plex/plexUndoSyncRequest.ts';
  import { useInvalidator } from '$lib/stores/useInvalidator.ts';
  import { map } from 'rxjs';

  const { invalidate } = useInvalidator();

  const syncsResult = useInfiniteQuery(plexDataSyncsQuery());

  const syncs = syncsResult.pipe(
    map((q) => q.data?.pages.flatMap((p) => p.entries) ?? []),
  );

  const totalCount = syncsResult.pipe(
    map((q) => {
      const page = q.data?.pages.at(0)?.page;
      if (!page) return 0;
      return page.type === 'paginated' ? page.total : null;
    }),
  );

  const hasNextPage = syncsResult.pipe(map((q) => q.hasNextPage));

  let isExpanded = $state(false);
  let undoingId = $state<number | null>(null);

  async function fetchNextPage() {
    await $syncsResult.fetchNextPage();
  }

  async function undoSync(id: number) {
    undoingId = id;
    try {
      await plexUndoSyncRequest({ syncId: id });
      await invalidate([InvalidateAction.Plex.Syncs]);
    } finally {
      undoingId = null;
    }
  }

  function formatCount(count?: number, singular = 'item', plural = 'items') {
    if (!count) return '';
    return `${count} ${count === 1 ? singular : plural}`;
  }

  function formatCountBlock(block?: {
    movies?: number;
    episodes?: number;
    shows?: number;
    seasons?: number;
  }): string {
    if (!block) return '';
    const parts = [
      formatCount(block.movies, 'movie', 'movies'),
      formatCount(block.episodes, 'episode', 'episodes'),
      formatCount(block.shows, 'show', 'shows'),
      formatCount(block.seasons, 'season', 'seasons'),
    ].filter(Boolean);
    return parts.join(', ');
  }

  function formatDate(date: Date) {
    return date.toLocaleString(undefined, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
</script>

{#if $syncs.length > 0}
  <div class="plex-sync-history">
    <p class="sync-summary secondary">
      {m.text_plex_synced_summary({
        count: $totalCount ?? $syncs.length,
        date: formatDate($syncs.at(0)?.createdAt ?? new Date()),
      })}
    </p>

    <button
      class="sync-history-toggle"
      type="button"
      onclick={() => (isExpanded = !isExpanded)}
    >
      <span class="secondary uppercase bold">{m.header_plex_sync_history()}</span>
      {#if $totalCount}
        <span class="sync-count-badge">{$totalCount}</span>
      {/if}
      <span class="caret" class:rotated={isExpanded}>▸</span>
    </button>

    {#if isExpanded}
      <div class="sync-history-table-wrapper">
        <table class="sync-history-table">
          <thead>
            <tr>
              <th class="secondary">{m.label_plex_history_date()}</th>
              <th class="secondary">{m.label_plex_history_service()}</th>
              <th class="secondary">{m.list_title_history()}</th>
              <th class="secondary">{m.list_title_library()}</th>
              <th class="secondary">{m.header_ratings()}</th>
              <th class="secondary">{m.button_text_watchlist()}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {#each $syncs as sync (sync.key)}
              <tr class:undone={sync.undone}>
                <td>
                  <span>{formatDate(sync.createdAt)}</span>
                </td>
                <td class="service-cell">
                  <PlexLogo />
                </td>
                <td class="count-cell secondary">
                  {formatCountBlock(sync.items.history)}
                </td>
                <td class="count-cell secondary">
                  {formatCountBlock(sync.items.library)}
                </td>
                <td class="count-cell secondary">
                  {formatCountBlock(sync.items.ratings)}
                </td>
                <td class="count-cell secondary">
                  {formatCountBlock(sync.items.watchlist)}
                </td>
                <td class="action-cell">
                  {#if !sync.undone}
                    <Button
                      size="small"
                      color="default"
                      disabled={undoingId === sync.id}
                      onclick={() => undoSync(sync.id)}
                    >
                      {m.button_plex_undo_sync()}
                    </Button>
                  {/if}
                </td>
              </tr>
            {/each}
          </tbody>
        </table>

        {#if $hasNextPage}
          <button
            class="load-more secondary"
            type="button"
            onclick={() => fetchNextPage()}
          >
            Load more
          </button>
        {/if}
      </div>
    {/if}
  </div>
{/if}

<style lang="scss">
  .plex-sync-history {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);
  }

  .sync-summary {
    display: flex;
    align-items: center;
    gap: var(--gap-s);
  }

  .sync-history-toggle {
    all: unset;
    display: flex;
    align-items: center;
    gap: var(--gap-s);
    cursor: pointer;
    padding: var(--ni-12) var(--ni-16);
    border: var(--border-thickness-xs) solid var(--color-border);
    border-radius: var(--border-radius-s);

    &:hover {
      background-color: color-mix(in srgb, var(--color-border) 30%, transparent);
    }
  }

  .sync-count-badge {
    background-color: color-mix(in srgb, var(--color-foreground) 15%, transparent);
    border-radius: var(--border-radius-xxl);
    padding: var(--ni-2) var(--ni-8);
    font-size: var(--font-size-label);
    font-weight: bold;
  }

  .caret {
    margin-left: auto;
    transition: transform var(--transition-increment) ease;

    &.rotated {
      transform: rotate(90deg);
    }
  }

  .sync-history-table-wrapper {
    overflow-x: auto;
  }

  .sync-history-table {
    width: 100%;
    border-collapse: collapse;

    th,
    td {
      padding: var(--ni-10) var(--ni-12);
      text-align: left;
      white-space: nowrap;
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

    tr.undone td {
      opacity: 0.5;
    }
  }

  .service-cell :global(svg) {
    width: var(--ni-40);
    height: auto;
  }

  .count-cell {
    font-variant-numeric: tabular-nums;
  }

  .action-cell {
    text-align: right;
  }

  .load-more {
    all: unset;
    display: block;
    width: 100%;
    text-align: center;
    padding: var(--ni-12);
    cursor: pointer;
    font-size: var(--font-size-label);

    &:hover {
      text-decoration: underline;
    }
  }
</style>
