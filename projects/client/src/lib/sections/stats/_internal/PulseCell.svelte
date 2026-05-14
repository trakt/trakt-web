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

<Card
  --width-card="var(--width-pulse-card)"
  --height-card="var(--height-pulse-card)"
>
  <div class="trakt-pulse-cell">
    <p class="trakt-pulse-cell-label">{label}</p>

    <div class="trakt-pulse-cell-body">
      <p class="trakt-pulse-cell-value">{value}</p>
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
    height: 100%;
    box-sizing: border-box;

    background: #1d1f21; // Dark background matching the photo
  }

  .trakt-pulse-cell-body {
    display: flex;
    flex-direction: column;
    gap: var(--ni-4);
    flex: 1;
    justify-content: center;
  }

  .trakt-pulse-cell-value {
    font-size: var(--ni-48);
    font-weight: 700;
    line-height: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--color-white);
  }

  .trakt-pulse-cell-label {
    font-size: var(--ni-11);
    font-weight: 600;
    color: var(--shade-400);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
</style>

