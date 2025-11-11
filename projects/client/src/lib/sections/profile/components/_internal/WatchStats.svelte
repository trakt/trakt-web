<script lang="ts">
  import MovieIcon from "$lib/components/icons/MovieIcon.svelte";
  import ShowIcon from "$lib/components/icons/ShowIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MonthToDateDetails } from "../../models/MonthToDateDetails";

  const { monthToDate }: { monthToDate: MonthToDateDetails } = $props();
</script>

<div class="trakt-watch-stats">
  <div class="trakt-watch-stat">
    <ShowIcon />
    <p class="uppercase ellipsis smaller">
      {m.text_episodes_watched({ count: monthToDate.episodeCount })}
    </p>
  </div>

  <div class="trakt-watch-stat">
    <ShowIcon />
    <p class="uppercase ellipsis smaller">
      {m.text_shows_watched({ count: monthToDate.showCount })}
    </p>
  </div>

  <div class="trakt-watch-stat">
    <MovieIcon />
    <p class="uppercase ellipsis smaller">
      {m.text_movies_watched({ count: monthToDate.movieCount })}
    </p>
  </div>
</div>

<style>
  .trakt-watch-stats {
    display: flex;
    flex-wrap: wrap;
    gap: var(--gap-xxs);

    :global(svg) {
      width: var(--ni-16);
      height: var(--ni-16);
    }
  }

  .trakt-watch-stat {
    width: fit-content;

    display: flex;
    align-items: center;
    gap: var(--gap-xxs);

    background: var(--shade-940);

    border-radius: var(--border-radius-s);
    padding: var(--ni-8) var(--ni-10);

    p.uppercase {
      font-weight: 700;
    }
  }
</style>
