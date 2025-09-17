<script lang="ts">
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag";
  import * as m from "$lib/features/i18n/messages";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";

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
  import MediaSummaryV2 from "./components/media/v2/MediaSummary.svelte";

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

<RenderFor audience="all" device={["mobile"]}>
  <RenderForFeature flag={FeatureFlag.SummaryV2}>
    {#snippet enabled()}
      <MediaSummaryV2 {media} {studios} {crew} {intl} {streamOn} type="movie" />
    {/snippet}

    <MediaSummary {media} {studios} {crew} {intl} {streamOn} type="movie" />
  </RenderForFeature>
</RenderFor>

<RenderFor audience="all" device={["tablet-sm", "tablet-lg", "desktop"]}>
  <MediaSummary {media} {studios} {crew} {intl} {streamOn} type="movie" />
</RenderFor>

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
