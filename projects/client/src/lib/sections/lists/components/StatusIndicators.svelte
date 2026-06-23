<script lang="ts">
  import BookmarkIcon from "$lib/components/icons/BookmarkIcon.svelte";
  import TrackIcon from "$lib/components/icons/TrackIcon.svelte";
  import IndicatorTag from "$lib/components/media/tags/IndicatorTag.svelte";

  type StatusIndicatorsProps = {
    isWatched: boolean;
    isPartiallyWatched?: boolean;
    isWatchlisted: boolean;
  };

  const {
    isWatched,
    isPartiallyWatched,
    isWatchlisted,
  }: StatusIndicatorsProps = $props();
</script>

{#if isWatched || isPartiallyWatched}
  <IndicatorTag variant={isPartiallyWatched ? "partial" : "full"}>
    <TrackIcon />
  </IndicatorTag>
{:else if isWatchlisted}
  <IndicatorTag>
    <BookmarkIcon state="added" />
  </IndicatorTag>
{/if}
