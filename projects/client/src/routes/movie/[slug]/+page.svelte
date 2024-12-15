<script lang="ts">
  import { page } from "$app/stores";
  import TraktPage from "$lib/components/layout/TraktPage.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import MovieSummary from "$lib/sections/summary/MovieSummary.svelte";
  import { useMovie } from "./useMovie";

  const { movie, ratings, intl } = $derived(useMovie($page.params.slug));
</script>

<TraktPage title={$movie?.title}>
  {#if $movie != null && $ratings != null && $intl != null}
    <MovieSummary media={$movie} ratings={$ratings} intl={$intl} />
  {:else}
    <!-- TODO: remove this when we have empty state, currently prevents content jumps -->
    <RenderFor audience="all" device={["tablet-sm", "tablet-lg", "desktop"]}>
      <div style="height: 616px; display:flex"></div>
    </RenderFor>
  {/if}
</TraktPage>
