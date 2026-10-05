<script lang="ts">
  import { useMotionDuration } from "$lib/stores/css/useMotionDuration.ts";
  import { cubicOut } from "svelte/easing";
  import { slide } from "svelte/transition";
  import type { ComposerGifProps } from "./ComposerGifProps.ts";
  import { gifPop } from "./gifPop.ts";
  import SelectedGif from "./SelectedGif.svelte";

  const { gif, onRemove, disabled }: ComposerGifProps = $props();

  const duration = useMotionDuration();

  const ratio = $derived(
    gif?.width && gif?.height ? gif.width / gif.height : 1,
  );
</script>

{#if gif}
  <div
    class="trakt-composer-gif"
    style:--composer-gif-ratio={ratio}
    transition:slide={{ axis: "x", duration: $duration(250), easing: cubicOut }}
  >
    {#key gif.url}
      <div
        class="composer-gif-pop"
        in:gifPop={{ delay: 80, duration: $duration(450) }}
      >
        <SelectedGif {gif} {disabled} {onRemove} />
      </div>
    {/key}
  </div>
{/if}

<style>
  .trakt-composer-gif {
    position: relative;
    width: min(
      var(--ni-160),
      40cqi,
      calc(
        var(--rich-textarea-min-height, var(--ni-144)) *
          var(--composer-gif-ratio)
      )
    );
    padding-inline-start: var(--gap-xs);

    --selected-gif-height: 100%;
    --selected-gif-max-width: 100%;
    --selected-gif-max-height: none;
  }

  .composer-gif-pop {
    position: absolute;
    inset-block: 0;
    inset-inline: var(--gap-xs) 0;
  }
</style>
