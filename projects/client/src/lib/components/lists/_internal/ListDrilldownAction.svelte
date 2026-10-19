<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent";
  import { useTrack } from "$lib/features/analytics/useTrack";
  import type { DrilldownSource } from "$lib/sections/lists/components/models/DrilldownSource.ts";
  import type { ListDrilldownActionProps } from "./ListDrilldownActionProps.ts";

  const { drilldown, disabled, children }: ListDrilldownActionProps = $props();

  const { track } = useTrack(AnalyticsEvent.Drilldown);

  const trackDrilldown = (source: DrilldownSource) =>
    track({ source: source.id, type: source.type });
</script>

{#if drilldown.onClick}
  <button
    type="button"
    class="trakt-list-drilldown-action"
    aria-label={drilldown.label}
    {disabled}
    onclick={() => {
      trackDrilldown(drilldown.source);
      drilldown.onClick?.();
    }}
  >
    {@render children()}
  </button>
{:else}
  <Link
    href={drilldown.href}
    label={drilldown.label}
    noscroll={drilldown.noscroll}
    replacestate={drilldown.replacestate}
    {disabled}
    color="inherit"
    onclick={() => trackDrilldown(drilldown.source)}
  >
    {@render children()}
  </Link>
{/if}

<style>
  .trakt-list-drilldown-action {
    appearance: none;
    background: none;
    border: none;
    padding: 0;
    margin: 0;
    font: inherit;
    color: inherit;
    cursor: pointer;

    &:disabled {
      cursor: default;
    }
  }
</style>
