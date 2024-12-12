<script lang="ts">
  import { page } from "$app/stores";
  import TraktPage from "$lib/components/layout/TraktPage.svelte";
  import MovieSummary from "$lib/sections/summary/MovieSummary.svelte";
  import { useMovie } from "./useMovie";

  const { movie, ratings, intl } = $derived(useMovie($page.params.slug));
</script>

<TraktPage title={$movie?.title}>
  {#if $movie != null && $ratings != null && $intl != null}
    <MovieSummary media={$movie} ratings={$ratings} intl={$intl} />
  {/if}
</TraktPage>
