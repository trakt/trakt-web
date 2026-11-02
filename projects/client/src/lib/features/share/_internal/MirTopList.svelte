<svelte:options css="injected" />

<script lang="ts">
  import { toHumanDuration } from "$lib/utils/formatting/date/toHumanDuration.ts";
  import type { MirShareItem } from "../models/MirShareItem.ts";

  const {
    title,
    items,
  }: { title: string; items: ReadonlyArray<MirShareItem> } = $props();

  const toRank = (index: number) => String(index + 1).padStart(2, "0");

  const toStats = (item: MirShareItem) =>
    [
      item.year,
      `${item.plays.toLocaleString()} ${item.plays === 1 ? "play" : "plays"}`,
      toHumanDuration({ minutes: item.minutes }),
    ]
      .filter(Boolean)
      .join(" · ");
</script>

<div class="trakt-mir-top-list">
  <span class="mir-top-list-title">{title}</span>
  {#each items as item, index (item.key)}
    <div class="mir-top-list-item">
      <span class="mir-top-list-rank">{toRank(index)}</span>
      <div class="mir-top-list-details">
        <b class="mir-top-list-name">{item.title}</b>
        <span class="mir-top-list-stats">{toStats(item)}</span>
      </div>
    </div>
  {/each}
</div>

<style>
  .trakt-mir-top-list {
    display: flex;
    flex-direction: column;
    gap: 14px;

    flex: 1;
    min-width: 0;

    color: #efefef;
  }

  .mir-top-list-title {
    font-size: 22px;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: rgba(239, 239, 239, 0.6);
  }

  .mir-top-list-item {
    display: flex;
    align-items: flex-start;
    gap: 16px;
  }

  .mir-top-list-rank {
    flex-shrink: 0;
    width: 36px;

    font-size: 26px;
    line-height: 40px;
    color: rgba(239, 239, 239, 0.5);
  }

  .mir-top-list-details {
    display: flex;
    flex-direction: column;
    gap: 2px;

    min-width: 0;
  }

  .mir-top-list-name {
    font-size: 30px;
    line-height: 40px;
    font-weight: bold;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .mir-top-list-stats {
    font-size: 22px;
    color: rgba(239, 239, 239, 0.6);
  }
</style>
