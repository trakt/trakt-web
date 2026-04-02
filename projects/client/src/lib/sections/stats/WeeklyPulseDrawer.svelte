<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import PulseCell from "$lib/sections/stats/_internal/PulseCell.svelte";
  import PulseGraph from "$lib/sections/stats/_internal/PulseGraph.svelte";
  import { useWeeklyPulse } from "$lib/sections/stats/_internal/useWeeklyPulse";
  import { fade } from "svelte/transition";
  import { getDateRangeLabel } from "./_internal/getDateRangeLabel";

  const { onClose }: { onClose: () => void } = $props();

  const { items, dateRange } = useWeeklyPulse();

  let isOpen = $state(false);
</script>

<Drawer
  {onClose}
  onOpened={() => (isOpen = true)}
  title={m.header_stats_this_week()}
  size="large"
  metaInfo={getDateRangeLabel(dateRange)}
>
  {#if isOpen}
    <div
      class="weekly-pulse-drawer-content"
      transition:fade={{ duration: 150 }}
    >
      {#each $items as entry (entry.key)}
        <div class="pulse-drawer-item" data-type={entry.type}>
          {#if entry.type === "stat"}
            <PulseCell
              key={entry.key}
              value={entry.value}
              label={entry.label}
              tooltip={entry.tooltip}
              delta={entry.delta}
              note={entry.note}
            />
          {:else if entry.type === "graph"}
            <PulseGraph kind={entry.kind} data={entry.data} />
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</Drawer>

<style lang="scss">
  .weekly-pulse-drawer-content {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-auto-flow: dense;
    gap: var(--gap-s);

    --width-pulse-card: 100%;
    --width-card: 100%;
  }

  .pulse-drawer-item {
    min-width: 0;

    &[data-type="graph"] {
      grid-column: span 2;

      --width-pulse-card: 50%;
      --list-gap: 0px;
    }
  }
</style>
