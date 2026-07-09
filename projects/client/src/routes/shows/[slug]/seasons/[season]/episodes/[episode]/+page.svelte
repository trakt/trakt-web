<script lang="ts">
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import EpisodeSummary from "$lib/sections/summary/EpisodeSummary.svelte";
  import { fromRune } from "$lib/utils/store/fromRune.svelte";
  import type { PageProps } from "./$types";
  import { useEpisode } from "./useEpisode";

  const { params }: PageProps = $props();

  const params$ = fromRune(() => ({
    slug: params.slug,
    season: parseInt(params.season),
    episode: parseInt(params.episode),
  }));

  const { episode, seasons, crew, streamOn, intl, show, showIntl, isLoading } =
    useEpisode(params$);
</script>

<TraktPage
  audience="all"
  title={$intl?.title ?? $episode?.title}
  info={$episode}
  image={$episode?.cover.url}
  type="episode"
  hasDynamicContent={true}
>
  <RenderFor audience="authenticated">
    <NavbarStateSetter mode="minimal" />
  </RenderFor>

  <!-- FIXME: clean up EpisodeSummary component and child components -->
  {#if !$isLoading && $show && $showIntl && $episode && $intl && $seasons && $crew}
    <EpisodeSummary
      show={$show}
      showIntl={$showIntl}
      episode={$episode}
      episodeIntl={$intl}
      seasons={$seasons}
      streamOn={$streamOn}
      crew={$crew}
    />
  {:else}
    <!-- TODO: remove this when we have empty state, currently prevents content jumps -->
    <RenderFor audience="all" device={["tablet-sm", "tablet-lg", "desktop"]}>
      <div style="height: 100dvh; display:flex"></div>
    </RenderFor>
  {/if}
</TraktPage>
