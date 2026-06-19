<script lang="ts">
  import BookmarkIcon from "$lib/components/icons/BookmarkIcon.svelte";
  import FastRewindIcon from "$lib/components/icons/FastRewindIcon.svelte";
  import TrackIcon from "$lib/components/icons/TrackIcon.svelte";
  import IndicatorTag from "$lib/components/media/tags/IndicatorTag.svelte";
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag";
  import { useFeatureFlag } from "$lib/features/feature-flag/useFeatureFlag";

  type StatusIndicatorsProps = {
    isRewatching?: boolean;
    isWatched: boolean;
    isPartiallyWatched?: boolean;
    isWatchlisted: boolean;
  };

  const {
    isRewatching = false,
    isWatched,
    isPartiallyWatched,
    isWatchlisted,
  }: StatusIndicatorsProps = $props();

  const { isEnabled } = useFeatureFlag();
  const isRewatchingFeatureEnabled = $derived(
    isEnabled(FeatureFlag.Rewatching),
  );
  const showRewatching = $derived(isRewatching && $isRewatchingFeatureEnabled);
</script>

{#if showRewatching}
  <IndicatorTag>
    <FastRewindIcon />
  </IndicatorTag>
{:else if isWatched || isPartiallyWatched}
  <IndicatorTag variant={isPartiallyWatched ? "partial" : "full"}>
    <TrackIcon />
  </IndicatorTag>
{:else if isWatchlisted}
  <IndicatorTag>
    <BookmarkIcon state="added" />
  </IndicatorTag>
{/if}
