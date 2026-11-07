<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MatchStage } from "./buildMatchStage.ts";
  import SharedMediaPoster from "./SharedMediaPoster.svelte";

  const { stage }: { stage: MatchStage } = $props();

  const ghosts = [
    { x: -72, y: 16, tilt: -7 },
    { x: 0, y: 8, tilt: 0 },
    { x: 72, y: 16, tilt: 7 },
  ];
</script>

<section class="trakt-match-title-stage" data-size={stage.size}>
  <h3 class="small bold secondary">{m.match_drawer_watched_together()}</h3>

  <div class="stage">
    {#if stage.cards.length === 0}
      {#each ghosts as ghost, index (index)}
        <span
          class="slot ghost"
          style:--x={ghost.x}
          style:--y={ghost.y}
          style:--tilt={ghost.tilt}
        ></span>
      {/each}
      <p class="empty secondary">
        {m.match_drawer_nothing_watched_together()}
      </p>
    {:else}
      <span class="pool" aria-hidden="true"></span>
      {#if stage.cards.length === 1}
        <span class="reflection" aria-hidden="true"></span>
      {/if}
      {#each stage.cards as card, index (card.key)}
        <div
          class="slot card"
          style:--x={card.x}
          style:--y={card.y}
          style:--tilt={card.tilt}
          style:--layer={card.layer}
          style:--index={index}
        >
          <SharedMediaPoster
            id={card.id}
            type={card.type}
            isFavorite={card.isFavorite}
          />
        </div>
      {/each}
      {#if stage.more > 0}
        <span
          class="more"
          role="img"
          aria-label={m.match_drawer_more_watched_together_aria_label({
            count: stage.more,
          })}
        >
          {m.match_drawer_more_watched_together({ count: stage.more })}
        </span>
      {/if}
    {/if}
  </div>
</section>

<style lang="scss">
  .trakt-match-title-stage {
    --card-size: 120;

    display: flex;
    flex-direction: column;
    gap: var(--ni-12);

    &[data-size="small"] {
      --card-size: 100;
    }

    h3 {
      height: var(--ni-14);
      line-height: var(--ni-14);
    }
  }

  .stage {
    --widest-fan: 368;
    --fan-unit: min(var(--ni-1), 100cqi / var(--widest-fan));

    position: relative;
    container-type: inline-size;
    height: calc(var(--ni-1) * 226);
  }

  .slot {
    position: absolute;
    inset-block-start: calc(var(--y) * var(--ni-1));
    inset-inline-start: calc(
      50% + (var(--x) - var(--card-size) / 2) * var(--fan-unit)
    );
    width: calc(var(--card-size) * var(--fan-unit));
    aspect-ratio: 2 / 3;
    border-radius: var(--border-radius-m);
    transform: rotate(calc(var(--tilt) * 1deg));
  }

  .ghost {
    --card-size: 100;

    box-sizing: border-box;
    border: var(--ni-1) dashed
      color-mix(in srgb, var(--color-foreground) 20%, transparent);
  }

  .empty {
    position: absolute;
    inset-inline: 0;
    inset-block-start: calc(var(--ni-1) * 178);
    text-align: center;
  }

  .card {
    z-index: var(--layer);
    overflow: hidden;
    background: color-mix(in srgb, var(--color-foreground) 8%, transparent);
    box-shadow:
      0 var(--ni-18) var(--ni-36)
        color-mix(in srgb, var(--color-shadow) 60%, transparent),
      0 0 0 var(--ni-1)
        color-mix(in srgb, var(--color-foreground) 8%, transparent);
    transition:
      transform 380ms cubic-bezier(0.34, 1.45, 0.5, 1),
      box-shadow 380ms ease;

    &:hover,
    &:focus-within {
      z-index: 10;
      transform: rotate(0deg) translateY(var(--ni-neg-6)) scale(1.04);
    }

    @media (prefers-reduced-motion: no-preference) {
      animation: match-stage-deal 820ms cubic-bezier(0.34, 1.45, 0.5, 1)
        calc(700ms + var(--index) * 90ms) backwards;
    }
  }

  .pool {
    position: absolute;
    inset-block-start: var(--ni-30);
    inset-inline-start: calc(50% - var(--ni-120));
    width: var(--ni-240);
    height: calc(var(--ni-1) * 170);
    border-radius: 50%;
    background:
      radial-gradient(
        ellipse at 35% 50%,
        color-mix(in srgb, var(--orange-500) 30%, transparent),
        transparent 60%
      ),
      radial-gradient(
        ellipse at 68% 50%,
        color-mix(in srgb, var(--orange-200) 22%, transparent),
        transparent 60%
      );
    filter: blur(var(--ni-18));

    @media (prefers-reduced-motion: no-preference) {
      animation: match-stage-glow 900ms ease-out 900ms backwards;
    }
  }

  .reflection {
    position: absolute;
    inset-block-start: var(--ni-196);
    inset-inline-start: calc(50% - var(--ni-60));
    width: var(--ni-120);
    height: calc(var(--ni-1) * 26);
    border-radius: 50%;
    background: radial-gradient(
      ellipse,
      color-mix(in srgb, var(--color-shadow) 55%, transparent),
      transparent 70%
    );
  }

  .more {
    position: absolute;
    z-index: 11;
    inset-inline-end: var(--ni-4);
    inset-block-end: var(--ni-8);

    display: flex;
    align-items: center;
    height: var(--ni-28);
    padding-inline: var(--ni-12);
    border-radius: var(--ni-14);

    font-size: var(--font-size-text-small);
    font-weight: 700;
    color: var(--color-text-primary);
    background: color-mix(in srgb, var(--color-background) 92%, transparent);
    box-shadow: inset 0 0 0 var(--ni-1)
      color-mix(in srgb, var(--color-foreground) 18%, transparent);
  }

  @keyframes match-stage-deal {
    from {
      opacity: 0;
      transform: translate(
          calc(var(--x) * -1 * var(--fan-unit)),
          calc(var(--ni-1) * 90)
        )
        rotate(calc(var(--tilt) * -1.3deg)) scale(0.78);
    }

    40% {
      opacity: 1;
    }
  }

  @keyframes match-stage-glow {
    from {
      opacity: 0;
      transform: scale(0.7);
    }
  }
</style>
