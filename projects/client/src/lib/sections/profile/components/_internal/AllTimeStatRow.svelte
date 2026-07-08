<script lang="ts">
  import LoadingIndicator from "$lib/components/icons/LoadingIndicator.svelte";
  import LockIcon from "$lib/components/icons/LockIcon.svelte";
  import type { AllTimeStatRowProps } from "./AllTimeStatRowProps.ts";

  const { icon, label, value, isLoading, locked = false }: AllTimeStatRowProps =
    $props();
</script>

<div class="trakt-all-time-stat-row" class:is-locked={locked}>
  <div class="stat-row-label">
    <span class="stat-row-icon">{@render icon()}</span>
    <span class="secondary">{label}</span>
  </div>

  <div class="stat-row-value">
    {#if isLoading}
      <LoadingIndicator />
    {:else if locked}
      <LockIcon />
    {:else}
      <span class="bold">{value}</span>
    {/if}
  </div>
</div>

<style lang="scss">
  .trakt-all-time-stat-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--gap-m);

    padding: var(--ni-12) var(--ni-4);
    border-bottom: var(--ni-1) solid
      color-mix(in srgb, var(--color-border) 50%, transparent);

    &.is-locked {
      .stat-row-label {
        color: var(--color-text-secondary);
      }
    }
  }

  .stat-row-label {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
    min-width: 0;
  }

  .stat-row-icon {
    display: flex;
    align-items: center;

    :global(svg) {
      width: var(--ni-18);
      height: var(--ni-18);
    }
  }

  .stat-row-value {
    display: flex;
    align-items: center;
    justify-content: flex-end;

    :global(svg) {
      width: var(--ni-16);
      height: var(--ni-16);
    }
  }
</style>
