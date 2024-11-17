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

    border-radius: 0.75rem;
    overflow: hidden;
    background: var(--color-card-background);
    box-shadow: 0px 4px 8px 0px
      color-mix(in srgb, var(--color-card-background) 25%, transparent 75%);
  }
</style>
