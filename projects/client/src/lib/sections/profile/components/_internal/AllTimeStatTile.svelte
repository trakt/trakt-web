<script lang="ts">
  import LockIcon from "$lib/components/icons/LockIcon.svelte";
  import KpiTile from "$lib/components/kpi/KpiTile.svelte";
  import { languageTag } from "$lib/features/i18n";
  import { toHumanCount } from "$lib/utils/formatting/number/toHumanCount.ts";
  import type { AllTimeStatTileProps } from "./AllTimeStatTileProps.ts";
  import StatIcon from "./StatIcon.svelte";

  const { stat, label, value, isLoading }: AllTimeStatTileProps = $props();
</script>

<div class="trakt-all-time-stat-tile" class:is-locked={value == null}>
  <KpiTile {label}>
    {#snippet icon()}
      <StatIcon key={stat} />
    {/snippet}

    {#if isLoading}
      <span class="stat-tile-skeleton" aria-hidden="true"></span>
    {:else if value == null}
      <LockIcon />
    {:else}
      <p>{toHumanCount(value, languageTag())}</p>
    {/if}
  </KpiTile>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-all-time-stat-tile {
    @include card-tile-surface;

    font-variant-numeric: tabular-nums;

    &.is-locked {
      color: var(--color-text-secondary);
    }

    :global(.kpi-value svg) {
      width: var(--ni-16);
      height: var(--ni-16);
    }
  }

  .stat-tile-skeleton {
    display: block;

    width: 3ch;
    height: var(--ni-24);

    border-radius: var(--border-radius-xs);
    background-color: color-mix(
      in srgb,
      var(--color-foreground) 20%,
      transparent
    );

    animation: pulse calc(var(--transition-increment) * 6) ease-in-out infinite
      alternate;
  }

  @media (prefers-reduced-motion: reduce) {
    .stat-tile-skeleton {
      animation: none;
    }
  }
</style>
