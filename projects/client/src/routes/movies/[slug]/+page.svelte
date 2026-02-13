<script lang="ts">
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import MovieSummary from "$lib/sections/summary/MovieSummary.svelte";
  import type { PageProps } from "./$types";
  import { useMovie } from "./useMovie";

  const { params }: PageProps = $props();

  const { movie, intl, studios, crew, streamOn, isLoading, videos, sentiment } =
    $derived(useMovie(params.slug));
</script>

<TraktPage
  audience="all"
  title={$intl?.title ?? $movie?.title}
  info={$movie}
  image={$movie?.poster.url.thumb ?? $movie?.cover.url.thumb}
  type="movie"
  hasDynamicContent={true}
>
  <RenderFor audience="authenticated">
    <NavbarStateSetter mode="minimal" />
  </RenderFor>

  {#if !$isLoading}
    <MovieSummary
      media={$movie!}
      studios={$studios!}
      crew={$crew!}
      intl={$intl!}
      streamOn={$streamOn}
      videos={$videos}
      sentiment={$sentiment}
    />
  {:else}
    <!-- TODO: remove this when we have empty state, currently prevents content jumps -->
    <RenderFor audience="all" device={["tablet-sm", "tablet-lg", "desktop"]}>
      <div style="height: 100dvh; display:flex"></div>
    </RenderFor>
  {/if}
</TraktPage>
