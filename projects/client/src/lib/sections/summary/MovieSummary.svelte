<script lang="ts">
  import * as m from "$lib/features/i18n/messages";
  import RenderFor from "$lib/guards/RenderFor.svelte";

  import type { MediaStudio } from "$lib/requests/models/MediaStudio";
  import type { MediaVideo } from "$lib/requests/models/MediaVideo";
  import type { MovieEntry } from "$lib/requests/models/MovieEntry";
  import type { Sentiments } from "$lib/requests/models/Sentiments";
  import CastList from "../lists/CastList.svelte";
  import MediaWatchHistoryList from "../lists/history/MediaWatchHistoryList.svelte";
  import RelatedList from "../lists/RelatedList.svelte";
  import VideoList from "../lists/VideoList.svelte";
  import WhereToWatchList from "../lists/where-to-watch/WhereToWatchList.svelte";
  import Comments from "./components/comments/Comments.svelte";
  import MediaDetails from "./components/details/MediaDetails.svelte";
  import Lists from "./components/lists/Lists.svelte";
  import MediaSummary from "./components/media/MediaSummary.svelte";
  import MediaSummaryV2 from "./components/media/v2/MediaSummary.svelte";
  import CommunitySentiments from "./components/sentiment/CommunitySentiments.svelte";
  import TriviaList from "./components/trivia/TriviaList.svelte";
  import type { CommonMediaSummaryProps } from "./models/CommonMediaSummaryProps";

  const {
    media,
    studios,
    intl,
    crew,
    streamOn,
    videos,
    sentiments,
  }: {
    media: MovieEntry;
    studios: MediaStudio[];
    videos: MediaVideo[];
    sentiments: Sentiments | Nil;
  } & CommonMediaSummaryProps = $props();
</script>

<RenderFor audience="all" device={["mobile", "tablet-sm"]}>
  <MediaSummaryV2 {media} {studios} {crew} {intl} type="movie" />
</RenderFor>

<RenderFor audience="all" device={["tablet-lg", "desktop"]}>
  <MediaSummary {media} {intl} {streamOn} {crew} type="movie">
    {#snippet contextualContent()}
      <RenderFor audience="authenticated" device={["desktop"]}>
        <WhereToWatchList type="movie" {media} {streamOn} variant="inline" />

        <CommunitySentiments {sentiments} slug={media.slug} variant="inline" />
      </RenderFor>
    {/snippet}
  </MediaSummary>
</RenderFor>

<RenderFor
  audience="authenticated"
  device={["mobile", "tablet-sm", "tablet-lg"]}
>
  <WhereToWatchList type="movie" {media} {streamOn} />

  <CommunitySentiments {sentiments} slug={media.slug} />
</RenderFor>

<CastList title={m.list_title_actors()} cast={crew.cast} slug={media.slug} />

<Comments {media} type="movie" />

<VideoList slug={media.slug} {videos} />

<RelatedList
  title={m.list_title_related_movies()}
  slug={media.slug}
  type="movie"
/>

<!-- TODO: move back to designed position when we have faster queries -->
<Lists slug={media.slug} title={media.title} type="movie" />

<MediaWatchHistoryList title={m.list_title_history()} {media} type="movie" />

<TriviaList {media} />

<MediaDetails {studios} {crew} {media} type="movie" />
