<script lang="ts">
  import BackgroundCoverImage from "$lib/components/background/BackgroundCoverImage.svelte";
  import MarkAsWatchedButton from "$lib/components/buttons/mark-as-watched/MarkAsWatchedButton.svelte";
  import type { MarkAsWatchedButtonProps } from "$lib/components/buttons/mark-as-watched/MarkAsWatchedButtonProps";
  import WatchNowButton from "$lib/components/buttons/watch-now/WatchNowButton.svelte";
  import WatchlistButton from "$lib/components/buttons/watchlist/WatchlistButton.svelte";
  import type { WatchlistButtonProps } from "$lib/components/buttons/watchlist/WatchlistButtonProps";
  import SummaryPoster from "$lib/components/summary/SummaryPoster.svelte";
  import ThirdPartyRatingsList from "$lib/components/summary/ThirdPartyRatingsList.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { MediaStats } from "$lib/models/MediaStats";
  import type { MediaStudio } from "$lib/models/MediaStudio";
  import type { MediaType } from "$lib/models/MediaType";
  import type { MediaCrew } from "$lib/requests/models/MediaCrew";
  import { useMarkAsWatched } from "$lib/stores/useMarkAsWatched";
  import { useWatchlist } from "$lib/stores/useWatchlist";
  import { useWatchNow } from "$lib/stores/useWatchNow";
  import type { Snippet } from "svelte";
  import MediaDetails from "./MediaDetails.svelte";
  import MediaStatsList from "./MediaStatsList.svelte";
  import type { MediaSummary } from "./MediaSummary";
  import MediaSummaryContainer from "./MediaSummaryContainer.svelte";
  import MediaSummaryInfo from "./MediaSummaryInfo.svelte";
  import type { MediaSummaryProps } from "./MediaSummaryProps";
  import YoutubeButton from "./YoutubeButton.svelte";

  const {
    media,
    ratings,
    type,
    intl,
    contextualContent,
    stats,
    watchers,
    studios,
    crew,
  }: MediaSummaryProps<MediaSummary> & {
    type: MediaType;
    contextualContent?: Snippet;
    stats: MediaStats;
    studios: MediaStudio[];
    crew: MediaCrew;
  } = $props();

  const { markAsWatched, removeWatched, isMarkingAsWatched, isWatched } =
    $derived(
      useMarkAsWatched({
        type,
        id: media.id,
      }),
    );

  const {
    isWatchlistUpdating,
    isWatchlisted,
    addToWatchlist,
    removeFromWatchlist,
  } = $derived(
    useWatchlist({
      type,
      id: media.id,
    }),
  );

  const watchlistProps: WatchlistButtonProps = $derived({
    title: intl.title,
    isWatchlistUpdating: $isWatchlistUpdating,
    isWatchlisted: $isWatchlisted,
    onAdd: addToWatchlist,
    onRemove: removeFromWatchlist,
  });

  const markWasWatchedProps: MarkAsWatchedButtonProps = $derived({
    title: intl.title,
    isMarkingAsWatched: $isMarkingAsWatched,
    isWatched: $isWatched,
    onWatch: markAsWatched,
    onRemove: removeWatched,
  });

  const { watchNow, isLoading } = useWatchNow({ type, id: media.slug });
</script>

{#snippet mediaActions()}
  <WatchNowButton
    isLoading={$isLoading}
    streamingLink={$watchNow?.link}
    mediaTitle={media.title}
  />
  <WatchlistButton {...watchlistProps} />
  <MarkAsWatchedButton {...markWasWatchedProps} />
{/snippet}

<BackgroundCoverImage src={media.cover.url.medium} {type} />

<MediaSummaryContainer {contextualContent}>
  {#snippet poster()}
    <SummaryPoster src={media.poster.url.medium} alt={intl.title}>
      {#snippet actions()}
        <RenderFor device={["tablet-lg", "desktop"]} audience="authenticated">
          {@render mediaActions()}
        </RenderFor>
      {/snippet}
    </SummaryPoster>
  {/snippet}

  <MediaSummaryInfo {media} {ratings} {watchers} {intl}>
    {#snippet actions()}
      <RenderFor device={["mobile", "tablet-sm"]} audience="authenticated">
        {@render mediaActions()}
      </RenderFor>
      <YoutubeButton trailer={media.trailer} />
    {/snippet}
  </MediaSummaryInfo>
</MediaSummaryContainer>

<MediaSummaryContainer>
  <MediaStatsList {stats} />
  <ThirdPartyRatingsList {ratings} />
  <MediaDetails {media} {studios} {crew} />
</MediaSummaryContainer>

<style lang="scss">
  @use "$style/mixins/index" as *;

  :global(.trakt-info-actions) {
    @include for-tablet-sm-and-below {
      display: flex;
      flex-flow: column;

      gap: var(--ni-24);

      padding: var(--ni-16);
    }
  }
</style>
