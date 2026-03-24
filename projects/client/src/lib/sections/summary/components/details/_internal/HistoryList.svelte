<script lang="ts">
  import { getLocale } from "$lib/features/i18n";
  import type { HistoryEntry } from "$lib/sections/lists/stores/models/HistoryEntry";
  import RemoveFromHistoryAction from "$lib/sections/media-actions/remove-from-history/RemoveFromHistoryAction.svelte";
  import { toHumanDate } from "$lib/utils/formatting/date/toHumanDate";
  import { episodeActivityTitle } from "$lib/utils/intl/episodeActivityTitle";

  const { list }: { list: HistoryEntry[] } = $props();

  const now = new Date();
</script>

<ul class="trakt-watch-history-list">
  {#each list as entry (entry.key)}
    <li class="trakt-watch-history-row">
      <div class="trakt-watch-history-info">
        {#if entry.type === "episode"}
          <p class="ellipsis">
            {episodeActivityTitle(entry.episode, entry.show)}
          </p>
        {/if}
        <p
          class="capitalize ellipsis"
          class:secondary={entry.type === "episode"}
          class:italic={entry.type === "episode"}
        >
          {toHumanDate(now, entry.watchedAt, getLocale())}
        </p>
      </div>
      <RemoveFromHistoryAction
        style="action"
        size="small"
        title={entry.type === "episode"
          ? episodeActivityTitle(entry.episode, entry.show)
          : entry.movie.title}
        {entry}
      />
    </li>
  {/each}
</ul>

<style>
  .trakt-watch-history-list {
    display: flex;
    flex-direction: column;

    list-style: none;

    margin: 0;
    padding: 0;
  }

  .trakt-watch-history-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--gap-s);

    padding-block: var(--gap-s);
    border-bottom: var(--ni-1) solid
      color-mix(in srgb, var(--color-border) 50%, transparent);

    &:last-child {
      border-bottom: none;
    }
  }

  .trakt-watch-history-info {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xxs);

    min-width: 0;
  }
</style>
