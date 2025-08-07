<script lang="ts">
  import CaretLeftIcon from "$lib/components/icons/CaretLeftIcon.svelte";
  import CaretRightIcon from "$lib/components/icons/CaretRightIcon.svelte";
  import StemSwipeIndicator from "$lib/sections/media-actions/_internal/StemSwipeIndicator.svelte";

  const { direction }: { direction: "left" | "right" | "inactive" } = $props();
</script>

<StemSwipeIndicator isActive --color-gesture-active="var(--color-foreground)">
  {#if direction === "left"}
    <CaretRightIcon />
  {/if}
  {#if direction === "right"}
    <CaretLeftIcon />
  {/if}
</StemSwipeIndicator>
