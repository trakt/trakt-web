<script lang="ts">
  import { languageTag } from "$lib/features/i18n/index.ts";
  import * as m from "$lib/features/i18n/messages";
  import type { MediaStats } from "$lib/models/MediaStats";
  import { toHumanNumber } from "$lib/utils/formatting/number/toHumanNumber";

  const { stats }: { stats: MediaStats } = $props();

  const visibleStats = [
    { value: stats.watchers, label: m.watchers() },
    { value: stats.plays, label: m.plays() },
    { value: stats.lists, label: m.lists() },
    { value: stats.favorited, label: m.favorited() },
  ];
</script>

<div class="trakt-media-stats">
  {#each visibleStats as { value, label }}
    <div class="trakt-media-stat">
      <p class="large bold">{toHumanNumber(value, languageTag())}</p>
      <p class="small bold secondary">{label}</p>
    </div>
  {/each}
</div>

<style>
  .trakt-media-stats {
    display: flex;
    justify-content: space-between;
    padding: var(--ni-24) var(--ni-16) var(--ni-24) var(--ni-16);
    background-color: var(--color-card-background);
    border-radius: var(--border-radius-s);
    gap: var(--ni-16);
  }

  .trakt-media-stat {
    .large {
      line-height: var(--ni-18);
    }

    .secondary {
      text-transform: uppercase;
      line-height: var(--ni-16);
    }
  }
</style>
