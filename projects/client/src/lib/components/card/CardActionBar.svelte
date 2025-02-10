<script lang="ts">
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { Snippet } from "svelte";

  const { actions }: { actions: Snippet } = $props();
</script>

<RenderFor audience="authenticated">
  <div class="trakt-card-action-bar">
    {@render actions()}
  </div>
</RenderFor>

<style>
  .trakt-card-action-bar {
    position: absolute;

    top: 0;
    right: 0;
    left: 0;
    z-index: var(--layer-floating);

    :global(.trakt-popup-menu-button) {
      position: absolute;
      right: 0;
    }
  }
</style>
