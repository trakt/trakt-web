<script lang="ts">
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag";
  import * as m from "$lib/features/i18n/messages";

  import RenderFor from "$lib/guards/RenderFor.svelte";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
  import type { MediaStudio } from "$lib/requests/models/MediaStudio";
  import type { MediaVideo } from "$lib/requests/models/MediaVideo";
  import type { Season } from "$lib/requests/models/Season";
  import type { SentimentAnalysis } from "$lib/requests/models/SentimentAnalysis.ts";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import CastList from "../lists/CastList.svelte";
  import RelatedList from "../lists/RelatedList.svelte";
  import SeasonList from "../lists/season/SeasonList.svelte";
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

  type ShowSummaryProps = {
    media: ShowEntry;
    studios: MediaStudio[];
    seasons: Season[];
    videos: MediaVideo[];
    currentSeason: number;
    sentiment: SentimentAnalysis | Nil;
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
    sentiment,
  }: ShowSummaryProps = $props();

  const relatedLink = $derived(UrlBuilder.related.show(media.slug));
  const listsLink = $derived(UrlBuilder.popularLists.show(media.slug));

  const networks = $derived(
    [
      ...new Set(
        [media.network, ...seasons.map((s) => s.network)].filter(
          (n): n is string => n != null,
        ),
      ),
    ].map((name) => ({ name })),
  );
</script>

<SummaryDrawer
  {sentiment}
  {studios}
  {crew}
  {media}
  {networks}
  {videos}
  {seasons}
  {currentSeason}
  type="show"
/>

<MediaSummaryHeader
  {media}
  {intl}
  {crew}
  {streamOn}
  {studios}
  {sentiment}
  type="show"
>
  {#snippet contextualContent()}
    <RenderFor audience="all" device={["desktop"]}>
      <WhereToWatchList type="show" {media} {streamOn} variant="inline" />
      <Sentiment {sentiment} slug={media.slug} variant="inline" type="show" />
    </RenderFor>
  {/snippet}
</MediaSummaryHeader>

<RenderFor audience="all" device={["mobile", "tablet-sm", "tablet-lg"]}>
  <WhereToWatchList type="show" {media} {streamOn} />
  <Sentiment {sentiment} slug={media.slug} type="show" />
</RenderFor>

<SeasonList show={media} {seasons} {currentSeason} />

<CastList
  title={m.list_title_actors()}
  cast={crew.cast}
  slug={media.slug}
  type={media.type}
/>

<Comments {media} type="show" />

<VideoList slug={media.slug} {videos} type="show" />

<RenderForFeature flag={FeatureFlag.Soundtrack}>
  {#snippet enabled()}
    <SoundtrackList {media} />
  {/snippet}
</RenderForFeature>

<RelatedList
  title={m.list_title_related_shows()}
  slug={media.slug}
  type="show"
  drilldownLink={relatedLink}
/>

<!-- TODO: move back to designed position when we have faster queries -->
<Lists
  slug={media.slug}
  title={media.title}
  type="show"
  drilldownLink={listsLink}
/>

<TriviaList {media} />
