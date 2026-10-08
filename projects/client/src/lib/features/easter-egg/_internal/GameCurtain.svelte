<script lang="ts">
  import { useMotionDuration } from "$lib/stores/css/useMotionDuration";
  import { time } from "$lib/utils/timing/time";
  import { tap } from "rxjs";
  import type { GameCurtainProps } from "./GameCurtainProps.ts";
  import { toTypingFrames } from "./toTypingFrames.ts";
  import { typeLines } from "./typeLines.ts";

  const { isOpen, lines, ontyped, children }: GameCurtainProps = $props();

  const CHARACTER_DELAY = time.seconds(0.05);
  const LINE_PAUSE = time.seconds(0.4);
  const END_PAUSE = time.seconds(0.5);

  const motionDuration = useMotionDuration();

  const typed = $derived.by(() => {
    const target = lines;
    const frames = toTypingFrames({
      lines: target,
      characterDelay: $motionDuration(CHARACTER_DELAY),
      linePause: LINE_PAUSE,
      endPause: END_PAUSE,
    });

    return typeLines(frames).pipe(
      tap({ complete: () => ontyped(target) }),
    );
  });
</script>

<div class="trakt-game-curtain" class:is-open={isOpen}>
  <div class="curtain-half" data-side="start"></div>
  <div class="curtain-half" data-side="end"></div>

  <div class="curtain-text">
    <div class="curtain-lines" aria-hidden="true">
      {#each $typed ?? [] as line, index (index)}
        <span class="curtain-line">{line}</span>
      {/each}
    </div>
    <p class="curtain-announcer" aria-live="polite">{lines.join(" ")}</p>
    <div class="curtain-status" aria-live="polite">
      {@render children?.()}
    </div>
  </div>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  @keyframes curtain-caret {
    50% {
      opacity: 0;
    }
  }

  .trakt-game-curtain {
    --curtain-glow: color-mix(in oklch, var(--red-800) 50%, transparent);

    position: absolute;
    inset: 0;
    z-index: var(--layer-menu);

    .curtain-half {
      position: absolute;
      inset-block: 0;
      width: 50%;
      background-color: var(--game-void);
      transition: transform 1.05s var(--game-ease-in-out);

      &[data-side="start"] {
        inset-inline-start: 0;
        background-image: radial-gradient(
          55% 65% at 100% 50%,
          var(--curtain-glow),
          transparent 75%
        );
      }

      &[data-side="end"] {
        inset-inline-end: 0;
        background-image: radial-gradient(
          55% 65% at 0% 50%,
          var(--curtain-glow),
          transparent 75%
        );
      }

      @include for-tablet-sm-and-below {
        inset-inline: 0;
        width: auto;
        height: 50%;

        &[data-side="start"] {
          inset-block: 0 auto;
          background-image: radial-gradient(
            70% 45% at 50% 100%,
            var(--curtain-glow),
            transparent 75%
          );
        }

        &[data-side="end"] {
          inset-block: auto 0;
          background-image: radial-gradient(
            70% 45% at 50% 0%,
            var(--curtain-glow),
            transparent 75%
          );
        }
      }
    }

    .curtain-text {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: var(--ni-16);
      padding-inline: var(--ni-32);

      font-family: var(--game-font-mono);
      font-size: clamp(var(--ni-18), 2.2vw, var(--ni-36));
      line-height: 1.5;
      text-align: center;
      color: var(--game-red);
      text-shadow: 0 0 0.6em
        color-mix(in oklch, var(--game-red) 50%, transparent);

      transition: opacity var(--transition-duration-short) ease-out;
    }

    .curtain-lines,
    .curtain-status {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--ni-16);
    }

    .curtain-announcer {
      @include visually-hidden;
    }

    .curtain-line {
      display: block;
      font-size: inherit;
      min-height: 1.5em;

      &:last-of-type::after {
        content: "";
        display: inline-block;
        width: 0.55em;
        height: 1em;
        margin-inline-start: 0.15em;
        vertical-align: -0.12em;
        background: currentColor;
        animation: curtain-caret 1s steps(1) infinite;
      }
    }

    &.is-open {
      pointer-events: none;

      .curtain-half[data-side="start"] {
        transform: translateX(calc(var(--rtl-sign) * -101%));
      }

      .curtain-half[data-side="end"] {
        transform: translateX(calc(var(--rtl-sign) * 101%));
      }

      .curtain-text {
        opacity: 0;
      }

      @include for-tablet-sm-and-below {
        .curtain-half[data-side="start"] {
          transform: translateY(-101%);
        }

        .curtain-half[data-side="end"] {
          transform: translateY(101%);
        }
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .curtain-half {
        transition: none;
      }

      .curtain-line::after {
        animation: none;
      }
    }
  }
</style>
