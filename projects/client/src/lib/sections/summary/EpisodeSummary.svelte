<script lang="ts">
  import CoverImageSetter from "$lib/components/background/CoverImageSetter.svelte";
  import MarkAsWatchedButton from "$lib/components/buttons/mark-as-watched/MarkAsWatchedButton.svelte";
  import type { MarkAsWatchedButtonProps } from "$lib/components/buttons/mark-as-watched/MarkAsWatchedButtonProps";
  import Link from "$lib/components/link/Link.svelte";
  import SummaryPoster from "$lib/components/summary/SummaryPoster.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { ActiveWatcher } from "$lib/models/ActiveWatcher";
  import type { EpisodeEntry } from "$lib/models/EpisodeEntry";
  import type { EpisodeIntl } from "$lib/models/EpisodeIntl";
  import type { MediaRating } from "$lib/models/MediaRating";
  import type { MediaStats } from "$lib/models/MediaStats";
  import type { MediaSummary } from "$lib/requests/models/MediaSummary";
  import { useMarkAsWatched } from "$lib/stores/useMarkAsWatched";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import type { Snippet } from "svelte";
  import EpisodeSummaryInfo from "./components/EpisodeSummaryInfo.svelte";
  import MediaSummaryContainer from "./components/MediaSummaryContainer.svelte";

  const {
    episode,
    show,
    ratings,
    intl,
    stats,
    watchers,
  }: {
    episode: EpisodeEntry;
    show: MediaSummary;
    ratings: MediaRating;
    watchers: ActiveWatcher[];
    stats: MediaStats;
    intl: EpisodeIntl;
    actions?: Snippet;
  } = $props();
  const type = "episode";

  const { markAsWatched, removeWatched, isMarkingAsWatched, isWatched } =
    $derived(
      useMarkAsWatched({
        type,
        media: episode,
        episode,
        show,
      }),
    );

  const title = $derived(intl.title ?? episode.title);

  const markWasWatchedProps: MarkAsWatchedButtonProps = $derived({
    type: "normal",
    title,
    isMarkingAsWatched: $isMarkingAsWatched,
    isWatched: $isWatched,
    onWatch: markAsWatched,
    onRemove: removeWatched,
  });
</script>

{#snippet mediaActions()}
  <MarkAsWatchedButton {...markWasWatchedProps} />
{/snippet}

<CoverImageSetter src={episode.cover.url ?? ""} type="show" />

<MediaSummaryContainer>
  {#snippet poster()}
    <Link href={UrlBuilder.show(show.slug)}>
      <SummaryPoster src={show.poster.url.medium} alt={title}>
        {#snippet actions()}
          <RenderFor device={["tablet-lg", "desktop"]} audience="authenticated">
            {@render mediaActions()}
          </RenderFor>
        {/snippet}
      </SummaryPoster>
    </Link>
  {/snippet}

  <EpisodeSummaryInfo {episode} {show} {ratings} {stats} {watchers} {intl}>
    {#snippet actions()}
      <RenderFor device={["mobile", "tablet-sm"]} audience="authenticated">
        {@render mediaActions()}
      </RenderFor>
    {/snippet}
  </EpisodeSummaryInfo>
</MediaSummaryContainer>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  :global(.trakt-info-actions) {
    @include for-tablet-sm-and-below {
      display: flex;
      flex-flow: column;

      gap: var(--ni-24);

      padding: var(--ni-16);
    }
  }
</style>
