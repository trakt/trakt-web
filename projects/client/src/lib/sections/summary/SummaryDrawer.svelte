<script lang="ts">
  import { page } from "$app/state";
  import { onMount } from "svelte";
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
  import type { MediaVideo } from "$lib/requests/models/MediaVideo";
  import type { Season } from "$lib/requests/models/Season";
  import type { SentimentAnalysis } from "$lib/requests/models/SentimentAnalysis";
  import type { StreamOn } from "$lib/requests/models/StreamOn";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry";
  import type { MediaSocialQueryTarget } from "$lib/requests/queries/media/mediaSocialQuery.ts";
  import RewatchingDrawerHost from "$lib/sections/media-actions/rewatching/RewatchingDrawerHost.svelte";
  import WhereToWatchDrawerHost from "$lib/sections/lists/where-to-watch/WhereToWatchDrawerHost.svelte";
  import { episodeActivityTitle } from "$lib/utils/intl/episodeActivityTitle.ts";
  import { SummaryDrawers } from "$lib/sections/summary/SummaryDrawers.ts";
  import { summaryDrawerNavigation } from "$lib/sections/summary/summaryDrawerNavigation.ts";
  import CastDrawerHost from "./components/cast/CastDrawerHost.svelte";
  import GlanceDrawerHost from "./components/media/header/GlanceDrawerHost.svelte";
  import MediaReactionsDrawerHost from "$lib/features/media-reactions/MediaReactionsDrawerHost.svelte";
  import type { CommentsProps } from "./components/comments/CommentsProps";
  import CommentsDrawerHost from "./components/comments/drawers/CommentsDrawerHost.svelte";
  import ReviewDrawerHost from "./components/comments/drawers/ReviewDrawerHost.svelte";
  import DetailsDrawer from "./components/details/DetailsDrawer.svelte";
  import EpisodeDrawerHost from "./components/episode-drawer/EpisodeDrawerHost.svelte";
  import type { MediaDetailsProps } from "./components/details/MediaDetailsProps";
  import HistoryDrawerHost from "./components/history/HistoryDrawerHost.svelte";
  import NotesDrawerHost from "./components/notes/NotesDrawerHost.svelte";
  import RatingsDrawer from "./components/rating/RatingsDrawer.svelte";
  import SeasonsDrawerHost from "./components/seasons/SeasonsDrawerHost.svelte";
  import SentimentDrawer from "./components/sentiment/SentimentDrawer.svelte";
  import SocialDrawerHost from "./components/social/SocialDrawerHost.svelte";
  import SoundtrackDrawerHost from "./components/soundtrack/SoundtrackDrawerHost.svelte";
  import TriviaDrawerHost from "./components/trivia/TriviaDrawerHost.svelte";
  import VideoDrawerHost from "./components/videos/VideoDrawerHost.svelte";

  const {
    sentiment,
    videos,
    seasons,
    currentSeason,
    streamOn,
    ...details
  }: {
    sentiment?: SentimentAnalysis | null | undefined;
    videos?: MediaVideo[];
    seasons?: Season[];
    currentSeason?: number;
    streamOn?: StreamOn;
  } & MediaDetailsProps = $props();

  const {
    drawer,
    close,
    closeCommentDrawer,
    sourceCommentId,
    sourceEpisode,
  } = $derived(summaryDrawerNavigation(page.url.searchParams));

  const navigationOnEntry = summaryDrawerNavigation(
    new URLSearchParams(page.url.search),
  );
  const commentIdOnEntry = navigationOnEntry.drawer === SummaryDrawers.Comments
    ? navigationOnEntry.sourceCommentId
    : undefined;

  let isResolvingEntryComment = $state(commentIdOnEntry != null);

  onMount(async () => {
    if (commentIdOnEntry == null) {
      return;
    }

    await navigationOnEntry.openReviewDrawer(commentIdOnEntry);
    isResolvingEntryComment = false;
  });

  const isSingleCommentOpen = $derived(
    sourceCommentId != null &&
      (drawer === SummaryDrawers.Review ||
        drawer === SummaryDrawers.Episode),
  );

  const commentsProps = $derived.by((): CommentsProps => {
    if (details.type === "episode") {
      return {
        media: details.show,
        type: "episode",
        season: details.episode.season,
        episode: details.episode.number,
        id: details.episode.id,
      };
    }
    return { media: details.media, type: details.type };
  });

  const mediaSlug = $derived(
    details.type === "episode" ? details.show.slug : details.media.slug,
  );

  const media = $derived("media" in details ? details.media : undefined);

  const showEntry = $derived.by(() => {
    if (details.type === "episode") return details.show;
    if (details.media.type === "show") return details.media as ShowEntry;
  });

  const whereToWatchTarget = $derived(
    details.type === "episode"
      ? {
          type: "episode" as const,
          media: details.show,
          episode: details.episode,
        }
      : { type: details.type, media: details.media },
  );

  const socialTarget = $derived.by((): MediaSocialQueryTarget => {
    if (details.type === "episode") {
      return {
        type: "episode",
        slug: details.show.slug,
        season: details.episode.season,
        episode: details.episode.number,
      };
    }

    return { type: details.type, slug: details.media.slug };
  });

  const socialTitle = $derived.by(() =>
    details.type === "episode"
      ? episodeActivityTitle(details.episode, details.show)
      : details.media.title,
  );
