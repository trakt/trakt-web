<script lang="ts" module>
  const TALLY_DURATION = 1300;

  const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
</script>

<script lang="ts">
  import TrackIcon from "$lib/components/icons/TrackIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import { onMount } from "svelte";

  const { count }: { count: number } = $props();

  const isReducedMotion = useMedia(WellKnownMediaQuery.reducedMotion);

  let displayed = $state(0);
  let isDone = $state(false);

  onMount(() => {
    if ($isReducedMotion || count <= 0) {
      displayed = count;
      isDone = true;
      return;
    }

    const start = performance.now();
    let frame = 0;

    const step = (now: number) => {
      const progress = Math.min((now - start) / TALLY_DURATION, 1);
      displayed = Math.round(count * easeOutCubic(progress));

      if (progress < 1) {
        frame = requestAnimationFrame(step);
        return;
      }

      isDone = true;
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  });
</script>

<div class="trakt-import-tally">
  <span class="tally-check" class:is-done={isDone} aria-hidden="true">
    <TrackIcon state="watched" />
  </span>
  <p class="secondary">
    {m.import_complete_synced({ count: displayed })}
  </p>
</div>

<style>
  .trakt-import-tally {
    display: flex;
    align-items: center;
    gap: var(--gap-s);
  }

  .tally-check {
    display: grid;
    place-items: center;
    flex-shrink: 0;

    width: var(--ni-32);
    height: var(--ni-32);
    border-radius: 50%;

    color: var(--shade-10);
    background-color: var(--purple-500);

    opacity: 0.35;
    transform: scale(0.8);

    :global(svg) {
      width: var(--ni-18);
      height: var(--ni-18);
    }

    &.is-done {
      opacity: 1;
      transform: scale(1);
      animation: tally-check-pop 420ms cubic-bezier(0.3, 1.5, 0.5, 1);
    }
  }

  @keyframes tally-check-pop {
    0% {
      transform: scale(0.8);
    }
    55% {
      transform: scale(1.25);
    }
    100% {
      transform: scale(1);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .tally-check.is-done {
      animation: none;
    }
  }
</style>
