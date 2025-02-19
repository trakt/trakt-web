<script lang="ts">
  import { page } from "$app/state";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import ShowSummary from "$lib/sections/summary/ShowSummary.svelte";
  import { useStreamOn } from "$lib/stores/useStreamOn";
  import { useShow } from "./useShow";
  import { useShowDetails } from "./useShowDetails";

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
    isLoading: isLoadingDetails,
  } = $derived(useShowDetails(page.params.slug));

  const { streamOn, isLoading: isLoadingStreamOn } = $derived(
    useStreamOn({
      type: "show",
      id: page.params.slug,
    }),
  );

  const isLoading = $derived(
    $isLoadingStreamOn || $isLoadingShow || $isLoadingDetails,
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
    />
  {:else}
    <!-- TODO: remove this when we have empty state, currently prevents content jumps -->
    <RenderFor audience="all" device={["tablet-sm", "tablet-lg", "desktop"]}>
      <div style="height: 100dvh; display:flex"></div>
    </RenderFor>
  {/if}
</TraktPage>
