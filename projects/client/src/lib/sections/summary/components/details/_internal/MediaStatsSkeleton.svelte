<script lang="ts">
  import { m } from "$lib/features/i18n/messages";
  import MediaStat from "./MediaStat.svelte";
</script>

<div class="trakt-media-stats">
  <MediaStat value={0} text={m.stat_text_plays()} isLoading />
  <MediaStat value={0} text={m.stat_text_watchers()} isLoading />
  <MediaStat value={0} text={m.stat_text_lists()} isLoading />
</div>

<style>
  .trakt-media-stats {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--gap-xs);
  }
</style>
