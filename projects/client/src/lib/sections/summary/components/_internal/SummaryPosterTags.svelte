<script lang="ts">
  import PosterTags from "$lib/components/media/tags/PosterTags.svelte";
  import { TagIntlProvider } from "$lib/components/media/tags/TagIntlProvider";
  import {
    SummaryDrawers,
    summaryDrawerNavigation,
  } from "../../_internal/summaryDrawerNavigation.ts";

  type SummaryPosterTagsProps = {
    postCreditsCount: number;
    watchCount: number;
    isDropped?: boolean;
    isStarted?: boolean;
    isRewatching?: boolean;
    onWatchCountClick?: () => void;
  };

  const {
    postCreditsCount,
    watchCount,
    isDropped,
    isStarted,
    isRewatching,
    onWatchCountClick,
  }: SummaryPosterTagsProps = $props();

  const { buildDrawerLink } = summaryDrawerNavigation();
</script>

<PosterTags
  variant="full"
  {isRewatching}
  isWatched={watchCount > 0}
  isPartiallyWatched={isStarted}
  {isDropped}
  {watchCount}
  {postCreditsCount}
  {onWatchCountClick}
  i18n={TagIntlProvider}
  historyLink={buildDrawerLink(SummaryDrawers.History)}
  seasonsLink={buildDrawerLink(SummaryDrawers.Seasons)}
/>
