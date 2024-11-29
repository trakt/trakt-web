<script lang="ts">
  import { page } from "$app/stores";
  import MovieSummary from "$lib/sections/summary/MovieSummary.svelte";
  import { useMovie } from "./useMovie";

  const { movie, ratings } = useMovie($page.params.slug);
</script>

{#if $movie != null && $ratings != null}
  <MovieSummary media={$movie} ratings={$ratings} />
{/if}
