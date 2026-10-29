<script lang="ts">
  import RatingList from "$lib/components/summary/RatingList.svelte";
  import SummaryPoster from "$lib/components/summary/SummaryPoster.svelte";
  import type { MediaCrew } from "$lib/requests/models/MediaCrew";
  import type { MediaIntl } from "$lib/requests/models/MediaIntl";
  import { useIsDropped } from "$lib/sections/media-actions/drop/useIsDropped";
  import { useIsRewatching } from "$lib/sections/media-actions/rewatching/useIsRewatching";
  import { useIsWatchlisted } from "$lib/stores/useIsWatchlisted";
  import { useWatchCount } from "$lib/stores/useWatchCount";
  import type { Snippet } from "svelte";
  import SpoilerSection from "../_internal/SpoilerSection.svelte";
  import Summary from "../_internal/Summary.svelte";
  import SummaryPosterTags from "../_internal/SummaryPosterTags.svelte";
  import SummaryTitle from "../_internal/SummaryTitle.svelte";
  import { useIsStarted } from "../_internal/useIsStarted";
  import type { MediaSummaryEntry } from "./models/MediaSummaryEntry";
  import { useMediaMetaInfo } from "./useMediaMetaInfo";

  const {
    intl,
    crew,
    actions,
    sideActions,
    color,
    ratingsDrilldown,
    ...target
  }: {
    intl: MediaIntl;
    crew: MediaCrew;
    actions?: Snippet;
    sideActions: Snippet;
    color?: string;
    ratingsDrilldown?: {
      href: string;
      noscroll: boolean;
      replacestate: boolean;
    };
  } & MediaSummaryEntry = $props();

  const media = $derived(target.media);
  const title = $derived(intl?.title ?? media?.title ?? "");

  const { ratings, isLoading } = $derived(useMediaMetaInfo(target));
  const { watchCount } = $derived(useWatchCount(target));
  const { isDropped } = $derived(useIsDropped(media));
  const { isStarted } = $derived(useIsStarted(target));
  const { isRewatching } = $derived(useIsRewatching(target));
  const { isWatchlisted } = $derived(useIsWatchlisted(target));
</script>

{#snippet tags()}
  <SummaryPosterTags
    postCreditsCount={media.postCredits?.length ?? 0}
    watchCount={$watchCount}
    isDropped={$isDropped}
    isStarted={$isStarted}
    isRewatching={$isRewatching}
    isWatchlisted={$isWatchlisted}
  />
{/snippet}

<Summary {color} {sideActions}>
  {#snippet poster()}
    <SummaryPoster
      src={media.poster.url.medium}
      alt={title}
      {tags}
      isPriority
    />
  {/snippet}


  {#snippet meta()}
    <SummaryTitle {title} {crew} {...target} />

    <RatingList
      ratings={$ratings}
      entry={media}
      drilldown={ratingsDrilldown}
      isLoading={$isLoading}
    />

    {@render actions?.()}
  {/snippet}

  <SpoilerSection {media} type={media.type}>
    <p class="secondary small">{intl?.overview ?? media.overview}</p>
  </SpoilerSection>
</Summary>
