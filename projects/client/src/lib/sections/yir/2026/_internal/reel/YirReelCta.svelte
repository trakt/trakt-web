<script lang="ts">
  import { yirBeats } from "../persona/yirBeats";
  import * as m from "$lib/features/i18n/messages";
  import { fly } from "svelte/transition";

  const {
    isVisible,
    isReducedMotion,
    onclose,
  }: {
    isVisible: boolean;
    isReducedMotion: boolean;
    onclose: () => void;
  } = $props();
</script>

{#if isVisible}
  <div
    class="yir-reel-cta-bar"
    transition:fly={{ y: 96, duration: isReducedMotion ? 0 : yirBeats(4.5) }}
  >
    <button class="yir-reel-cta" type="button" onclick={onclose}>
      <span class="yir-reel-cta-label">{m.yir_2026_reel_see_stats()}</span>
      <span class="yir-reel-cta-hint">{m.yir_2026_reel_see_stats_hint()}</span>
      <span class="yir-reel-cta-arrow" aria-hidden="true">↓</span>
    </button>
  </div>
{/if}

<style lang="scss">
  .yir-reel-cta-bar {
    position: absolute;
    inset-inline: 0;
    bottom: 0;
    z-index: var(--layer-raised);
    display: flex;
    justify-content: center;
    padding: var(--ni-48) var(--ni-16)
      calc(env(safe-area-inset-bottom, 0) + var(--ni-24));
    background: linear-gradient(
      to top,
      var(--color-yir-background) 45%,
      transparent
    );
    pointer-events: none;
  }

  .yir-reel-cta {
    pointer-events: auto;
    position: relative;
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    column-gap: var(--ni-16);
    width: min(100%, var(--ni-520));
    padding: var(--ni-16) var(--ni-24);
    border: 0;
    border-radius: var(--border-radius-xxl);
    background: var(--color-yir-accent);
    color: var(--color-yir-background);
    font: inherit;
    text-align: start;
    cursor: pointer;
    isolation: isolate;
    transition: transform var(--transition-increment) ease-out;

    &::before {
      content: "";
      position: absolute;
      inset: 0;
      z-index: -1;
      border-radius: inherit;
      box-shadow: 0 0 var(--ni-16) var(--ni-4) var(--color-yir-accent);
      opacity: 0;
      animation: cta-glow 2.4s ease-in-out infinite;
      pointer-events: none;
    }

    &:hover,
    &:focus-visible {
      transform: translateY(calc(-1 * var(--ni-2)));
    }

    &:focus-visible {
      outline: var(--ni-2) solid var(--color-yir-text-primary);
      outline-offset: var(--ni-4);
    }
  }

  .yir-reel-cta-label {
    font-family: var(--yir-font-display);
    font-size: var(--ni-24);
    line-height: 1.1;
  }

  .yir-reel-cta-hint {
    grid-row: 2;
    font-size: var(--font-size-tag);
    opacity: 0.8;
  }

  .yir-reel-cta-arrow {
    grid-row: 1 / span 2;
    grid-column: 2;
    display: grid;
    place-items: center;
    width: var(--ni-44);
    height: var(--ni-44);
    border-radius: 50%;
    background: var(--color-yir-background);
    color: var(--color-yir-accent);
    font-size: var(--ni-20);
    font-weight: 700;
    animation: cta-bounce 1.4s ease-in-out infinite;
  }

  @keyframes cta-glow {
    0%,
    100% {
      opacity: 0;
    }
    35% {
      opacity: 0.55;
    }
  }

  @keyframes cta-bounce {
    50% {
      transform: translateY(var(--ni-4));
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .yir-reel-cta::before,
    .yir-reel-cta-arrow {
      animation: none;
    }
  }
</style>
