<script lang="ts">
  import CoverImageSetter from "$lib/components/background/CoverImageSetter.svelte";
  import { TagIntlProvider } from "$lib/components/media/tags/TagIntlProvider";
  import WatchCountTag from "$lib/components/media/tags/WatchCountTag.svelte";
  import RatingList from "$lib/components/summary/RatingList.svelte";
  import SummaryPoster from "$lib/components/summary/SummaryPoster.svelte";
  import Spoiler from "$lib/features/spoilers/components/Spoiler.svelte";
  import type { MediaCrew } from "$lib/requests/models/MediaCrew";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import type { MediaStudio } from "$lib/requests/models/MediaStudio";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import MarkAsWatchedAction from "$lib/sections/media-actions/mark-as-watched/MarkAsWatchedAction.svelte";
  import { type MarkAsWatchedActionProps } from "$lib/sections/media-actions/mark-as-watched/MarkAsWatchedActionProps";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import { useWatchCount } from "$lib/stores/useWatchCount";
  import MediaDetails from "../../details/MediaDetails.svelte";
  import SummaryOverview from "../../summary/SummaryOverview.svelte";
  import type { MediaSummaryProps } from "../MediaSummaryProps";
  import { useMediaMetaInfo } from "../useMediaMetaInfo";
  import MediaActions from "./_internal/MediaActions.svelte";
  import SideActions from "./_internal/SideActions.svelte";
  import SummaryTitle from "./_internal/SummaryTitle.svelte";
  import { TraktIntlProvider } from "./_internal/TraktIntlProvider";

  const {
    media,
    type,
    intl,
    studios,
    crew,
    streamOn,
  }: MediaSummaryProps<MediaEntry> & {
    type: MediaType;
    studios: MediaStudio[];
    crew: MediaCrew;
  } = $props();

  const title = $derived(intl?.title ?? media?.title ?? "");
  const isMobile = useMedia(WellKnownMediaQuery.mobile);

  const { watchCount } = $derived(useWatchCount({ media, type }));
  const { ratings } = $derived(useMediaMetaInfo({ media, type }));

  const commonProps = $derived({
    size: $isMobile ? ("small" as const) : ("normal" as const),
    title,
    type,
    media,
  });

  const markAsWatchedProps = $derived<MarkAsWatchedActionProps>({
    ...commonProps,
    style: "normal",
    allowRewatch: $watchCount > 0,
  });
</script>

<CoverImageSetter src={media.cover.url.medium} colors={media.colors} {type} />

<div class="trakt-media-summary">
  <div class="trakt-media-summary-main">
    <SummaryPoster
      src={media.poster.url.medium}
      alt={title}
      href={streamOn?.preferred?.link ?? media.trailer}
    />
    <SideActions {title} {type} id={media.id} trailer={media.trailer} />
  </div>

  <div class="trakt-summary-main-cta">
    <MarkAsWatchedAction {...markAsWatchedProps} i18n={TraktIntlProvider} />
  </div>

  <div class="trakt-summary-meta-info">
    <WatchCountTag i18n={TagIntlProvider} count={$watchCount} />
    <RatingList ratings={$ratings} airDate={media.airDate} />
    <SummaryTitle {title} genres={media.genres} year={media.year} />
    <MediaActions {title} {media} {type} {streamOn} />
  </div>

  <Spoiler {media} {type}>
    <SummaryOverview {title} overview={intl.overview ?? media.overview} />
  </Spoiler>

  <MediaDetails {media} {studios} {crew} {type} />
</div>

<style>
  .trakt-media-summary {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);

    padding-left: var(--layout-distance-side);
    padding-right: var(--layout-distance-side);
  }

  .trakt-summary-main-cta,
  .trakt-summary-meta-info {
    display: flex;
    justify-content: center;
    align-items: center;

    gap: var(--gap-s);
  }

  .trakt-summary-meta-info {
    flex-direction: column;

    /* TODO prop in ratinglist */
    :global(.vote-count) {
      display: none;
    }
  }

  .trakt-summary-main-cta {
    margin-top: var(--ni-neg-40);

    :global(.trakt-button) {
      width: fit-content;
    }
  }

  .trakt-media-summary-main {
    --side-action-bar-width: var(--ni-40);

    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: var(--gap-s);

    :global(.trakt-summary-poster-container) {
      grid-column-start: 2;
    }

    :global(.trakt-summary-poster-container),
    :global(.trakt-summary-poster img) {
      width: calc(
        100dvw - 2 * var(--side-action-bar-width) - 2 *
          var(--layout-distance-side) - 2 * var(--gap-s)
      );
      height: auto;
    }
  }
</style>
