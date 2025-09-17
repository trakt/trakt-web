<script lang="ts">
  import CoverImageSetter from "$lib/components/background/CoverImageSetter.svelte";
  import RatingList from "$lib/components/summary/RatingList.svelte";
  import SummaryPoster from "$lib/components/summary/SummaryPoster.svelte";
  import Spoiler from "$lib/features/spoilers/components/Spoiler.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { MediaCrew } from "$lib/requests/models/MediaCrew";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import type { MediaStudio } from "$lib/requests/models/MediaStudio";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import MediaDetails from "../../details/MediaDetails.svelte";
  import SummaryOverview from "../../summary/SummaryOverview.svelte";
  import type { MediaSummaryProps } from "../MediaSummaryProps";
  import { useMediaMetaInfo } from "../useMediaMetaInfo";
  import MediaActions from "./_internal/MediaActions.svelte";
  import SideActions from "./_internal/SideActions.svelte";
  import SummaryTitle from "./_internal/SummaryTitle.svelte";

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

  const { ratings } = $derived(useMediaMetaInfo({ media, type }));
  const title = $derived(intl?.title ?? media?.title ?? "");
  const mainMediaColor = $derived(media.colors?.at(0) ?? "rgba(0, 0, 0, 0.56)");
</script>

<CoverImageSetter src={media.cover.url.medium} colors={media.colors} {type} />

<div class="trakt-media-summary">
  <div
    class="trakt-media-summary-main"
    style={`--main-media-color: ${mainMediaColor}`}
  >
    <SummaryPoster
      src={media.poster.url.medium}
      alt={title}
      href={streamOn?.preferred?.link ?? media.trailer}
    />
    <SideActions {title} {type} trailer={media.trailer} />
  </div>

  <div class="trakt-media-summary-meta-info">
    <RatingList ratings={$ratings} airDate={media.airDate} />
    <SummaryTitle {title} genres={media.genres} year={media.year} />

    <RenderFor audience="authenticated">
      <MediaActions {media} />
    </RenderFor>
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

  .trakt-media-summary-main {
    --side-action-bar-width: var(--ni-40);
    --summary-gap: var(--gap-s);
    --poster-side-distance: calc(
      var(--layout-distance-side) + var(--side-action-bar-width) +
        var(--summary-gap)
    );
    --poster-width: calc(100dvw - 2 * var(--poster-side-distance));

    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: var(--summary-gap);

    :global(.trakt-summary-poster-container) {
      grid-column-start: 2;
    }

    :global(.trakt-summary-poster-container),
    :global(.trakt-summary-poster img) {
      width: var(--poster-width);
      height: calc(var(--poster-width) * 1.5);
    }

    :global(.trakt-summary-poster img) {
      box-shadow:
        var(--ni-0) var(--ni-11) var(--ni-24) var(--ni-0)
          color-mix(in srgb, var(--main-media-color) 16%, transparent),
        var(--ni-0) var(--ni-44) var(--ni-44) var(--ni-0)
          color-mix(in srgb, var(--main-media-color) 14%, transparent),
        var(--ni-0) var(--ni-104) var(--ni-60) var(--ni-0)
          color-mix(in srgb, var(--main-media-color) 8%, transparent),
        var(--ni-0) var(--ni-180) var(--ni-72) var(--ni-0)
          color-mix(in srgb, var(--main-media-color) 2%, transparent),
        var(--ni-0) var(--ni-280) var(--ni-80) var(--ni-0) transparent;
    }
  }

  .trakt-media-summary-meta-info {
    display: flex;
    flex-direction: column;

    justify-content: center;
    align-items: center;

    gap: var(--gap-s);

    :global(.vote-count) {
      display: none;
    }
  }
</style>
