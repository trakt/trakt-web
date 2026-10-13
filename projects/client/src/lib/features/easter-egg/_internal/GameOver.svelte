<script lang="ts">
  import * as m from "$lib/features/i18n/messages";
  import GameButton from "./GameButton.svelte";
  import type { GameOverProps } from "./GameOverProps.ts";
  import { toGameRating } from "./toGameRating.ts";

  const { title, streak, best, isNewBest, onplayagain, onclose }: GameOverProps =
    $props();
</script>

<div class="trakt-game-over" role="status">
  <span class="game-over-spoiler" style:--game-over-index={0}>
    {m.text_game_spoiler({
      title: title.title,
      rating: toGameRating(title),
    })}
  </span>
  <span class="game-over-streak" style:--game-over-index={1}>
    {m.label_game_streak()} <em>{streak}</em>
  </span>
  <span
    class="game-over-best"
    class:is-new-best={isNewBest}
    style:--game-over-index={2}
  >
    {isNewBest ? m.text_game_new_best() : m.text_game_best({ count: best })}
  </span>
  <div class="game-over-actions" style:--game-over-index={3}>
    <GameButton variant="primary" onclick={onplayagain} isAutofocused>
      {m.button_text_game_play_again()}
    </GameButton>
    {#if onclose}
      <GameButton onclick={onclose}>
        {m.button_text_game_close()}
      </GameButton>
    {/if}
  </div>
</div>

<style lang="scss">
  @keyframes game-over-fade {
    from {
      opacity: 0;
    }
  }

  @keyframes game-over-rise {
    from {
      opacity: 0;
      transform: translateY(40%) scale(0.96);
      filter: blur(var(--ni-8));
    }
  }

  .trakt-game-over {
    position: absolute;
    inset: 0;
    z-index: var(--layer-floating);

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--ni-16);
    padding: var(--ni-24);
    text-align: center;

    background: radial-gradient(
      circle at 50% 50%,
      color-mix(in oklch, var(--red-900) 60%, transparent),
      color-mix(in oklch, var(--game-void) 94%, transparent) 75%
    );
    backdrop-filter: blur(var(--ni-14)) saturate(0.5);
    animation: game-over-fade 0.5s var(--game-ease-out);

    > * {
      animation: game-over-rise 0.9s var(--game-ease-out) backwards;
      animation-delay: calc(0.2s + var(--game-over-index) * 0.09s);
    }

    .game-over-spoiler {
      font-family: var(--game-font-mono);
      font-size: var(--font-size-text-small);
      color: var(--game-muted);
    }

    .game-over-streak {
      font-family: var(--game-font-display);
      font-weight: 900;
      font-size: clamp(var(--ni-64), 10vw, var(--ni-160));
      line-height: 0.85;
      text-transform: uppercase;

      em {
        font-style: normal;
        color: var(--game-red);
        text-shadow: 0 0 0.3em
          color-mix(in oklch, var(--game-red) 60%, transparent);
      }
    }

    .game-over-best {
      font-family: var(--game-font-mono);
      font-size: var(--font-size-text-small);
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--game-muted);

      &.is-new-best {
        color: var(--game-yellow);
      }
    }

    .game-over-actions {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: var(--ni-12);
      margin-block-start: var(--ni-8);
    }

    @media (prefers-reduced-motion: reduce) {
      &,
      > * {
        animation: none;
      }
    }
  }
</style>
