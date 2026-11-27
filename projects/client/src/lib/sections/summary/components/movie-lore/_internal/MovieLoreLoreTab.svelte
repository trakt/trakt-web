<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MovieEntry } from "$lib/requests/models/MovieEntry.ts";
  import type { MovieLore } from "$lib/requests/models/MovieLore.ts";
  import RecapKeyMoments from "../../recap/_internal/RecapKeyMoments.svelte";
  import RecapSource from "../../recap/_internal/RecapSource.svelte";
  import MovieLorePreviously from "./MovieLorePreviously.svelte";

  const { lore, movie, watchedIds, onReveal }: {
    lore: MovieLore;
    movie: Pick<MovieEntry, "id" | "title">;
    watchedIds: ReadonlySet<number>;
    onReveal: () => void;
  } = $props();

  const isEmpty = $derived(
    lore.lore.length === 0 && lore.previously.length === 0,
  );
</script>

<div class="trakt-movie-lore-lore-tab">
  {#if isEmpty}
    <p class="secondary">{m.text_movie_lore_empty()}</p>
  {/if}

  {#if lore.lore.length > 0}
    <RecapKeyMoments
      heading={m.header_movie_lore_world()}
      points={lore.lore}
    />
  {/if}

  {#if lore.previously.length > 0}
    <MovieLorePreviously
      previously={lore.previously}
      {movie}
      {watchedIds}
      {onReveal}
    />
  {/if}

  {#if lore.attribution}
    <RecapSource attribution={lore.attribution} />
  {/if}
</div>

<style lang="scss">
  .trakt-movie-lore-lore-tab {
    display: flex;
    flex-direction: column;
    gap: var(--ni-28);
  }
</style>
