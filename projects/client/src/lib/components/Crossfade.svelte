<script lang="ts">
  import { type Snippet } from "svelte";
  import { cubicInOut } from "svelte/easing";
  import { fade } from "svelte/transition";

  const FADE_DURATION_MS = 500;

  const {
    childrenA,
    childrenB,
    showA,
  }: {
    childrenA: Snippet;
    childrenB: Snippet;
    showA: boolean;
  } = $props();
</script>

<div class="crossfade-container">
  {#if showA}
    <div
      class="crossfade-content"
      transition:fade={{ duration: FADE_DURATION_MS, easing: cubicInOut }}
    >
      {@render childrenA()}
    </div>
  {:else}
    <div
      class="crossfade-content"
      transition:fade={{ duration: FADE_DURATION_MS, easing: cubicInOut }}
    >
      {@render childrenB()}
    </div>
  {/if}
</div>

<!--
  During the crossfade, both elements exist at the same time,
  we need to ensure they are still rendered on top of each other.
-->
<style>
  .crossfade-container {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .crossfade-content {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
</style>
