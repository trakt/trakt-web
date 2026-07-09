<script lang="ts">
  import ListIcon from "$lib/components/icons/mobile/ListIcon.svelte";
  import PlayIcon from "$lib/components/icons/PlayIcon.svelte";
  import WatchersIcon from "$lib/components/icons/WatchersIcon.svelte";
  import { m } from "$lib/features/i18n/messages";
  import MediaStat from "./MediaStat.svelte";
</script>

<div class="trakt-media-stats">
  <MediaStat value={0} text={m.stat_text_plays()} isLoading>
    {#snippet icon()}
      <PlayIcon size="small" />
    {/snippet}
  </MediaStat>

  <MediaStat value={0} text={m.stat_text_watchers()} isLoading>
    {#snippet icon()}
      <WatchersIcon size="small" />
    {/snippet}
  </MediaStat>

  <MediaStat value={0} text={m.stat_text_lists()} isLoading>
    {#snippet icon()}
      <ListIcon size="small" />
    {/snippet}
  </MediaStat>
</div>

<style>
  .trakt-media-stats {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--gap-xs);
  }
</style>
