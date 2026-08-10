<script lang="ts">
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag";
  import * as m from "$lib/features/i18n/messages";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";

  import type { MediaStudio } from "$lib/requests/models/MediaStudio";
  import type { MediaVideo } from "$lib/requests/models/MediaVideo";
  import type { MovieEntry } from "$lib/requests/models/MovieEntry";
  import type { SentimentAnalysis } from "$lib/requests/models/SentimentAnalysis.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import CastList from "../lists/CastList.svelte";
  import RelatedList from "../lists/RelatedList.svelte";
  import VideoList from "../lists/VideoList.svelte";
  import WhereToWatchList from "../lists/where-to-watch/WhereToWatchList.svelte";
  import Comments from "./components/comments/Comments.svelte";
  import Lists from "./components/lists/Lists.svelte";
  import MediaSummaryHeader from "./components/media/header/MediaSummaryHeader.svelte";
  import Sentiment from "./components/sentiment/Sentiment.svelte";
  import SoundtrackList from "./components/soundtrack/SoundtrackList.svelte";
  import TriviaList from "./components/trivia/TriviaList.svelte";
  import type { CommonMediaSummaryProps } from "./models/CommonMediaSummaryProps";
  import SummaryDrawer from "./SummaryDrawer.svelte";
  import { useIsRevampedSummaryHeader } from "./components/media/header/useIsRevampedSummaryHeader.ts";

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

  /*
    The revamped headers carry trivia themselves, at desktop only. Rendering the
    section as well showed a title's trivia twice, so it stands down exactly where
    the header covers it - see useIsRevampedSummaryHeader.
  */
  const isRevampedHeader = useIsRevampedSummaryHeader();

  const relatedLink = $derived(UrlBuilder.related.movie(media.slug));
  const listsLink = $derived(UrlBuilder.popularLists.movie(media.slug));
</script>

<SummaryDrawer {streamOn} {sentiment} {studios} {crew} {media} {videos} type="movie" />

<MediaSummaryHeader
  {media}
  {intl}
  {streamOn}
  {crew}
  {studios}
  {sentiment}
  type="movie"
>
  {#snippet contextualContent()}
    <RenderFor audience="all" device={["desktop"]}>
      <WhereToWatchList type="movie" {media} {streamOn} variant="inline" />
      <Sentiment {sentiment} slug={media.slug} variant="inline" type="movie" />
    </RenderFor>
  {/snippet}
</MediaSummaryHeader>

<RenderFor audience="all" device={["mobile", "tablet-sm", "tablet-lg"]}>
  <WhereToWatchList type="movie" {media} {streamOn} />
  <Sentiment {sentiment} slug={media.slug} type="movie" />
</RenderFor>

<CastList
  title={m.list_title_actors()}
  cast={crew.cast}
  slug={media.slug}
  type={media.type}
/>

<Comments {media} type="movie" />

<VideoList slug={media.slug} {videos} type="movie" />

<RenderForFeature flag={FeatureFlag.Soundtrack}>
  {#snippet enabled()}
    <SoundtrackList {media} />
  {/snippet}
</RenderForFeature>

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

{#if $isRevampedHeader}
  <RenderFor audience="all" device={["mobile", "tablet-sm", "tablet-lg"]}>
    <TriviaList {media} />
  </RenderFor>
{:else}
  <TriviaList {media} />
{/if}
