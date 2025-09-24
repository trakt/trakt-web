<script lang="ts">
  import CoverImageSetter from "$lib/components/background/CoverImageSetter.svelte";
  import RatingList from "$lib/components/summary/RatingList.svelte";
  import SummaryPoster from "$lib/components/summary/SummaryPoster.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { MediaCrew } from "$lib/requests/models/MediaCrew";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import type { MediaStudio } from "$lib/requests/models/MediaStudio";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import Summary from "../../_internal/Summary.svelte";
  import MediaDetails from "../../details/MediaDetails.svelte";
  import RateNow from "../../rating/RateNow.svelte";
  import type { MediaSummaryProps } from "../MediaSummaryProps";
  import { useMediaMetaInfo } from "../useMediaMetaInfo";
  import MediaActions from "./_internal/MediaActions.svelte";
  import SideActions from "./_internal/SideActions.svelte";
  import SpoilerSection from "./_internal/SpoilerSection.svelte";
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
</script>

<CoverImageSetter src={media.cover.url.medium} colors={media.colors} {type} />

<Summary color={media.colors?.at(0)}>
  {#snippet poster()}
    <SummaryPoster
      src={media.poster.url.medium}
      alt={title}
      href={streamOn?.preferred?.link ?? media.trailer}
    />
  {/snippet}

  {#snippet sideActions()}
    <SideActions {title} {type} trailer={media.trailer} slug={media.slug} />
  {/snippet}

  {#snippet meta()}
    <RatingList ratings={$ratings} airDate={media.airDate} />
    <SummaryTitle {title} genres={media.genres} year={media.year} />

    <RenderFor audience="authenticated">
      <MediaActions {media} {streamOn} {title} />

      <div class="trakt-summary-rate-now">
        <RateNow {type} {media} isAlwaysVisible />
      </div>
    </RenderFor>
  {/snippet}

  <SpoilerSection {media} title="description">
    <p class="secondary">{intl.overview ?? media.overview}</p>
  </SpoilerSection>

  <MediaDetails {media} {studios} {crew} {type} />
</Summary>

<style>
  /* FIXME: When ratings are redesigned, remove this */
  .trakt-summary-rate-now {
    :global(h6) {
      display: none;
    }

    :global(svg) {
      --icon-color: var(--color-text-primary);
    }

    :global(.is-current-rating svg) {
      --icon-fill-color: var(--color-text-primary);
    }

    :global(.trakt-action-button[disabled]) {
      background-color: transparent;
      opacity: 0.3;
    }
  }
</style>
