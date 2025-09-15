<script lang="ts">
  import SkeletonCard from "$lib/sections/lists/components/SkeletonCard.svelte";
  import { DEFAULT_PAGE_SIZE } from "$lib/utils/constants";

  const {
    id,
    variant = "portrait",
  }: { id: string; variant?: "portrait" | "landscape" } = $props();

  const randomListIndex = Math.floor(Math.random() * 6) + 1;
</script>

<div class="trakt-skeleton-list">
  {#each Array(DEFAULT_PAGE_SIZE) as _, index (`skeleton_${id}_${index}`)}
    <SkeletonCard {variant} {index} listIndex={randomListIndex} />
  {/each}
</div>

<style>
  .trakt-skeleton-list {
    overflow: hidden;
  }
</style>
