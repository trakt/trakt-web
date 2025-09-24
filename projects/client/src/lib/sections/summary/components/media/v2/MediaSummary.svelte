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
    <SideActions {title} {type} trailer={media.trailer} />
  {/snippet}

  {#snippet meta()}
    <RatingList ratings={$ratings} airDate={media.airDate} />
    <SummaryTitle {title} genres={media.genres} year={media.year} />

    <RenderFor audience="authenticated">
      <MediaActions {media} />
    </RenderFor>
  {/snippet}

  <SpoilerSection {media} title="description">
    <p class="secondary">{intl.overview ?? media.overview}</p>
  </SpoilerSection>

  <MediaDetails {media} {studios} {crew} {type} />
</Summary>
