<script lang="ts">
  import { yirBeats } from "../persona/yirBeats";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  const {
    value,
    active,
    format,
    duration = yirBeats(14),
  }: {
    value: number;
    active: boolean;
    format: (value: number) => string;
    duration?: number;
  } = $props();

  const isReducedMotion = useMedia(WellKnownMediaQuery.reducedMotion);

  let shown = $state(0);

  $effect(() => {
    if (!active) return;

    if ($isReducedMotion) {
      shown = value;
      return;
    }

    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      shown = value * (1 - Math.pow(1 - progress, 3));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  });
</script>

<span class="trakt-yir-count-up">{format(active ? shown : 0)}</span>

<style>
  .trakt-yir-count-up {
    font: inherit;
    color: inherit;
    font-variant-numeric: tabular-nums;
  }
</style>
