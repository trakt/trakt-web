<script lang="ts">
  import type { MovieEntry } from "$lib/requests/models/MovieEntry.ts";
  import type { MovieLore } from "$lib/requests/models/MovieLore.ts";
  import RecapSource from "../../recap/_internal/RecapSource.svelte";
  import MovieLoreSetup from "./MovieLoreSetup.svelte";
  import MovieLoreWatchFirst from "./MovieLoreWatchFirst.svelte";

  const { lore, movie, mustWatchIds, watchedIds }: {
    lore: MovieLore;
    movie: MovieEntry;
    mustWatchIds: ReadonlySet<number>;
    watchedIds: ReadonlySet<number>;
  } = $props();
</script>

<div class="trakt-movie-lore-setup-tab">
  <MovieLoreSetup lines={lore.setup} />

  {#if lore.watchFirst}
    <MovieLoreWatchFirst
      watchFirst={lore.watchFirst}
      earlier={lore.earlier}
      {movie}
      {mustWatchIds}
      {watchedIds}
    />
  {/if}

  {#if lore.attribution}
    <RecapSource attribution={lore.attribution} />
  {/if}
</div>

<style lang="scss">
  .trakt-movie-lore-setup-tab {
    display: flex;
    flex-direction: column;
    gap: var(--ni-28);
  }
</style>
