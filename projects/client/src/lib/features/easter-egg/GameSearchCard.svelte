<script lang="ts">
  import PortraitCard from "$lib/components/media/card/PortraitCard.svelte";
  import * as m from "$lib/features/i18n/messages";
  import GamePosterCover from "./_internal/GamePosterCover.svelte";
  import { openGame } from "./openGame.ts";
</script>

<div class="trakt-game-search-card" role="listitem">
  <PortraitCard>
    <button
      class="game-search-card-trigger"
      aria-label={m.button_label_play_game()}
      onclick={openGame}
    >
      <GamePosterCover />
    </button>
  </PortraitCard>
</div>

<style lang="scss">
  @keyframes game-search-card-pulse {
    0%,
    100% {
      opacity: 0.35;
      transform: scale(0.97);
    }
    50% {
      opacity: 1;
      transform: scale(1.03);
    }
  }

  .trakt-game-search-card {
    display: contents;

    .game-search-card-trigger {
      all: unset;
      display: block;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
      position: relative;
      isolation: isolate;
      border-radius: var(--border-radius-m);

      &::before {
        content: "";
        position: absolute;
        inset: 0;
        z-index: -1;
        border-radius: inherit;
        pointer-events: none;

        box-shadow:
          0 0 var(--ni-16) var(--ni-2) var(--color-background-purple),
          0 0 var(--ni-40) var(--ni-8)
            color-mix(in oklch, var(--color-background-purple) 45%, transparent);

        animation: game-search-card-pulse 2.4s ease-in-out infinite;
      }

      @media (prefers-reduced-motion: reduce) {
        &::before {
          animation: none;
          opacity: 0.6;
        }
      }

      &:focus-visible {
        outline: var(--border-thickness-xs) solid var(--color-link-active);
        outline-offset: var(--ni-2);
      }
    }
  }
</style>
