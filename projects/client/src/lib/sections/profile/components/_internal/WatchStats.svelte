<script lang="ts">
  import MovieIcon from "$lib/components/icons/MovieIcon.svelte";
  import ShowIcon from "$lib/components/icons/ShowIcon.svelte";
  import Stat from "$lib/components/stat/Stat.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MonthToDateDetails } from "../../models/MonthToDateDetails";

  const { monthToDate }: { monthToDate: MonthToDateDetails } = $props();
</script>

<div class="trakt-watch-stats">
  <Stat>
    {#snippet icon()}
      <ShowIcon />
    {/snippet}
    {m.text_episodes_watched({ count: monthToDate.episodeCount })}
  </Stat>

  <Stat>
    {#snippet icon()}
      <ShowIcon />
    {/snippet}
    {m.text_shows_watched({ count: monthToDate.showCount })}
  </Stat>

  <Stat>
    {#snippet icon()}
      <MovieIcon />
    {/snippet}
    {m.text_movies_watched({ count: monthToDate.movieCount })}
  </Stat>
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
</style>
