<script lang="ts">
  import FavoriteIcon from "$lib/components/icons/FavoriteIcon.svelte";
  import ListIcon from "$lib/components/icons/mobile/ListIcon.svelte";
  import PlayIcon from "$lib/components/icons/PlayIcon.svelte";
  import WatchersIcon from "$lib/components/icons/WatchersIcon.svelte";
  import { m } from "$lib/features/i18n/messages";
  import type { MediaDetailsProps } from "../MediaDetailsProps";
  import MediaStat from "./MediaStat.svelte";
  import { useStats } from "./useStats";

  const props: MediaDetailsProps = $props();

  const { stats, isLoading } = $derived(useStats(props));
</script>

<div class="trakt-media-stats">
  <MediaStat
    value={$stats.plays}
    text={m.stat_text_plays()}
    isLoading={$isLoading}
  >
    {#snippet icon()}
      <PlayIcon size="small" />
    {/snippet}
  </MediaStat>

  <MediaStat
    value={$stats.watchers}
    text={m.stat_text_watchers()}
    isLoading={$isLoading}
  >
    {#snippet icon()}
      <WatchersIcon size="small" />
    {/snippet}
  </MediaStat>

  <MediaStat
    value={$stats.lists}
    text={m.stat_text_lists()}
    isLoading={$isLoading}
  >
    {#snippet icon()}
      <ListIcon size="small" />
    {/snippet}
  </MediaStat>

  {#if "favorited" in $stats}
    <MediaStat
      value={$stats.favorited}
      text={m.stat_text_favorited()}
      isLoading={$isLoading}
    >
      {#snippet icon()}
        <FavoriteIcon size="small" />
      {/snippet}
    </MediaStat>
  {/if}
</div>

<style>
  .trakt-media-stats {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--gap-xs);
  }
</style>
