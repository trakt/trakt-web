<script lang="ts">
  const { itemCount }: { itemCount: number } = $props();

  const MAX_PREVIEW_ITEMS = 2;

  const indicators = $derived(Array(Math.min(itemCount, MAX_PREVIEW_ITEMS)));
  const diff = $derived(itemCount - MAX_PREVIEW_ITEMS);
  const hasMoreThanMax = $derived(itemCount > MAX_PREVIEW_ITEMS);
</script>

<div class="content-indicator">
  {#each indicators as _, i (i)}
    <span class="circle"></span>
  {/each}

  {#if hasMoreThanMax}
    <span class="secondary">+{diff}</span>
  {/if}
</div>

<style>
  .content-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--gap-micro);

    height: var(--ni-12);

    .circle {
      width: var(--ni-8);
      height: var(--ni-8);

      background-color: var(--color-calendar-item-indicator);
      border-radius: 50%;
    }
  }
</style>
