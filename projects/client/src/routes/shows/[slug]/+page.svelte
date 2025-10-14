<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import { useParameters } from "$lib/features/parameters/useParameters";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import { useUserSeason } from "$lib/sections/lists/stores/useUserSeason";
  import ShowSummary from "$lib/sections/summary/ShowSummary.svelte";
  import { findActiveSeason } from "$lib/utils/media/findActiveSeason";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import type { PageProps } from "./$types";
  import { useShow } from "./useShow";
  import { useShowVideos } from "./useShowVideos";

  const { params }: PageProps = $props();

  const { show, intl, studios, crew, seasons, streamOn, isLoading } = $derived(
    useShow(params.slug),
  );

  const videos = $derived(
    useShowVideos({
      slug: params.slug,
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

    const activeSeason = findActiveSeason({
      seasons: $seasons,
      lastWatchedSeason: $lastWatchedSeason,
    });

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
