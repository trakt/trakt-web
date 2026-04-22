<script lang="ts">
  import { page } from "$app/state";
  import type { MediaVideo } from "$lib/requests/models/MediaVideo";
  import type { Season } from "$lib/requests/models/Season";
  import type { SentimentAnalysis } from "$lib/requests/models/SentimentAnalysis";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry";
  import WhereToWatchDrawer from "$lib/sections/lists/where-to-watch/_internal/WhereToWatchDrawer.svelte";
  import {
    SummaryDrawers,
    summaryDrawerNavigation,
  } from "./_internal/summaryDrawerNavigation";
  import CastDrawer from "./components/cast/CastDrawer.svelte";
  import DetailsDrawer from "./components/details/DetailsDrawer.svelte";
  import type { MediaDetailsProps } from "./components/details/MediaDetailsProps";
  import HistoryDrawer from "./components/history/HistoryDrawer.svelte";
  import SeasonsDrawer from "./components/seasons/SeasonsDrawer.svelte";
  import SentimentDrawer from "./components/sentiment/SentimentDrawer.svelte";
  import TriviaDrawer from "./components/trivia/TriviaDrawer.svelte";
  import VideoDrawer from "./components/videos/VideoDrawer.svelte";

  const {
    sentiment,
    videos,
    seasons,
    currentSeason,
    ...details
  }: {
    sentiment?: SentimentAnalysis | Nil;
    videos?: MediaVideo[];
    seasons?: Season[];
    currentSeason?: number;
  } & MediaDetailsProps = $props();

  const { drawer, close } = $derived(
    summaryDrawerNavigation(page.url.searchParams),
  );

  const mediaSlug = $derived(
    details.type === "episode" ? details.show.slug : details.media.slug,
  );

  const media = $derived("media" in details ? details.media : undefined);

  const showEntry = $derived.by(() => {
    if (details.type === "episode") return details.show;
    if (details.media.type === "show") return details.media as ShowEntry;
  });

  const whereToWatchTarget = $derived(
    details.type === "episode"
      ? {
          type: "episode" as const,
          media: details.show,
          episode: details.episode,
        }
      : { type: details.type, media: details.media },
  );
</script>

{#if drawer === SummaryDrawers.Sentiment && sentiment}
  <SentimentDrawer {sentiment} onClose={close} />
{/if}

{#if drawer === SummaryDrawers.Details}
  <DetailsDrawer {...details} onClose={close} />
{/if}

{#if drawer === SummaryDrawers.Cast}
  <CastDrawer cast={details.crew.cast} type={details.type} onClose={close} />
{/if}

{#if drawer === SummaryDrawers.Videos && videos}
  <VideoDrawer {videos} slug={mediaSlug} onClose={close} />
{/if}

{#if drawer === SummaryDrawers.Trivia && media}
  <TriviaDrawer {media} onClose={close} />
{/if}

{#if drawer === SummaryDrawers.History}
  <HistoryDrawer {...details} onClose={close} />
{/if}

{#if drawer === SummaryDrawers.WhereToWatch}
  <WhereToWatchDrawer {...whereToWatchTarget} onClose={close} />
{/if}

{#if drawer === SummaryDrawers.Seasons && seasons && currentSeason != null && showEntry}
  <SeasonsDrawer show={showEntry} {seasons} {currentSeason} onClose={close} />
{/if}
