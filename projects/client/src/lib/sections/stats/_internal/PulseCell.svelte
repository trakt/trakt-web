<script lang="ts">
  import Card from "$lib/components/card/Card.svelte";
  import Tooltip from "$lib/components/tooltip/Tooltip.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { Snippet } from "svelte";

  const {
    icon,
    value,
    label,
    tooltip,
    delta = null,
    note,
  }: {
    icon: Snippet;
    value: string;
    label: string;
    tooltip?: string;
    delta?: number | null;
    note?: string;
  } = $props();

  const direction = $derived(
    delta == null ? null : delta > 0 ? "up" : delta < 0 ? "down" : "flat",
  );
</script>

<Card --width-card="var(--ni-148)" --height-card="var(--ni-156)">
  <div class="trakt-pulse-cell">
    {#if tooltip}
      <Tooltip content={tooltip} variant="compact" side="right">
        <div class="trakt-pulse-cell-icon">
          {@render icon()}
        </div>
      </Tooltip>
    {:else}
      <div class="trakt-pulse-cell-icon">
        {@render icon()}
      </div>
    {/if}

    <div class="trakt-pulse-cell-body">
      <p class="trakt-pulse-cell-value">{value}</p>
      <p class="trakt-pulse-cell-label">{label}</p>
    </div>

    {#if note}
      <div class="trakt-pulse-cell-pill" data-direction="neutral">
        {note}
      </div>
    {:else if delta != null && direction}
      <div class="trakt-pulse-cell-pill" data-direction={direction}>
        {#if delta > 0}
          {m.text_stats_delta_up({ count: String(delta) })}
        {:else if delta < 0}
          {m.text_stats_delta_down({ count: String(Math.abs(delta)) })}
        {:else}
          {m.text_stats_delta_same()}
        {/if}
      </div>
    {/if}
  </div>
</Card>

<style lang="scss">
  .trakt-pulse-cell {
    /* flex: 1 0 var(--ni-148); */
    display: flex;
    flex-direction: column;
    gap: var(--ni-10);
    padding: var(--ni-16);

    /* background: var(--shade-930); */
    /* border: 1px solid var(--shade-910); */
    /* border-radius: var(--border-radius-m); */
    /* overflow: hidden; */
  }

  .trakt-pulse-cell :global(.trakt-tooltip-trigger) {
    align-self: flex-start;
  }

  .trakt-pulse-cell-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: var(--ni-28);
    height: var(--ni-28);
    border-radius: var(--border-radius-s);
    background: color-mix(in srgb, var(--purple-900) 50%, transparent);

    :global(svg) {
      width: var(--ni-16);
      height: var(--ni-16);
      color: var(--purple-400);
    }
  }

  .trakt-pulse-cell-body {
    display: flex;
    flex-direction: column;
    gap: var(--ni-4);
    flex: 1;
  }

  .trakt-pulse-cell-value {
    font-size: var(--ni-32);
    font-weight: 700;
    line-height: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .trakt-pulse-cell-label {
    font-size: var(--ni-13);
    color: var(--shade-400);
  }

  .trakt-pulse-cell-pill {
    display: inline-flex;
    align-self: flex-start;
    padding: var(--ni-4) var(--ni-8);
    border-radius: var(--border-radius-s);
    font-size: var(--ni-11);
    font-weight: 600;
    line-height: 1;
    white-space: nowrap;

    &[data-direction="up"] {
      color: var(--green-500);
      background: color-mix(in srgb, var(--green-900) 40%, transparent);
    }

    &[data-direction="down"] {
      color: var(--red-500);
      background: color-mix(in srgb, var(--red-900) 40%, transparent);
    }

    &[data-direction="flat"],
    &[data-direction="neutral"] {
      color: var(--shade-500);
      background: color-mix(in srgb, var(--shade-900) 50%, transparent);
    }
  }
</style>
