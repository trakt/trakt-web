<script lang="ts">
  import * as m from "$lib/features/i18n/messages";

  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { MediaStudio } from "$lib/requests/models/MediaStudio";
  import type { MediaVideo } from "$lib/requests/models/MediaVideo";
  import type { Season } from "$lib/requests/models/Season";
  import type { Sentiments } from "$lib/requests/models/Sentiments";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry";
  import EpisodeItem from "$lib/sections/lists/components/EpisodeItem.svelte";
  import { useShowProgress } from "$lib/stores/useShowProgress";
  import CastList from "../lists/CastList.svelte";
  import MediaWatchHistoryList from "../lists/history/MediaWatchHistoryList.svelte";
  import RelatedList from "../lists/RelatedList.svelte";
  import SeasonList from "../lists/season/SeasonList.svelte";
  import VideoList from "../lists/VideoList.svelte";
  import WhereToWatchList from "../lists/where-to-watch/WhereToWatchList.svelte";
  import Comments from "./components/comments/Comments.svelte";
  import MediaDetails from "./components/details/MediaDetails.svelte";
  import Lists from "./components/lists/Lists.svelte";
  import MediaSummary from "./components/media/MediaSummary.svelte";
  import MediaSummaryV2 from "./components/media/v2/MediaSummary.svelte";
  import CommunitySentiments from "./components/sentiment/CommunitySentiments.svelte";
  import type { CommonMediaSummaryProps } from "./models/CommonMediaSummaryProps";

  type ShowSummaryProps = {
    media: ShowEntry;
    studios: MediaStudio[];
    seasons: Season[];
    videos: MediaVideo[];
    currentSeason: number;
    sentiments: Sentiments | Nil;
  } & CommonMediaSummaryProps;

  const {
    media,
    studios,
    intl,
    crew,
    seasons,
    streamOn,
    videos,
    currentSeason,
    sentiments,
  }: ShowSummaryProps = $props();

  const { progress } = $derived(useShowProgress(media.slug));

  const episode = $derived($progress);
</script>

<RenderFor audience="all" device={["mobile", "tablet-sm"]}>
  <MediaSummaryV2 {media} {studios} {intl} {crew} type="show" />
</RenderFor>

<RenderFor audience="all" device={["tablet-lg", "desktop"]}>
  <MediaSummary {media} {intl} {crew} {streamOn} type="show">
    {#snippet contextualContent()}
      <RenderFor device={["desktop"]} audience="authenticated">
        {#if episode != null && episode.remaining > 0}
          <EpisodeItem {episode} show={media} variant="next" context="show" />
        {/if}
      </RenderFor>
    {/snippet}
  </MediaSummary>
</RenderFor>

<RenderFor audience="authenticated">
  <RenderFor audience="authenticated">
    <WhereToWatchList type="show" {media} {streamOn} />
  </RenderFor>

  <CommunitySentiments {sentiments} slug={media.slug} />

  <Comments {media} type="show" />

  <CastList title={m.list_title_actors()} cast={crew.cast} slug={media.slug} />

  <VideoList slug={media.slug} {videos} />

  <SeasonList show={media} {seasons} {currentSeason} />

  <RelatedList
    title={m.list_title_related_shows()}
    slug={media.slug}
    type="show"
  />

  <!-- TODO: move back to designed position when we have faster queries -->
  <Lists slug={media.slug} title={media.title} type="show" />

  <MediaWatchHistoryList title={m.list_title_history()} {media} type="show" />

  <MediaDetails {studios} {crew} {media} type="show" />
</RenderFor>
