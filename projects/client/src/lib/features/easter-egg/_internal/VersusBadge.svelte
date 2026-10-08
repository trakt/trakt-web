<script lang="ts">
  import * as m from "$lib/features/i18n/messages";
  import type { VersusState } from "./VersusState.ts";

  const { state, isSpinning }: { state: VersusState; isSpinning: boolean } =
    $props();

  const label = $derived.by(() => {
    switch (state) {
      case "hit":
        return "✓";
      case "miss":
        return "✕";
      default:
        return m.text_game_versus();
    }
  });
</script>

<span
  class="trakt-versus-badge"
  data-state={state}
  class:is-spinning={isSpinning}
  aria-hidden="true"
>
  <span class="versus-wave"></span>
  <svg class="versus-ring" viewBox="0 0 100 100">
    <circle class="versus-track" cx="50" cy="50" r="46" pathLength="100" />
    <circle class="versus-progress" cx="50" cy="50" r="46" pathLength="100" />
  </svg>
  <span class="versus-label">{label}</span>
</span>

<style lang="scss">
  @keyframes versus-pop {
    0%,
    100% {
      transform: scale(1);
    }
    40% {
      transform: scale(1.4);
    }
  }

  @keyframes versus-spin {
    0%,
    100% {
      transform: scale(1) rotate(0);
    }
    45% {
      transform: scale(0) rotate(-140deg);
    }
  }

  @keyframes versus-wave {
    from {
      transform: scale(1);
      opacity: 0.9;
    }
    to {
      transform: scale(6);
      opacity: 0;
    }
  }

  .trakt-versus-badge {
    --versus-size: clamp(var(--ni-56), 6vw, var(--ni-96));

    position: relative;
    display: grid;
    place-items: center;

    width: var(--versus-size);
    height: var(--versus-size);
    border-radius: 50%;

    background: color-mix(in oklch, var(--game-void) 72%, transparent);
    backdrop-filter: blur(var(--ni-10));
    box-shadow:
      0 0 0 var(--ni-1) var(--game-glass-line),
      0 var(--ni-10) var(--ni-32) color-mix(in oklch, var(--game-void) 50%, transparent);
    color: var(--game-foreground);

    transition:
      background var(--transition-duration-short) ease-out,
      color var(--transition-duration-short) ease-out,
      box-shadow var(--transition-duration-short) ease-out;

    .versus-ring {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      transform: rotate(-90deg);

      circle {
        fill: none;
        stroke-width: 3.5;
      }
    }

    .versus-track {
      stroke: var(--game-glass-line);
    }

    .versus-progress {
      stroke: var(--game-foreground);
      stroke-linecap: round;
      stroke-dasharray: 100;
      stroke-dashoffset: 100;
      transition: stroke-dashoffset 1.1s var(--game-ease-out);
    }

    .versus-wave {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      border: var(--ni-2) solid var(--game-green);
      opacity: 0;
      pointer-events: none;
    }

    .versus-label {
      position: relative;
      font-family: var(--game-font-display);
      font-weight: 900;
      font-size: calc(var(--versus-size) * 0.3);
      letter-spacing: 0.04em;
    }

    &[data-state="idle"] .versus-progress {
      transition: none;
    }

    &:not([data-state="idle"]) .versus-progress {
      stroke-dashoffset: 0;
    }

    &[data-state="hit"],
    &[data-state="miss"] {
      animation: versus-pop 0.55s var(--game-ease-spring);
    }

    &[data-state="hit"] {
      background: var(--game-green);
      color: var(--game-void);
      box-shadow: 0 0 var(--ni-48) var(--game-green);

      .versus-wave {
        animation: versus-wave 0.9s var(--game-ease-out);
      }
    }

    &[data-state="miss"] {
      background: var(--game-red);
      box-shadow: 0 0 var(--ni-48) var(--game-red);
    }

    &.is-spinning {
      animation: versus-spin var(--game-advance-duration) var(--game-ease-in-out);
    }

    @media (prefers-reduced-motion: reduce) {
      &[data-state="hit"],
      &[data-state="miss"],
      &.is-spinning,
      &[data-state="hit"] .versus-wave {
        animation: none;
      }

      .versus-progress {
        transition: none;
      }
    }
  }
</style>
