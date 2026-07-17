<script lang="ts">
  import Skeleton from "$lib/components/skeleton/Skeleton.svelte";

  const skeletonCount = 4;
</script>

<div class="trakt-skeleton-list">
  {#each Array(skeletonCount) as _, index (`where-to-watch-skeleton-${index}`)}
    <Skeleton
      width="var(--width-where-to-watch-item)"
      height="var(--height-where-to-watch-item)"
      radius="var(--border-radius-m)"
    />
  {/each}
</div>

<style>
  .trakt-skeleton-list {
    overflow: hidden;
  }
</style>
