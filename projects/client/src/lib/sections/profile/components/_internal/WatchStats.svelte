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
    <p class="uppercase ellipsis">
      {m.episodes_watched({ count: monthToDate.episodeCount })}
    </p>
  </div>

  <div class="trakt-watch-stat">
    <ShowIcon />
    <p class="uppercase ellipsis">
      {m.shows_watched({ count: monthToDate.showCount })}
    </p>
  </div>

  <div class="trakt-watch-stat">
    <MovieIcon />
    <p class="uppercase ellipsis">
      {m.movies_watched({ count: monthToDate.movieCount })}
    </p>
  </div>
</div>

<style>
  .trakt-watch-stats {
    display: flex;
    flex-direction: column;

    gap: var(--gap-xxs);
  }

  .trakt-watch-stat {
    width: fit-content;

    display: flex;
    align-items: center;
    gap: var(--gap-s);

    background: var(--shade-940);

    border-radius: var(--border-radius-s);
    padding: var(--ni-8) var(--ni-16);

    p.uppercase {
      font-weight: 700;
    }
  }
</style>
