<script lang="ts">
  import { page } from "$app/state";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import ShowSummary from "$lib/sections/summary/ShowSummary.svelte";
  import { useShow } from "./useShow";
  import { useShowDetails } from "./useShowDetails";
  import { useShowVideos } from "./useShowVideos";

  const {
    show,
    intl,
    isLoading: isLoadingShow,
  } = $derived(useShow(page.params.slug));

  const {
    ratings,
    stats,
    watchers,
    studios,
    crew,
    seasons,
    streamOn,
    isLoading: isLoadingDetails,
  } = $derived(useShowDetails(page.params.slug));

  const isLoading = $derived($isLoadingShow || $isLoadingDetails);
  const videos = $derived(
    useShowVideos({
      slug: page.params.slug,
      seasons: ($seasons ?? []).map((season) => season.number),
    }),
  );
</script>

<TraktPage
  audience="all"
  title={$intl?.title ?? $show?.title}
  info={$show}
  image={$show?.poster.url.thumb ?? $show?.cover.url.thumb}
  type="show"
>
  {#if !isLoading}
    <ShowSummary
      media={$show!}
      ratings={$ratings!}
      watchers={$watchers!}
      stats={$stats!}
      intl={$intl!}
      studios={$studios!}
      crew={$crew!}
      seasons={$seasons!}
      streamOn={$streamOn}
      videos={$videos}
    />
  {:else}
    <!-- TODO: remove this when we have empty state, currently prevents content jumps -->
    <RenderFor audience="all" device={["tablet-sm", "tablet-lg", "desktop"]}>
      <div style="height: 100dvh; display:flex"></div>
    </RenderFor>
  {/if}
</TraktPage>
