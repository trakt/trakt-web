<script lang="ts">
  import { page } from "$app/state";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import EpisodeSummary from "$lib/sections/summary/EpisodeSummary.svelte";
  import { useStreamOn } from "$lib/stores/useStreamOn";
  import { useShow } from "../../../../useShow";
  import { useEpisode } from "./useEpisode";

  const {
    episode,
    seasons,
    ratings,
    stats,
    watchers,
    crew,
    intl: episodeIntl,
    isLoading: isEpisodeLoading,
  } = $derived(
    useEpisode({
      slug: page.params.slug,
      season: parseInt(page.params.season),
      episode: parseInt(page.params.episode),
    }),
  );

  const {
    show,
    intl: showIntl,
    isLoading: isShowLoading,
  } = $derived(useShow(page.params.slug));

  const { streamOn, isLoading: isLoadingStreamOn } = $derived(
    useStreamOn({
      id: page.params.slug,
      season: parseInt(page.params.season),
      episode: parseInt(page.params.episode),
      type: "episode",
    }),
  );

  const isLoading = $derived(
    $isEpisodeLoading || $isLoadingStreamOn || $isShowLoading,
  );
</script>

<TraktPage
  audience="all"
  title={$episodeIntl?.title ?? $episode?.title}
  info={$episode}
  image={$episode?.cover.url}
  type="movie"
>
  {#if !isLoading}
    <EpisodeSummary
      show={$show!}
      showIntl={$showIntl!}
      episode={$episode!}
      episodeIntl={$episodeIntl!}
      seasons={$seasons!}
      ratings={$ratings!}
      stats={$stats!}
      watchers={$watchers!}
      streamOn={$streamOn}
      crew={$crew!}
    />
  {:else}
    <!-- TODO: remove this when we have empty state, currently prevents content jumps -->
    <RenderFor audience="all" device={["tablet-sm", "tablet-lg", "desktop"]}>
      <div style="height: 100dvh; display:flex"></div>
    </RenderFor>
  {/if}
</TraktPage>
