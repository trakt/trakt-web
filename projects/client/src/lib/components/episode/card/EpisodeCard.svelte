<script lang="ts">
  import { linear } from "svelte/easing";
  import { fade } from "svelte/transition";

  const { children }: ChildrenProps = $props();
</script>

<div class="trakt-episode">
  <div class="episode-card" transition:fade={{ duration: 250, easing: linear }}>
    {@render children()}
  </div>
</div>

<style>
  .episode-card {
    width: 12.5rem;
    height: 11rem;

    border-radius: 0.75rem;
    overflow: hidden;
    background: var(--color-card-background);
    box-shadow: 0px 4px 8px 0px
      color-mix(in srgb, var(--color-card-background) 25%, transparent 75%);
  }
</style>
