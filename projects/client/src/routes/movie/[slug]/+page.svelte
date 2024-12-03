<script lang="ts">
  import { page } from "$app/stores";
  import MovieSummary from "$lib/sections/summary/MovieSummary.svelte";
  import { useMovie } from "./useMovie";

  const { movie, ratings, intl } = $derived(useMovie($page.params.slug));
</script>

{#if $movie != null && $ratings != null && $intl != null}
  <MovieSummary media={$movie} ratings={$ratings} intl={$intl} />
{/if}
