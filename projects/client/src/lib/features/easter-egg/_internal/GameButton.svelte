<script lang="ts">
  import { onMount } from "svelte";
  import type { GameButtonProps } from "./GameButtonProps.ts";

  const {
    children,
    onclick,
    variant = "glass",
    shape = "pill",
    label,
    isAutofocused = false,
  }: GameButtonProps = $props();

  let button = $state<HTMLButtonElement>();

  onMount(() => {
    if (isAutofocused) button?.focus({ preventScroll: true });
  });
</script>

<button
  bind:this={button}
  class="trakt-game-button"
  type="button"
  data-variant={variant}
  data-shape={shape}
  aria-label={label}
  {onclick}
>
  {@render children()}
</button>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-game-button {
    all: unset;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;

    display: inline-grid;
    place-items: center;
    box-sizing: border-box;

    color: var(--game-foreground);
    font-family: inherit;
    font-size: var(--font-size-text);
    font-weight: 700;
    text-shadow: none;

    transition:
      transform 0.35s var(--game-ease-spring),
      background var(--transition-increment) ease-out;

    &:focus-visible {
      outline: var(--border-thickness-xs) solid var(--game-foreground);
      outline-offset: var(--ni-2);
    }

    &:active {
      transform: scale(0.95);
    }

    &[data-variant="primary"] {
      background: var(--game-purple);
      box-shadow: 0 var(--ni-12) var(--ni-40) calc(var(--ni-12) * -1)
        var(--game-purple);
    }

    &[data-variant="glass"] {
      background: var(--game-glass);
      border: var(--ni-1) solid var(--game-glass-line);
      @include backdrop-filter-blur(var(--ni-12));
    }

    &[data-shape="pill"] {
      padding-block: var(--ni-14);
      padding-inline: var(--ni-32);
      border-radius: var(--border-radius-xxl);
    }

    &[data-shape="round"] {
      width: var(--game-close-size);
      height: var(--game-close-size);
      border-radius: 50%;

      :global(svg) {
        width: var(--ni-18);
        height: var(--ni-18);
      }
    }

    @include for-mouse {
      &[data-shape="pill"]:hover {
        transform: translateY(calc(var(--ni-2) * -1));
      }

      &[data-shape="round"]:hover {
        transform: rotate(90deg);
        background: color-mix(in oklch, var(--game-foreground) 16%, transparent);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      transition: none;
    }
  }
</style>
