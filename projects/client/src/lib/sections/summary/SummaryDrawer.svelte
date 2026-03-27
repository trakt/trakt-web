<script lang="ts">
  import { page } from "$app/state";
  import type { MediaVideo } from "$lib/requests/models/MediaVideo";
  import type { SentimentAnalysis } from "$lib/requests/models/SentimentAnalysis";
  import {
    Drawers,
    summaryDrawerNavigation,
  } from "./_internal/summaryDrawerNavigation";
  import CastDrawer from "./components/cast/CastDrawer.svelte";
  import DetailsDrawer from "./components/details/DetailsDrawer.svelte";
  import type { MediaDetailsProps } from "./components/details/MediaDetailsProps";
  import RelatedDrawer from "./components/related/RelatedDrawer.svelte";
  import SentimentDrawer from "./components/sentiment/SentimentDrawer.svelte";
  import VideoDrawer from "./components/videos/VideoDrawer.svelte";

  const {
    sentiment,
    videos,
    ...details
  }: {
    sentiment?: SentimentAnalysis | Nil;
    videos?: MediaVideo[];
  } & MediaDetailsProps = $props();

  const { drawer, close } = $derived(
    summaryDrawerNavigation(page.url.searchParams),
  );

  const mediaSlug = $derived(
    details.type === "episode" ? details.show.slug : details.media.slug,
  );

  const relatedType = $derived(
    details.type === "episode" ? "show" : details.type,
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

{#if drawer === Drawers.Related}
  <RelatedDrawer slug={mediaSlug} type={relatedType} onClose={close} />
{/if}
