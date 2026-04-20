<script lang="ts">
  import BookmarkIcon from "$lib/components/icons/BookmarkIcon.svelte";
  import IndicatorTag from "$lib/components/media/tags/IndicatorTag.svelte";
  import TrackIcon from "$lib/components/TrackIcon.svelte";

  type StatusIndicatorsProps = {
    isWatched: boolean;
    isWatchlisted: boolean;
  };

  const { isWatched, isWatchlisted }: StatusIndicatorsProps = $props();
</script>

{#if isWatched}
  <IndicatorTag>
    <TrackIcon />
  </IndicatorTag>
{:else if isWatchlisted}
  <IndicatorTag>
    <BookmarkIcon state="added" />
  </IndicatorTag>
{/if}
