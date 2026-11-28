<script lang="ts">
  import Skeleton from "$lib/components/skeleton/Skeleton.svelte";
  import type { LoreMovie } from "$lib/requests/models/LoreMovie.ts";
  import { fromRune } from "$lib/utils/store/fromRune.svelte.ts";
  import { useLoreMovieEntry } from "../useLoreMovieEntry.ts";
  import MovieLorePosterCard from "./MovieLorePosterCard.svelte";

  const { film, tone, isWatched }: {
    film: LoreMovie;
    tone: "must-watch" | "optional";
    isWatched: boolean;
  } = $props();

  const entry = useLoreMovieEntry(fromRune(() => film.slug));
</script>

{#if $entry}
  <MovieLorePosterCard media={$entry} {tone} {isWatched} />
{:else}
  <span class="trakt-movie-lore-film-poster">
    <Skeleton
      width="var(--width-portrait-card)"
      height="calc(var(--height-portrait-card-cover) + var(--ni-64))"
      radius="var(--border-radius-m)"
    />
  </span>
{/if}

<style lang="scss">
  .trakt-movie-lore-film-poster {
    flex-shrink: 0;
  }
</style>
