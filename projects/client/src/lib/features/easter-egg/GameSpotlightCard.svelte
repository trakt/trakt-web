<script lang="ts">
  import PlayIcon from "$lib/components/icons/PlayIcon.svelte";
  import * as m from "$lib/features/i18n/messages";
  import GamePosterCover from "./_internal/GamePosterCover.svelte";

  const { onclick }: { onclick: () => void } = $props();
</script>

<button class="trakt-game-spotlight-card" type="button" {onclick}>
  <span class="game-spotlight-poster">
    <GamePosterCover />
  </span>

  <span class="game-spotlight-details">
    <span class="game-spotlight-title bold ellipsis">
      {m.header_game_rated_higher()}
    </span>
    <span class="game-spotlight-subtitle small secondary ellipsis">
      {m.text_game_spotlight_subtitle()}
    </span>
  </span>

  <span class="game-spotlight-play small bold" aria-hidden="true">
    <PlayIcon size="small" />
    {m.button_text_game_play()}
  </span>
</button>

<style lang="scss">
  @keyframes game-spotlight-pulse {
    0%,
    100% {
      opacity: 0.25;
    }
    50% {
      opacity: 1;
    }
  }

  .trakt-game-spotlight-card {
    all: unset;
    -webkit-tap-highlight-color: transparent;
    cursor: pointer;

    position: relative;
    isolation: isolate;
    box-sizing: border-box;
    width: 100%;
    height: var(--height-summary-card-compact);
    overflow: hidden;

    display: flex;
    align-items: center;
    gap: var(--gap-m);
    padding: calc(
      (
          var(--height-summary-card-compact) -
            var(--height-summary-card-cover-compact)
        ) *
        0.5
    );
    padding-inline-end: var(--gap-m);

    border-radius: var(--border-radius-m);
    background:
      radial-gradient(
        120% 160% at 0% 50%,
        color-mix(in oklch, var(--color-background-purple) 28%, transparent),
        transparent 70%
      ),
      var(--color-card-background);
    color: var(--color-text-primary);

    &::before {
      content: "";
      position: absolute;
      inset: 0;
      z-index: -1;
      border-radius: inherit;
      pointer-events: none;
      box-shadow:
        inset 0 0 0 var(--ni-1) var(--color-background-purple),
        inset 0 0 var(--ni-24)
          color-mix(in oklch, var(--color-background-purple) 55%, transparent);
      animation: game-spotlight-pulse 2.4s ease-in-out infinite;
    }

    &:focus-visible {
      outline: var(--border-thickness-xs) solid var(--color-link-active);
      outline-offset: calc(var(--border-thickness-xs) * -1);
    }

    .game-spotlight-poster {
      flex-shrink: 0;
      height: var(--height-summary-card-cover-compact);
      aspect-ratio: 2 / 3;
      border-radius: var(--border-radius-s);
      overflow: hidden;
      box-shadow: 0 0 var(--ni-16)
        color-mix(in oklch, var(--color-background-purple) 60%, transparent);
    }

    .game-spotlight-details {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: var(--gap-xxs);
    }

    .game-spotlight-play {
      flex-shrink: 0;
      display: inline-flex;
      align-items: center;
      gap: var(--gap-xxs);
      padding-block: var(--ni-6);
      padding-inline: var(--ni-10) var(--ni-14);
      border-radius: var(--border-radius-xxl);
      background: var(--color-background-purple);
      color: var(--color-foreground-purple);

      :global(svg) {
        width: var(--ni-14);
        height: var(--ni-14);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      &::before {
        animation: none;
        opacity: 0.6;
      }
    }
  }
</style>
