<script lang="ts">
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia.ts";
  import { dunesdayState } from "./dunesdayState.svelte.ts";
  import { seamField } from "./seamField.ts";
  import { seamTarget } from "./seamTarget.ts";

  const isReducedMotion = useMedia(WellKnownMediaQuery.reducedMotion);
  let art = $state<HTMLCanvasElement>();
  let fx = $state<HTMLCanvasElement>();
  let redraw = $state<() => void>(() => {});

  $effect(() => {
    if (!art || !fx) return;
    const field = seamField({
      art,
      fx,
      target: () => seamTarget(dunesdayState.side),
      animate: !$isReducedMotion,
    });
    redraw = field.redraw;
    return field.stop;
  });

  $effect(() => {
    void dunesdayState.side;
    redraw();
  });
</script>

<div class="topic-backdrop" aria-hidden="true">
  <canvas class="topic-layer dd-backdrop-art" bind:this={art}></canvas>
  <canvas class="topic-layer" bind:this={fx}></canvas>
  <div class="topic-layer dd-backdrop-veil"></div>
</div>
