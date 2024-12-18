<script lang="ts">
  import { whenInViewport } from "$lib/utils/actions/whenInViewport";
  import { writable } from "svelte/store";

  const { children }: ChildrenProps = $props();

  const isVisible = writable(false);
</script>

<div use:whenInViewport={() => isVisible.set(true)} class="trakt-card">
  <div class="trakt-card-content">
    {#if $isVisible}
      {@render children()}
    {/if}
  </div>
</div>

<style>
  .trakt-card {
    min-width: var(--width-card);
    min-height: var(--height-card);
  }

  .trakt-card-content {
    width: var(--width-card);
    height: var(--height-card);

    border-radius: var(--border-radius-m);
    overflow: hidden;
    background: var(--color-card-background);
    box-shadow: var(--ni-0) var(--ni-8) var(--ni-8) var(--ni-0)
      color-mix(in srgb, var(--color-shadow) 25%, transparent 75%);
  }
</style>
