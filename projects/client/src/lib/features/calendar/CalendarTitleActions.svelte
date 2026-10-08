<script lang="ts">
  import CalendarFeedMenu from "./CalendarFeedMenu.svelte";
  import EpisodeTypeToggles from "./EpisodeTypeToggles.svelte";
</script>

<div class="trakt-calendar-title-actions">
  <EpisodeTypeToggles />
  <CalendarFeedMenu />
</div>

<style>
  .trakt-calendar-title-actions {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
  }
</style>
