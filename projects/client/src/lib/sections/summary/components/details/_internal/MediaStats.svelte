<script lang="ts">
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
  />

  <MediaStat
    value={$stats.watchers}
    text={m.stat_text_watchers()}
    isLoading={$isLoading}
  />

  <MediaStat
    value={$stats.lists}
    text={m.stat_text_lists()}
    isLoading={$isLoading}
  />

  {#if "favorited" in $stats}
    <MediaStat
      value={$stats.favorited}
      text={m.stat_text_favorited()}
      isLoading={$isLoading}
    />
  {/if}
</div>

<style>
  .trakt-media-stats {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--gap-m);
  }
</style>
