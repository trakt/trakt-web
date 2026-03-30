<script lang="ts">
  import Card from "$lib/components/card/Card.svelte";
  import Tooltip from "$lib/components/tooltip/Tooltip.svelte";
  import PulseDeltaTag from "./PulseDeltaTag.svelte";
  import PulseIcon from "./PulseIcon.svelte";

  const {
    key,
    value,
    label,
    tooltip,
    delta = null,
    note,
  }: {
    key: string;
    value: string;
    label: string;
    tooltip?: string;
    delta?: number | null;
    note?: string;
  } = $props();
</script>

{#snippet iconEl()}
  <div class="trakt-pulse-cell-icon">
    <PulseIcon {key} />
  </div>
{/snippet}

<Card --width-card="var(--min-pulse-card-width)" --height-card="var(--height-pulse-card)">
  <div class="trakt-pulse-cell">
    {#if tooltip}
      <Tooltip content={tooltip} side="right">
        {@render iconEl()}
      </Tooltip>
    {:else}
      {@render iconEl()}
    {/if}

    <div class="trakt-pulse-cell-body">
      <p class="trakt-pulse-cell-value">{value}</p>
      <p class="trakt-pulse-cell-label">{label}</p>
    </div>

    <PulseDeltaTag {delta} {note} />
  </div>
</Card>

<style lang="scss">
  .trakt-pulse-cell {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--ni-10);
    padding: var(--ni-16);
    overflow: hidden;
  }

  .trakt-pulse-cell-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: var(--ni-28);
    height: var(--ni-28);
    border-radius: var(--border-radius-s);
    background: var(--color-official-list-background);

    :global(svg) {
      width: var(--ni-16);
      height: var(--ni-16);
      color: var(--color-text-emphasis);
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
</style>
