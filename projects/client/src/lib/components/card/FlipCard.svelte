<script lang="ts">
  import type { FlipCardProps } from "./FlipCardProps.ts";

  const { isFlipped, front, back }: FlipCardProps = $props();
</script>

<div class="trakt-flip-card" class:is-flipped={isFlipped}>
  <div class="flip-card-face">
    {@render front()}
  </div>
  <div class="flip-card-face is-back" inert={!isFlipped}>
    {@render back()}
  </div>
</div>

<style>
  .trakt-flip-card {
    --flip-card-angle: 0deg;
    --flip-card-surface: perspective(var(--flip-card-perspective))
      translateZ(calc(sin(var(--flip-card-angle)) * var(--flip-card-lift)));
    --flip-card-shade: calc(
      0.5 * sin(var(--flip-card-angle)) * sin(var(--flip-card-angle))
    );

    display: inline-grid;
    vertical-align: top;
    width: 100%;
    height: var(--height-flip-card, auto);

    transition: var(--transition-flip-card);

    &.is-flipped {
      --flip-card-angle: 180deg;
    }
  }

  .flip-card-face {
    grid-area: 1 / 1;
    position: relative;

    backface-visibility: hidden;
    transform: var(--flip-card-surface) rotateY(var(--flip-card-angle));

    &.is-back {
      transform: var(--flip-card-surface)
        rotateY(calc(var(--flip-card-angle) - 180deg));
    }

    &::after {
      content: "";

      position: absolute;
      inset: 0;
      z-index: var(--layer-floating);

      border-radius: var(--border-radius-flip-card, 0);
      background: var(--color-shadow);
      opacity: var(--flip-card-shade);

      pointer-events: none;
    }
  }
</style>
