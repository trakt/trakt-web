<script lang="ts">
  import Card from "$lib/components/card/Card.svelte";
  import Tooltip from "$lib/components/tooltip/Tooltip.svelte";
  import type { PulseDeltaKind } from "./models/PulseDeltaKind";
  import PulseDeltaTag from "./PulseDeltaTag.svelte";

  type PulseCellProps = {
    value: string;
    label: string;
    tooltip: string;
    delta: number;
    deltaKind: PulseDeltaKind;
  };

  const { value, label, tooltip, delta, deltaKind }: PulseCellProps = $props();
</script>

{#snippet valueText()}
  <p class="trakt-pulse-cell-value bold ellipsis">{value}</p>
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
  }

  .trakt-pulse-cell-body {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xxs);
    flex: 1;
    justify-content: center;
  }

  .trakt-pulse-cell-value {
    font-size: var(--ni-28);
  }
</style>
