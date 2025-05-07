<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import { useParameters } from "$lib/features/parameters/useParameters";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import { useUserSeason } from "$lib/sections/lists/stores/useUserSeason";
  import ShowSummary from "$lib/sections/summary/ShowSummary.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import { readable } from "svelte/store";
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

  const currentSeason = $derived(
    parseInt(page.url.searchParams.get("season") ?? ""),
  );

  const lastWatchedSeason = $derived(
    $show == null ? readable(-1) : useUserSeason($show.id),
  );

  const { search } = useParameters();

  $effect.pre(() => {
    if (currentSeason) return;

    if ($seasons == null) return;

    if ($lastWatchedSeason === -1) return;

    const active = $seasons.find((s) => s.number === $lastWatchedSeason);

    const activeSeason = active?.number;
    const firstSeason = $seasons?.at(0)?.number;

    if ($show == null) return;

    /*
     * TODO: Consider implementing a custom navigation helper within useParameters
     * to simplify URL management with query parameters, reducing the need for
     * manual parameter handling throughout the application.
     */
    goto(
      UrlBuilder.show($show.slug, {
        season: activeSeason ?? firstSeason ?? 1,
        ...Object.fromEntries($search),
      }),
      {
        replaceState: true,
      },
    );
  });
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
      {currentSeason}
    />
  {:else}
    <!-- TODO: remove this when we have empty state, currently prevents content jumps -->
    <RenderFor audience="all" device={["tablet-sm", "tablet-lg", "desktop"]}>
      <div style="height: 100dvh; display:flex"></div>
    </RenderFor>
  {/if}
</TraktPage>
