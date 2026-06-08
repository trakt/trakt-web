<script lang="ts">
  import Card from "$lib/components/card/Card.svelte";
  import Tooltip from "$lib/components/tooltip/Tooltip.svelte";
  import type { PulseDeltaKind } from "./models/PulseDeltaKind";
  import PulseDeltaTag from "./PulseDeltaTag.svelte";
  import { splitDuration } from "./utils/splitDuration.ts";

  type PulseCellProps = {
    value: string;
    label: string;
    tooltip: string;
    delta: number;
    deltaKind: PulseDeltaKind;
  };

  const {
    value: originalValue,
    label,
    tooltip,
    delta,
    deltaKind,
  }: PulseCellProps = $props();

  const value = $derived(
    deltaKind === "time" ? splitDuration(originalValue) : [originalValue],
  );
</script>

{#snippet valueText()}
  {#each value as part, index (index)}
    <span class="trakt-pulse-cell-value bold ellipsis">{part}</span>
  {/each}
{/snippet}

<Card
  --width-card="var(--width-pulse-card)"
  --height-card="var(--height-pulse-card)"
>
  <div class="trakt-pulse-cell">
    <p>{label}</p>

    <div class="trakt-pulse-cell-body">
      {#if tooltip}
        <Tooltip content={tooltip} side="right">
          {@render valueText()}
        </Tooltip>
      {:else}
        {@render valueText()}
      {/if}
    </div>

    <PulseDeltaTag {delta} {deltaKind} />
  </div>
</Card>

<style lang="scss">
  .trakt-pulse-cell {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--gap-xs);
    justify-content: space-between;

    padding: var(--ni-16);
    box-sizing: border-box;

    overflow: hidden;
    height: 100%;

    :global(.trakt-tooltip-trigger),
    .trakt-pulse-cell-body {
      display: flex;
      flex-wrap: wrap;
      gap: var(--gap-xxs);
      flex: 1;
      justify-content: flex-start;
      align-items: center;
    }
  }

  .trakt-pulse-cell-value {
    font-size: var(--ni-24);
  }
</style>
