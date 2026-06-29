<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import { useDiscover } from "$lib/features/filters/useDiscover.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import PulseCell from "$lib/sections/stats/_internal/PulseCell.svelte";
  import PulseGraph from "$lib/sections/stats/_internal/PulseGraph.svelte";
  import { useWeeklyPulse } from "$lib/sections/stats/_internal/useWeeklyPulse";
  import { fade } from "svelte/transition";
  import { getDateRangeLabel } from "./_internal/utils/getDateRangeLabel";

  const { onClose }: { onClose: () => void } = $props();

  const { mode } = useDiscover();
  const { items, dateRange } = $derived(useWeeklyPulse({ mode: $mode }));

  const graphs = $derived($items.filter((e) => e.type === "graph"));
  const stats = $derived($items.filter((e) => e.type === "stat"));

  let isOpen = $state(false);
</script>

{#snippet metaInfo()}
  <p class="secondary ellipsis">{getDateRangeLabel(dateRange)}</p>
{/snippet}

<Drawer
  {onClose}
  onOpened={() => (isOpen = true)}
  title={m.header_screen_time()}
  size="large"
  {metaInfo}
>
  {#if isOpen}
    <div class="screen-time-drawer-content" transition:fade={{ duration: 150 }}>
      <div class="pulse-graphs">
        {#each graphs as entry (entry.key)}
          <PulseGraph item={entry} />
        {/each}
      </div>

      <div class="pulse-stats">
        {#each stats as entry (entry.key)}
          <PulseCell
            value={entry.value}
            label={entry.label}
            tooltip={entry.tooltip}
            delta={entry.delta}
            deltaKind={entry.deltaKind}
          />
        {/each}
      </div>
    </div>
  {/if}
</Drawer>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .screen-time-drawer-content {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);

    --width-pulse-card: 100%;
    --width-card: 100%;
  }

  .pulse-graphs {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);

    --list-gap: 0px;
    --width-override-card: 100%;
  }

  .pulse-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--gap-s);

    @include for-mobile {
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style>
