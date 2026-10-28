<script lang="ts">
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import EpisodeSummary from "$lib/sections/summary/EpisodeSummary.svelte";
  import { fromRune } from "$lib/utils/store/fromRune.svelte";
  import type { PageProps } from "./$types";
  import { useEpisode } from "./useEpisode";
  import SummaryPageSkeleton from "$lib/sections/summary/SummaryPageSkeleton.svelte";
  import { fade } from "svelte/transition";

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
