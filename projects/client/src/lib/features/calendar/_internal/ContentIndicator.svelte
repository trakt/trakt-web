<script lang="ts">
  import Skeleton from "$lib/components/skeleton/Skeleton.svelte";

  const { itemCount, isLoading = false }: {
    itemCount: number;
    isLoading?: boolean;
  } = $props();

  const maxPreviewItems = 2;

  const indicators = $derived(Array(Math.min(itemCount, maxPreviewItems)));
  const diff = $derived(itemCount - maxPreviewItems);
  const hasMoreThanMax = $derived(itemCount > maxPreviewItems);
</script>

<div class="trakt-content-indicator">
  {#if isLoading}
    <Skeleton
      width="var(--ni-20)"
      height="var(--ni-8)"
      radius="var(--border-radius-xxl)"
    />
  {/if}

  {#each indicators as _, i (i)}
    <span class="circle"></span>
  {/each}

  {#if hasMoreThanMax}
    <span class="secondary">+{diff}</span>
  {/if}
</div>

<style>
  .trakt-content-indicator {
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
