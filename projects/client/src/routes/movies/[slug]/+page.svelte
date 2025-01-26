<script lang="ts">
  import { page } from "$app/state";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import MovieSummary from "$lib/sections/summary/MovieSummary.svelte";
  import { useMovie } from "./useMovie";

  const { movie, ratings, stats, intl, watchers, studios, crew, isLoading } =
    $derived(useMovie(page.params.slug));
</script>

<TraktPage
  audience="all"
  title={$intl?.title ?? $movie?.title}
  info={$movie}
  image={$movie?.poster.url.thumb ?? $movie?.cover.url.thumb}
  type="movie"
>
  {#if !$isLoading}
    <MovieSummary
      media={$movie!}
      ratings={$ratings!}
      watchers={$watchers!}
      stats={$stats!}
      studios={$studios!}
      crew={$crew!}
      intl={$intl!}
    />
  {:else}
    <!-- TODO: remove this when we have empty state, currently prevents content jumps -->
    <RenderFor audience="all" device={["tablet-sm", "tablet-lg", "desktop"]}>
      <div style="height: 100dvh; display:flex"></div>
    </RenderFor>
  {/if}
</TraktPage>
