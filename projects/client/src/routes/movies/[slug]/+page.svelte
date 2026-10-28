<script lang="ts">
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import MovieSummary from "$lib/sections/summary/MovieSummary.svelte";
  import { fromRune } from "$lib/utils/store/fromRune.svelte";
  import type { PageProps } from "./$types";
  import { useMovie } from "./useMovie";
  import SummaryPageSkeleton from "$lib/sections/summary/SummaryPageSkeleton.svelte";
  import { fade } from "svelte/transition";

  const { params }: PageProps = $props();

  const {
    movie,
    intl,
    studios,
    crew,
    streamOn,
    isLoading,
    videos,
    sentiment,
    realityCheck,
    youtubeSpecial,
  } = useMovie(fromRune(() => params.slug));
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

  {#if !$isLoading && $movie && $studios && $crew && $intl}
    <MovieSummary
      media={$movie}
      studios={$studios}
      crew={$crew}
      intl={$intl}
      streamOn={$streamOn}
      videos={$videos}
      sentiment={$sentiment}
      realityCheck={$realityCheck}
      youtubeSpecial={$youtubeSpecial}
    />
  {:else}
    <!--
      Holds the page's height as the empty div used to, but with the header's
      shape in it: a title you have not opened before was a blank screen for
      as long as its request took.
    -->
    <RenderFor audience="all" device={["tablet-sm", "tablet-lg", "desktop"]}>
      <div class="summary-loading" out:fade={{ duration: 200 }}>
        <SummaryPageSkeleton />
      </div>
    </RenderFor>
  {/if}
</TraktPage>

<style>
  /* Keeps the page tall while the header is still a silhouette, so the lists
     below do not slide up into place a moment later. */
  .summary-loading {
    min-height: 100dvh;
  }
</style>
