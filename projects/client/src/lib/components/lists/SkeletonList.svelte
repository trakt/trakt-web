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

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-skeleton-list {
    overflow: hidden;

    mask-image: linear-gradient(
      to right,
      black calc(100% - var(--layout-distance-side)),
      transparent calc(100% - var(--layout-distance-side))
    );

    @supports (-moz-appearance: none) {
      mask-image: none;
    }

    @include for-tablet-sm-and-below {
      mask-image: none;
    }
  }
</style>
