<script lang="ts">
  import * as m from "$lib/features/i18n/messages";
  import RenderFor from "$lib/guards/RenderFor.svelte";

  import type { MediaStudio } from "$lib/requests/models/MediaStudio";
  import type { MediaVideo } from "$lib/requests/models/MediaVideo";
  import type { MovieEntry } from "$lib/requests/models/MovieEntry";
  import type { SentimentAnalysis } from "$lib/requests/models/SentimentAnalysis.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import CastList from "../lists/CastList.svelte";
  import RelatedList from "../lists/RelatedList.svelte";
  import VideoList from "../lists/VideoList.svelte";
  import WhereToWatchList from "../lists/where-to-watch/WhereToWatchList.svelte";
  import {
    Drawers,
    summaryDrawerNavigation,
  } from "./_internal/summaryDrawerNavigation";
  import Comments from "./components/comments/Comments.svelte";
  import Lists from "./components/lists/Lists.svelte";
  import MediaSummary from "./components/media/MediaSummary.svelte";
  import MediaSummaryV2 from "./components/media/v2/MediaSummary.svelte";
  import CommunitySentiment from "./components/sentiment/Sentiment.svelte";
  import TriviaList from "./components/trivia/TriviaList.svelte";
  import type { CommonMediaSummaryProps } from "./models/CommonMediaSummaryProps";
  import SummaryDrawer from "./SummaryDrawer.svelte";

  const { buildDrawerLink } = summaryDrawerNavigation();
  const castDrawerLink = $derived(buildDrawerLink(Drawers.Cast));
  const videosDrawerLink = $derived(buildDrawerLink(Drawers.Videos));

  const {
    media,
    studios,
    intl,
    crew,
    streamOn,
    videos,
    sentiment,
  }: {
    media: MovieEntry;
    studios: MediaStudio[];
    videos: MediaVideo[];
    sentiment: SentimentAnalysis | Nil;
  } & CommonMediaSummaryProps = $props();

  const relatedLink = $derived(UrlBuilder.related.movie(media.slug));
  const listsLink = $derived(UrlBuilder.popularLists.movie(media.slug));
</script>

<SummaryDrawer {sentiment} {studios} {crew} {media} {videos} type="movie" />

<RenderFor audience="all" device={["mobile", "tablet-sm"]}>
  <MediaSummaryV2 {media} {studios} {crew} {intl} type="movie" />
</RenderFor>

<RenderFor audience="all" device={["tablet-lg", "desktop"]}>
  <MediaSummary {media} {intl} {streamOn} {crew} type="movie">
    {#snippet contextualContent()}
      <RenderFor audience="all" device={["desktop"]}>
        <WhereToWatchList type="movie" {media} {streamOn} variant="inline" />
        <CommunitySentiment {sentiment} slug={media.slug} variant="inline" />
      </RenderFor>
    {/snippet}
  </MediaSummary>
</RenderFor>

<RenderFor audience="all" device={["mobile", "tablet-sm", "tablet-lg"]}>
  <WhereToWatchList type="movie" {media} {streamOn} />
  <CommunitySentiment {sentiment} slug={media.slug} />
</RenderFor>

<CastList
  title={m.list_title_actors()}
  cast={crew.cast}
  slug={media.slug}
  type={media.type}
  drilldownLink={castDrawerLink}
/>

<Comments {media} type="movie" />

<VideoList slug={media.slug} {videos} drilldownLink={videosDrawerLink} />

<RelatedList
  title={m.list_title_related_movies()}
  slug={media.slug}
  type="movie"
  drilldownLink={relatedLink}
/>

<!-- TODO: move back to designed position when we have faster queries -->
<Lists
  slug={media.slug}
  title={media.title}
  type="movie"
  drilldownLink={listsLink}
/>

<TriviaList {media} />
