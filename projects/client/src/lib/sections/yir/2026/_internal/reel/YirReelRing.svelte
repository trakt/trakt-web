<script lang="ts">
  const {
    days,
    reach,
  }: {
    days: number;
    reach: number;
  } = $props();

  const RING = 2 * Math.PI * 44;
  const STREAK_GOAL = 210;
</script>

<div class="yir-reel-ring">
  <svg viewBox="0 0 100 100" aria-hidden="true">
    <circle class="track" cx="50" cy="50" r="44" />
    <circle
      class="arc"
      cx="50"
      cy="50"
      r="44"
      stroke-dasharray={RING}
      stroke-dashoffset={RING * (1 - reach * Math.min(1, days / STREAK_GOAL))}
    />
  </svg>
  <span class="yir-reel-ring-count">{Math.round(days * reach)}</span>
</div>

<style lang="scss">
  .yir-reel-ring {
    container-type: inline-size;
    position: relative;
    width: min(62vw, 40dvh, var(--ni-320));
    aspect-ratio: 1;
    display: grid;
    place-items: center;

    svg {
      position: absolute;
      inset: 0;
      transform: rotate(-90deg);
    }

    circle {
      fill: none;
      stroke-width: 6;
    }

    .track {
      stroke: var(--color-yir-separator);
    }

    .arc {
      stroke: var(--color-yir-accent);
      stroke-linecap: round;
    }

    .yir-reel-ring-count {
      font-family: var(--yir-font-display);
      font-size: 26cqi;
      line-height: 0.9;
      color: var(--color-yir-accent);
      font-variant-numeric: tabular-nums;
      max-width: 80%;
      text-align: center;
    }
  }
</style>
