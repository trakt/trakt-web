<script lang="ts">
  import { quadIn } from "svelte/easing";
  import { fade } from "svelte/transition";

  const { children }: ChildrenProps = $props();
</script>

<div class="trakt-card" transition:fade={{ duration: 150, easing: quadIn }}>
  <div class="trakt-card-content">
    {@render children()}
  </div>
</div>

<style>
  .trakt-card-content {
    width: var(--width-card);
    height: var(--height-card);

    border-radius: var(--ni-12);
    overflow: hidden;
    background: var(--color-card-background);
    box-shadow: var(--ni-0) var(--ni-4) var(--ni-8) var(--ni-0)
      color-mix(in srgb, var(--color-card-background) 25%, transparent 75%);
  }
</style>
