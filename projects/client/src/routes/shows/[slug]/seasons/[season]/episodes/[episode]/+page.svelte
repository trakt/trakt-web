<script lang="ts">
  import { page } from "$app/state";
  import TraktPage from "$lib/components/layout/TraktPage.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import EpisodeSummary from "$lib/sections/summary/EpisodeSummary.svelte";
  import { useEpisode } from "./useEpisode";

  const { show, episode, seasons, ratings, stats, watchers, intl, isLoading } =
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
>
  {#if !$isLoading}
    <EpisodeSummary
      show={$show!}
      episode={$episode!}
      seasons={$seasons!}
      ratings={$ratings!}
      stats={$stats!}
      watchers={$watchers!}
      intl={$intl!}
    />
  {:else}
    <!-- TODO: remove this when we have empty state, currently prevents content jumps -->
    <RenderFor audience="all" device={["tablet-sm", "tablet-lg", "desktop"]}>
      <div style="height: 100dvh; display:flex"></div>
    </RenderFor>
  {/if}
</TraktPage>
