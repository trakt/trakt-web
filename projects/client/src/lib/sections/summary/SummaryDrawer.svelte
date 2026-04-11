<script lang="ts">
  import { page } from "$app/state";
  import type { MediaVideo } from "$lib/requests/models/MediaVideo";
  import type { Season } from "$lib/requests/models/Season";
  import type { SentimentAnalysis } from "$lib/requests/models/SentimentAnalysis";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry";
  import WhereToWatchDrawer from "$lib/sections/lists/where-to-watch/_internal/WhereToWatchDrawer.svelte";
  import {
    Drawers,
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
    showEntry,
    ...details
  }: {
    sentiment?: SentimentAnalysis | Nil;
    videos?: MediaVideo[];
    seasons?: Season[];
    currentSeason?: number;
    showEntry?: ShowEntry;
  } & MediaDetailsProps = $props();

  const { drawer, close } = $derived(
    summaryDrawerNavigation(page.url.searchParams),
  );

  const mediaSlug = $derived(
    details.type === "episode" ? details.show.slug : details.media.slug,
  );

  const media = $derived("media" in details ? details.media : undefined);

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

{#if drawer === Drawers.Sentiment && sentiment}
  <SentimentDrawer {sentiment} onClose={close} />
{/if}

{#if drawer === Drawers.Details}
  <DetailsDrawer {...details} onClose={close} />
{/if}

{#if drawer === Drawers.Cast}
  <CastDrawer
    cast={details.crew.cast}
    type={details.type === "episode" ? "show" : details.type}
    onClose={close}
  />
{/if}

{#if drawer === Drawers.Videos && videos}
  <VideoDrawer {videos} slug={mediaSlug} onClose={close} />
{/if}

{#if drawer === Drawers.Trivia && media}
  <TriviaDrawer {media} onClose={close} />
{/if}

{#if drawer === Drawers.History}
  <HistoryDrawer {...details} onClose={close} />
{/if}

{#if drawer === Drawers.WhereToWatch}
  <WhereToWatchDrawer {...whereToWatchTarget} onClose={close} />
{/if}

{#if drawer === Drawers.Seasons && seasons && currentSeason != null && showEntry}
  <SeasonsDrawer show={showEntry} {seasons} {currentSeason} onClose={close} />
{/if}
