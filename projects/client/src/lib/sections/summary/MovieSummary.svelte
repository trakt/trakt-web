<script lang="ts">
  import * as m from "$lib/features/i18n/messages";
  import RenderFor from "$lib/guards/RenderFor.svelte";

  import type { MediaCrew } from "$lib/requests/models/MediaCrew";
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
  import Lists from "./components/lists/Lists.svelte";
  import MediaSummary from "./components/media/MediaSummary.svelte";
  import type { MediaSummaryProps } from "./components/media/MediaSummaryProps";
  import MediaSummaryV2 from "./components/media/v2/MediaSummary.svelte";
  import CommunitySentiments from "./components/sentiment/CommunitySentiments.svelte";

  const {
    media,
    studios,
    intl,
    crew,
    streamOn,
    videos,
    sentiments,
  }: MediaSummaryProps<MovieEntry> & {
    studios: MediaStudio[];
    crew: MediaCrew;
    videos: MediaVideo[];
    sentiments: Sentiments | Nil;
  } = $props();
</script>

<RenderFor audience="all" device={["mobile"]}>
  <MediaSummaryV2 {media} {studios} {crew} {intl} type="movie" />
</RenderFor>

<RenderFor audience="all" device={["tablet-sm", "tablet-lg", "desktop"]}>
  <MediaSummary {media} {studios} {crew} {intl} {streamOn} type="movie" />
</RenderFor>

<RenderFor audience="authenticated" navigation="default">
  <WhereToWatchList slug={media.slug} {streamOn} />
</RenderFor>

<CastList title={m.list_title_actors()} cast={crew.cast} slug={media.slug} />

<VideoList slug={media.slug} {videos} />

<CommunitySentiments {sentiments} slug={media.slug} />

<Comments {media} type="movie" />

<RelatedList
  title={m.list_title_related_movies()}
  slug={media.slug}
  type="movie"
/>

<!-- TODO: move back to designed position when we have faster queries -->
<Lists slug={media.slug} title={media.title} type="movie" />

<MediaWatchHistoryList
  title={m.list_title_watch_history()}
  {media}
  type="movie"
/>
