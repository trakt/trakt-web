<script lang="ts">
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia.ts";
  import { sigilMarkup } from "./sigilMarkup.ts";
  import { stormField } from "./stormField.ts";

  const isReducedMotion = useMedia(WellKnownMediaQuery.reducedMotion);
  let canvas = $state<HTMLCanvasElement>();
  let flashing = $state(false);

  const sigil = sigilMarkup({ seed: 2026 });

  $effect(() => {
    if (!canvas) return;

    const flash = {
      timer: undefined as ReturnType<typeof setTimeout> | undefined,
    };
    const stop = stormField({
      canvas,
      animate: !$isReducedMotion,
      onStrike: () => {
        flashing = true;
        clearTimeout(flash.timer);
        flash.timer = setTimeout(() => (flashing = false), 420);
      },
    });

    return () => {
      stop();
      clearTimeout(flash.timer);
    };
  });
</script>

<div
  class="topic-backdrop doom-backdrop"
  class:is-flashing={flashing}
  aria-hidden="true"
>
  <div class="doom-fog" data-layer="a"></div>
  <div class="doom-fog" data-layer="b"></div>
  <div class="doom-fog" data-layer="c"></div>
  <div class="doom-ambient-sigil">{@html sigil}</div>
  <canvas class="topic-layer" bind:this={canvas}></canvas>
  <div class="doom-flash"></div>
</div>
