<script lang="ts">
  import Card from "$lib/components/card/Card.svelte";
  import KpiTile from "$lib/components/kpi/KpiTile.svelte";
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
    delta: deltaValue,
    deltaKind,
  }: PulseCellProps = $props();

  const value = $derived(
    deltaKind === "time" ? splitDuration(originalValue) : [originalValue],
  );
</script>

<Card
  --width-card="var(--width-pulse-card)"
  --height-card="var(--height-pulse-card)"
>
  <div class="trakt-pulse-cell">
    <KpiTile {label} {tooltip}>
      {#each value as part, index (index)}
        <span class="ellipsis">{part}</span>
      {/each}

      {#snippet delta()}
        <PulseDeltaTag delta={deltaValue} {deltaKind} />
      {/snippet}
    </KpiTile>
  </div>
</Card>

<style lang="scss">
  .trakt-pulse-cell {
    height: 100%;
    padding: var(--ni-16);
    box-sizing: border-box;
    overflow: hidden;
  }
</style>
