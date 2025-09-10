<script lang="ts">
  import * as m from "$lib/features/i18n/messages";

  import type { MediaCrew } from "$lib/requests/models/MediaCrew";
  import type { MediaStudio } from "$lib/requests/models/MediaStudio";
  import type { MediaVideo } from "$lib/requests/models/MediaVideo";
  import type { MovieEntry } from "$lib/requests/models/MovieEntry";
  import CastList from "../lists/CastList.svelte";
  import MediaWatchHistoryList from "../lists/history/MediaWatchHistoryList.svelte";
  import RelatedList from "../lists/RelatedList.svelte";
  import VideoList from "../lists/VideoList.svelte";
  import Comments from "./components/comments/Comments.svelte";
  import Lists from "./components/lists/Lists.svelte";
  import MediaSummary from "./components/media/MediaSummary.svelte";
  import type { MediaSummaryProps } from "./components/media/MediaSummaryProps";

  const {
    media,
    studios,
    intl,
    crew,
    streamOn,
    videos,
  }: MediaSummaryProps<MovieEntry> & {
    studios: MediaStudio[];
    crew: MediaCrew;
    videos: MediaVideo[];
  } = $props();
</script>

<MediaSummary {media} {studios} {crew} {intl} {streamOn} type="movie" />

<CastList title={m.list_title_actors()} cast={crew.cast} slug={media.slug} />

<VideoList slug={media.slug} {videos} />

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
