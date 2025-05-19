<script lang="ts">
  import { page } from "$app/state";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import EpisodeSummary from "$lib/sections/summary/EpisodeSummary.svelte";
  import { useEpisode } from "./useEpisode";

  const { episode, seasons, crew, streamOn, intl, show, showIntl, isLoading } =
    $derived(
      useEpisode({
        slug: page.params.slug,
        season: parseInt(page.params.season),
        episode: parseInt(page.params.episode),
      }),
    );
</script>

<TraktPage
  audience="all"
  title={$intl?.title ?? $episode?.title}
  info={$episode}
  image={$episode?.cover.url}
  type="movie"
  hasDynamicContent={true}
>
  {#if !$isLoading}
    <EpisodeSummary
      show={$show!}
      showIntl={$showIntl!}
      episode={$episode!}
      episodeIntl={$intl!}
      seasons={$seasons!}
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
