<script lang="ts">
  import { type Snippet } from "svelte";
  import { crossfade } from "svelte/transition";

  const CROSSFADE_KEY = Symbol("crossfade");

  const {
    childrenA,
    childrenB,
    showA,
  }: {
    childrenA: Snippet;
    childrenB: Snippet;
    showA: boolean;
  } = $props();

  const [send, receive] = crossfade({
    duration: 300,
    fallback: () => {
      return {
        duration: 0,
        css: () => "",
      };
    },
  });
</script>

<div class="crossfade-container">
  {#if showA}
    <div
      class="crossfade-content"
      in:receive={{ key: CROSSFADE_KEY }}
      out:send={{ key: CROSSFADE_KEY }}
    >
      {@render childrenA()}
    </div>
  {:else}
    <div
      class="crossfade-content"
      in:receive={{ key: CROSSFADE_KEY }}
      out:send={{ key: CROSSFADE_KEY }}
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
