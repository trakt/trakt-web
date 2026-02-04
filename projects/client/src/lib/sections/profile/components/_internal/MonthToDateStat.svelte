<script lang="ts">
  import LoadingIndicator from "$lib/components/icons/LoadingIndicator.svelte";

  const {
    children,
    value,
    label,
    isLoading,
  }: { value: number; label: string; isLoading: boolean } & ChildrenProps =
    $props();
</script>

<div class="trakt-month-to-date-stat">
  {#if isLoading}
    <LoadingIndicator />
  {:else}
    {@render children()}
  {/if}

  <div class="stat-values">
    <p class="bold">{value}</p>
    <p class="tag secondary">{label}</p>
  </div>
</div>

<style>
  .trakt-month-to-date-stat {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);

    :global(svg) {
      width: var(--ni-24);
      height: var(--ni-24);
    }
  }
</style>
