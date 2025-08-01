<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import { useParameters } from "$lib/features/parameters/useParameters";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import {
    EMPTY_SEASON_INFO,
    useUserSeason,
  } from "$lib/sections/lists/stores/useUserSeason";
  import ShowSummary from "$lib/sections/summary/ShowSummary.svelte";
  import { assertDefined } from "$lib/utils/assert/assertDefined";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import { useShow } from "./useShow";
  import { useShowVideos } from "./useShowVideos";

  const { show, intl, studios, crew, seasons, streamOn, isLoading } = $derived(
    useShow(page.params.slug),
  );

  const videos = $derived(
    useShowVideos({
      slug: page.params.slug,
      seasons: ($seasons ?? []).map((season) => season.number),
    }),
  );

  const currentSeason = $derived(
    parseInt(page.url.searchParams.get("season") ?? ""),
  );

  const lastWatchedSeason = $derived(useUserSeason($show?.id));

  const { search } = useParameters();

  const goToSeason = (slug: string, season: number) => {
    /*
     * TODO: Consider implementing a custom navigation helper within useParameters
     * to simplify URL management with query parameters, reducing the need for
     * manual parameter handling throughout the application.
     */
    goto(
      UrlBuilder.show(slug, {
        season: season,
        ...Object.fromEntries($search),
      }),
      {
        replaceState: true,
      },
    );
  };

  $effect.pre(() => {
    if (!isNaN(currentSeason)) return;

    if ($seasons == null || $show == null) return;

    if ($lastWatchedSeason === EMPTY_SEASON_INFO) {
      goToSeason($show.slug, 1);
    }

    const active = assertDefined(
      $seasons.find((s) => s.number === $lastWatchedSeason.number) ??
        $seasons.find((s) => s.number === 1),
      "Active season not found",
    );

    const isCurrentSeasonFullyWatched =
      active.episodes.count === $lastWatchedSeason.episodes.count;

    const maxSeason = assertDefined(
      $seasons.at(-1),
      "Could not find last season",
    ).number;
    const nextSeason = Math.min(active.number + 1, maxSeason);

    const activeSeason = isCurrentSeasonFullyWatched
      ? nextSeason
      : active.number;

    goToSeason($show.slug, activeSeason);
  });

  const isReady = $derived(!$isLoading && !isNaN(currentSeason));
</script>

<TraktPage
  audience="all"
  title={$intl?.title ?? $show?.title}
  info={$show}
  image={$show?.poster.url.thumb ?? $show?.cover.url.thumb}
  type="show"
  hasDynamicContent={true}
>
  {#if isReady}
    <ShowSummary
      media={$show!}
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
