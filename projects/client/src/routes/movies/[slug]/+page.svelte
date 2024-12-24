<script lang="ts">
  import { page } from "$app/stores";
  import TraktPage from "$lib/components/layout/TraktPage.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import MovieSummary from "$lib/sections/summary/MovieSummary.svelte";
  import { useMovie } from "./useMovie";

  const { movie, ratings, stats, intl, watchers, studios, crew } = $derived(
    useMovie($page.params.slug),
  );
</script>

<TraktPage
  title={$movie?.title}
  info={$movie}
  image={$movie?.cover.url.thumb}
  type="movie"
>
  {#if $movie != null && $ratings != null && $stats != null && $intl != null && $studios != null && $crew != null}
    <MovieSummary
      media={$movie}
      ratings={$ratings}
      watchers={$watchers}
      stats={$stats}
      studios={$studios}
      crew={$crew}
      intl={$intl}
    />
  {:else}
    <!-- TODO: remove this when we have empty state, currently prevents content jumps -->
    <RenderFor audience="all" device={["tablet-sm", "tablet-lg", "desktop"]}>
      <div style="height: 100dvh; display:flex"></div>
    </RenderFor>
  {/if}
</TraktPage>
