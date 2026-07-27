<script lang="ts">
  import PosterTags from "$lib/components/media/tags/PosterTags.svelte";
  import { TagIntlProvider } from "$lib/components/media/tags/TagIntlProvider";
  import { SummaryDrawers } from "$lib/sections/summary/SummaryDrawers.ts";
  import { summaryDrawerNavigation } from "$lib/sections/summary/summaryDrawerNavigation.ts";

  type SummaryPosterTagsProps = {
    postCreditsCount: number;
    watchCount: number;
    isDropped?: boolean;
    isStarted?: boolean;
    isRewatching?: boolean;
    isWatchlisted?: boolean;
    onWatchCountClick?: () => void;
  };

  const {
    postCreditsCount,
    watchCount,
    isDropped,
    isStarted,
    isRewatching,
    isWatchlisted,
    onWatchCountClick,
  }: SummaryPosterTagsProps = $props();

  const { buildDrawerLink } = summaryDrawerNavigation();
</script>

<PosterTags
  variant="full"
  --border-radius-tag="var(--border-radius-s)"
  {isRewatching}
  isWatched={watchCount > 0}
  isPartiallyWatched={isStarted}
  {isDropped}
  {isWatchlisted}
  {watchCount}
  {postCreditsCount}
  {onWatchCountClick}
  i18n={TagIntlProvider}
  historyLink={buildDrawerLink(SummaryDrawers.History)}
  seasonsLink={buildDrawerLink(SummaryDrawers.Seasons)}
/>
