<script lang="ts">
  import { page } from "$app/state";
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
  import type { MediaVideo } from "$lib/requests/models/MediaVideo";
  import type { Season } from "$lib/requests/models/Season";
  import type { SentimentAnalysis } from "$lib/requests/models/SentimentAnalysis";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry";
  import type { MediaSocialQueryTarget } from "$lib/requests/queries/media/mediaSocialQuery.ts";
  import RewatchingDrawerHost from "$lib/sections/media-actions/rewatching/RewatchingDrawerHost.svelte";
  import WhereToWatchDrawerHost from "$lib/sections/lists/where-to-watch/_internal/WhereToWatchDrawerHost.svelte";
  import { episodeActivityTitle } from "$lib/utils/intl/episodeActivityTitle.ts";
  import {
    SummaryDrawers,
    summaryDrawerNavigation,
  } from "./_internal/summaryDrawerNavigation";
  import CastDrawerHost from "./components/cast/CastDrawerHost.svelte";
  import type { CommentsProps } from "./components/comments/CommentsProps";
  import CommentsDrawerHost from "./components/comments/drawers/CommentsDrawerHost.svelte";
  import ReviewDrawerHost from "./components/comments/drawers/ReviewDrawerHost.svelte";
  import DetailsDrawer from "./components/details/DetailsDrawer.svelte";
  import type { MediaDetailsProps } from "./components/details/MediaDetailsProps";
  import HistoryDrawerHost from "./components/history/HistoryDrawerHost.svelte";
  import NotesDrawerHost from "./components/notes/NotesDrawerHost.svelte";
  import RatingsDrawer from "./components/rating/RatingsDrawer.svelte";
  import SeasonsDrawerHost from "./components/seasons/SeasonsDrawerHost.svelte";
  import SentimentDrawer from "./components/sentiment/SentimentDrawer.svelte";
  import SocialDrawerHost from "./components/social/SocialDrawerHost.svelte";
  import TriviaDrawerHost from "./components/trivia/TriviaDrawerHost.svelte";
  import VideoDrawerHost from "./components/videos/VideoDrawerHost.svelte";

  const {
    sentiment,
    videos,
    seasons,
    currentSeason,
    ...details
  }: {
    sentiment?: SentimentAnalysis | null | undefined;
    videos?: MediaVideo[];
    seasons?: Season[];
    currentSeason?: number;
  } & MediaDetailsProps = $props();

  const { drawer, close, sourceCommentId } = $derived(
    summaryDrawerNavigation(page.url.searchParams),
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
    crew={details.crew}
    onClose={close}
  />
{/if}

{#if drawer === SummaryDrawers.Comments}
  <CommentsDrawerHost
    {...commentsProps}
    source={sourceCommentId != null
      ? { id: sourceCommentId, isReplying: false }
      : undefined}
    onClose={close}
  />
{/if}

{#if drawer === SummaryDrawers.Review && sourceCommentId != null}
  <ReviewDrawerHost
    {...commentsProps}
    commentId={sourceCommentId}
    onClose={close}
  />
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
