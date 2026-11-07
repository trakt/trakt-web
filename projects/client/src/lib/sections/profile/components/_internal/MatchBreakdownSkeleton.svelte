<script lang="ts">
  import Skeleton from "$lib/components/skeleton/Skeleton.svelte";
  import * as m from "$lib/features/i18n/messages.ts";

  const placeholders = [
    { x: -108, y: 30, tilt: -8 },
    { x: 0, y: 10, tilt: 0 },
    { x: 108, y: 30, tilt: 8 },
  ];
</script>

<div
  class="trakt-match-breakdown-skeleton"
  role="status"
  aria-busy="true"
  aria-label={m.match_pill_loading_aria_label()}
>
  <div class="hero">
    <div class="ring">
      <svg viewBox="0 0 148 148" aria-hidden="true">
        <circle cx="74" cy="74" r="56" />
      </svg>
      <span class="face face-them">
        <Skeleton width="100%" height="100%" radius="50%" />
      </span>
      <span class="face face-you">
        <Skeleton width="100%" height="100%" radius="50%" />
      </span>
      <Skeleton width="var(--ni-44)" height="var(--ni-36)" />
    </div>
    <Skeleton
      width="60%"
      height="var(--ni-40)"
      radius="var(--border-radius-m)"
    />
    <Skeleton width="36%" height="var(--ni-12)" />
  </div>

  <div class="topics">
    <div class="topic-lead">
      <Skeleton
        width="56%"
        height="var(--ni-32)"
        radius="var(--border-radius-m)"
      />
    </div>
    <div class="topic-runners-up">
      <Skeleton
        width="72%"
        height="var(--ni-22)"
        radius="var(--border-radius-s)"
      />
    </div>
    <div class="topic-supporting">
      <Skeleton width="58%" height="var(--ni-16)" />
    </div>
  </div>

  <div class="titles">
    <Skeleton width="var(--ni-120)" height="var(--ni-12)" />
    <div class="stage">
      {#each placeholders as slot, index (index)}
        <span
          class="card"
          style:--x={slot.x}
          style:--y={slot.y}
          style:--tilt={slot.tilt}
        >
          <Skeleton width="100%" height="100%" radius="var(--border-radius-m)" />
        </span>
      {/each}
    </div>
  </div>
</div>

<style lang="scss">
  .trakt-match-breakdown-skeleton {
    display: flex;
    flex-direction: column;
    gap: var(--ni-28);
  }

  .hero {
    box-sizing: border-box;
    height: var(--ni-284);
    padding: var(--ni-28) var(--ni-16) 0;

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--ni-12);

    border-radius: var(--border-radius-xxl);
    overflow: hidden;

    background: var(--color-background);
    box-shadow: 0 var(--ni-8) var(--ni-24)
      color-mix(in srgb, var(--color-shadow) 40%, transparent);
  }

  .ring {
    position: relative;
    flex: none;
    width: var(--ni-148);
    height: var(--ni-148);

    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
    }

    circle {
      fill: none;
      stroke-width: 6;
      stroke: color-mix(in srgb, var(--color-foreground) 14%, transparent);
    }
  }

  .face {
    position: absolute;
    width: var(--ni-36);
    height: var(--ni-36);
  }

  .face-them,
  .face-you {
    inset-block-start: calc(50% - var(--ni-18));
  }

  .face-them {
    inset-inline-end: 0;
  }

  .face-you {
    inset-inline-start: 0;
  }

  .titles {
    display: flex;
    flex-direction: column;
    gap: var(--ni-14);
  }

  .stage {
    --widest-fan: 368;
    --fan-unit: min(var(--ni-1), 100cqi / var(--widest-fan));

    position: relative;
    container-type: inline-size;
    height: calc(var(--ni-1) * 226);
  }

  .card {
    --card-size: 120;

    position: absolute;
    inset-block-start: calc(var(--y) * var(--ni-1));
    inset-inline-start: calc(
      50% + (var(--x) - var(--card-size) / 2) * var(--fan-unit)
    );
    width: calc(var(--card-size) * var(--fan-unit));
    aspect-ratio: 2 / 3;
    transform: rotate(calc(var(--tilt) * 1deg));
  }

  .topics {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--ni-6);

    > div {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
    }
  }

  .topic-lead {
    height: var(--ni-38);
  }

  .topic-runners-up {
    height: var(--ni-28);
  }

  .topic-supporting {
    height: var(--ni-22);
  }
</style>
