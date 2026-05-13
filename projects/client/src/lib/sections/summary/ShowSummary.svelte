<script lang="ts">
  import Carousel from "$lib/components/carousel/Carousel.svelte";
  import { languageTag } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";

  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { MediaStudio } from "$lib/requests/models/MediaStudio";
  import type { MediaVideo } from "$lib/requests/models/MediaVideo";
  import type { Season } from "$lib/requests/models/Season";
  import type { SentimentAnalysis } from "$lib/requests/models/SentimentAnalysis.ts";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry";
  import { useShowProgress } from "$lib/stores/useShowProgress";
  import { EPISODE_COVER_PLACEHOLDER } from "$lib/utils/assets";
  import { toHumanDuration } from "$lib/utils/formatting/date/toHumanDuration";
  import { episodeActivityTitle } from "$lib/utils/intl/episodeActivityTitle";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import CastList from "../lists/CastList.svelte";
  import RelatedList from "../lists/RelatedList.svelte";
  import SeasonList from "../lists/season/SeasonList.svelte";
  import VideoList from "../lists/VideoList.svelte";
  import WhereToWatchList from "../lists/where-to-watch/WhereToWatchList.svelte";
  import NavbarStateSetter from "../navbar/NavbarStateSetter.svelte";
  import SummaryRateNow from "./components/_internal/SummaryRateNow.svelte";
  import Comments from "./components/comments/Comments.svelte";
  import Lists from "./components/lists/Lists.svelte";
  import MediaSummary from "./components/media/MediaSummary.svelte";
  import MediaSummaryV2 from "./components/media/v2/MediaSummary.svelte";
  import { useIsRateable } from "./components/rating/_internal/useIsRateable";
  import Sentiment from "./components/sentiment/Sentiment.svelte";
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

  const { isRateable } = $derived(useIsRateable({ type: "show", media }));

  const { progress } = $derived(useShowProgress(media.slug));

  const episode = $derived($progress);
  const episodeRuntime = $derived(episode?.runtime ?? 0);
  const episodeRemaining = $derived(episode?.remaining ?? 0);
  const episodeTitle = $derived.by(() => {
    if (!episode) return "";
    return episodeActivityTitle(episode);
  });

  const hasProgress = $derived(episode && episode.id !== -1);
</script>

{#snippet rateContent()}
  <SummaryRateNow type="show" {media} />
{/snippet}

{#snippet progressContent()}
  <div class="up-next">
    <div class="poster">
      <CrossOriginImage
        classList="trakt-card-cover-image"
        src={episode?.cover.url ?? EPISODE_COVER_PLACEHOLDER}
        alt="whatever"
      />
    </div>
    <div class="info">
      <span class="secondary">
        {#if episode?.season === 1 && episode?.number === 1}
          Start watching
        {:else}
          Continue watching
        {/if}
      </span>
      <span class="ellipsis">
        {`${episodeTitle} (${toHumanDuration({ minutes: episodeRuntime }, languageTag())})`}
      </span>
      <span class="tag ellipsis">
        {`${episodeRemaining} left (${toHumanDuration({ minutes: episodeRemaining * episodeRuntime }, languageTag())})`}
      </span>
    </div>
  </div>
{/snippet}

{#if hasProgress || $isRateable}
  <NavbarStateSetter>
    {#snippet contextualActions()}
      {#if $isRateable && hasProgress}
        <Carousel items={[progressContent, rateContent]} />
      {:else if hasProgress}
        {@render progressContent()}
      {:else}
        {@render rateContent()}
      {/if}
    {/snippet}
  </NavbarStateSetter>
{/if}

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

<RenderFor audience="all" device={["mobile", "tablet-sm"]}>
  <MediaSummaryV2 {media} {studios} {intl} {crew} type="show" />
</RenderFor>

<RenderFor audience="all" device={["tablet-lg", "desktop"]}>
  <MediaSummary {media} {intl} {crew} {streamOn} type="show">
    {#snippet contextualContent()}
      <RenderFor audience="all" device={["desktop"]}>
        <WhereToWatchList type="show" {media} {streamOn} variant="inline" />
        <Sentiment {sentiment} slug={media.slug} variant="inline" />
      </RenderFor>
    {/snippet}
  </MediaSummary>
</RenderFor>

<RenderFor audience="all" device={["mobile", "tablet-sm", "tablet-lg"]}>
  <WhereToWatchList type="show" {media} {streamOn} />
  <Sentiment {sentiment} slug={media.slug} />
</RenderFor>

<CastList
  title={m.list_title_actors()}
  cast={crew.cast}
  slug={media.slug}
  type={media.type}
/>

<Comments {media} type="show" />

<VideoList slug={media.slug} {videos} />

<SeasonList show={media} {seasons} {currentSeason} />

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

<style>
  .up-next {
    --up-next-height: var(--ni-48);
    height: var(--up-next-height);
    width: 100%;

    display: flex;
    align-items: center;
    gap: var(--gap-s);

    .poster {
      display: contents;

      :global(img) {
        padding-top: var(--ni-2);
        height: var(--up-next-height);
        width: calc(var(--up-next-height) * (16 / 9));
        border-radius: var(--border-radius-s);
      }
    }

    .info {
      display: flex;
      flex-direction: column;
    }
  }
</style>
