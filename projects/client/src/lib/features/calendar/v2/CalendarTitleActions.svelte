<script lang="ts">
  import CalendarFeedMenu from "../CalendarFeedMenu.svelte";
  import EpisodeTypeToggles from "../EpisodeTypeToggles.svelte";

  const { hasFeed = false }: { hasFeed?: boolean } = $props();
</script>

<div class="trakt-calendar-title-actions">
  <EpisodeTypeToggles />
  {#if hasFeed}
    <CalendarFeedMenu />
  {/if}
</div>

<style>
  .trakt-calendar-title-actions {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
  }
</style>