</script>

{#if drawer === SummaryDrawers.Sentiment && sentiment}
  <SentimentDrawer {sentiment} onClose={close} />
{/if}

{#if drawer === SummaryDrawers.Details}
  <DetailsDrawer {...details} onClose={close} />
{/if}

{#if drawer === SummaryDrawers.Cast}
  <CastDrawerHost crew={details.crew} type={details.type} onClose={close} />
{/if}

{#if drawer === SummaryDrawers.Videos && videos}
  <VideoDrawerHost {videos} slug={mediaSlug} onClose={close} />
{/if}

{#if drawer === SummaryDrawers.Trivia && media}
  <TriviaDrawerHost {media} onClose={close} />
{/if}

{#if drawer === SummaryDrawers.Soundtrack && media}
  <RenderForFeature flag={FeatureFlag.Soundtrack}>
    {#snippet enabled()}
      <SoundtrackDrawerHost {media} onClose={close} />
    {/snippet}
  </RenderForFeature>
{/if}

{#if drawer === SummaryDrawers.History}
  <HistoryDrawerHost {...details} onClose={close} />
{/if}

{#if drawer === SummaryDrawers.Social}
  <SocialDrawerHost target={socialTarget} title={socialTitle} onClose={close} />
{/if}

{#if drawer === SummaryDrawers.Notes && media}
  <NotesDrawerHost {media} onClose={close} />
{/if}

{#if drawer === SummaryDrawers.WhereToWatch}
  <WhereToWatchDrawerHost {...whereToWatchTarget} onClose={close} />
{/if}

{#if drawer === SummaryDrawers.Seasons && seasons && currentSeason != null && showEntry}
  <SeasonsDrawerHost
    show={showEntry}
    {seasons}
    {currentSeason}
    onClose={close}
  />
{/if}

{#if drawer === SummaryDrawers.Episode && seasons && currentSeason != null && sourceEpisode != null && showEntry}
  <EpisodeDrawerHost
    show={showEntry}
    {seasons}
    season={currentSeason}
    episode={sourceEpisode}
    onClose={close}
  />
{/if}

{#if drawer === SummaryDrawers.Comments && !isResolvingEntryComment}
  <CommentsDrawerHost
    {...commentsProps}
    source={sourceCommentId != null
      ? { id: sourceCommentId, isReplying: false }
      : undefined}
    onClose={close}
  />
{/if}

{#if isSingleCommentOpen && sourceCommentId != null}
  <ReviewDrawerHost
    {...commentsProps}
    commentId={sourceCommentId}
    elevated={drawer === SummaryDrawers.Episode}
    onClose={closeCommentDrawer}
  />
{/if}

{#if drawer === SummaryDrawers.Glance && details.type !== "episode"}
  <GlanceDrawerHost
    entry={details.type === "show"
      ? { type: "show", media: details.media }
      : { type: "movie", media: details.media }}
    crew={details.crew}
    {sentiment}
    {streamOn}
    onClose={close}
  />
{/if}

{#if drawer === SummaryDrawers.Reactions && details.type !== "episode"}
  <RenderForFeature flag={FeatureFlag.Reactions} audience="director">
    {#snippet enabled()}
      <MediaReactionsDrawerHost
        type={details.type}
        slug={details.media.slug}
        title={details.media.title}
        onClose={close}
      />
    {/snippet}
  </RenderForFeature>
{/if}

{#if drawer === SummaryDrawers.Ratings}
  <RatingsDrawer {...details} {seasons} onClose={close} />
{/if}

{#if drawer === SummaryDrawers.Rewatching && showEntry}
  <RenderForFeature flag={FeatureFlag.Rewatching}>
    {#snippet enabled()}
      <RewatchingDrawerHost show={showEntry} onClose={close} />
    {/snippet}
  </RenderForFeature>
{/if}
