<script lang="ts">
  import * as m from "$lib/features/i18n/messages";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import { useMotionDuration } from "$lib/stores/css/useMotionDuration";
  import { NOOP_FN } from "$lib/utils/constants";
  import { delay } from "$lib/utils/timing/delay";
  import { time } from "$lib/utils/timing/time";
  import { shortcut } from "@svelte-put/shortcut";
  import { onDestroy, tick, untrack } from "svelte";
  import { burstConfetti } from "./burstConfetti.ts";
  import { createSlotDeck } from "./createSlotDeck.ts";
  import { easterEggStorage } from "./easterEggStorage.ts";
  import GameOver from "./GameOver.svelte";
  import GamePanel from "./GamePanel.svelte";
  import type { GamePhase } from "./GamePhase.ts";
  import type { Guess } from "./Guess.ts";
  import type { GuessResult } from "./GuessResult.ts";
  import { isRightGuess } from "./isRightGuess.ts";
  import type { RatedHigherProps } from "./RatedHigherProps.ts";
  import { toGameRating } from "./toGameRating.ts";
  import { toPanelRoles } from "./toPanelRoles.ts";
  import { toSwipeGuess } from "./toSwipeGuess.ts";
  import { toTilt } from "./toTilt.ts";
  import { toVersusState } from "./toVersusState.ts";
  import VersusBadge from "./VersusBadge.svelte";

  const { titles, isRevealed, onplayagain, onclose }: RatedHigherProps =
    $props();

  const REVEAL_DURATION = time.seconds(1.2);
  const RESULT_HOLD = time.seconds(0.9);
  const ADVANCE_DURATION = time.seconds(0.95);
  const ADVANCE_EASING = "cubic-bezier(0.76, 0, 0.24, 1)";
  const SWIPE_THRESHOLD = 40;
  const MAX_TILT = { x: 14, y: 10 };
  const FIRE_STREAK = 3;
  const CONFETTI_COLORS = [
    "--game-green",
    "--game-purple",
    "--game-foreground",
    "--game-yellow",
  ];

  const motionDuration = useMotionDuration();
  const isReducedMotion = useMedia(WellKnownMediaQuery.reducedMotion);
  const isMouse = useMedia(WellKnownMediaQuery.mouse);

  const deck = createSlotDeck({
    pool: untrack(() => titles),
    random: Math.random,
  });

  let streak = $state(0);
  let best = $state(easterEggStorage.read().rated_higher_streak ?? 0);
  let isNewBest = $state(false);
  let phase = $state<GamePhase>("guess");
  let guess = $state<Guess | null>(null);
  let result = $state<GuessResult | null>(null);
  let announcement = $state("");
  let tilt = $state.raw({ x: 0, y: 0 });

  let stage = $state<HTMLElement>();
  let track = $state<HTMLElement>();
  let versus = $state<HTMLElement>();
  let confetti = $state<HTMLCanvasElement>();

  let touchStartY: number | null = null;
  let stageBox: DOMRect | null = null;
  let swipeGuess = $state<Guess | null>(null);
  let stopConfetti = NOOP_FN;

  let slots = $state.raw(deck.opening());

  const roles = $derived(toPanelRoles(phase));
  const isMysteryActive = $derived(phase !== "advance");
  const missedTitle = $derived(slots.at(1)?.title);
  const versusState = $derived(toVersusState({ phase, result }));

  function celebrate() {
    if ($isReducedMotion || !confetti || !versus) return;

    const canvasBox = confetti.getBoundingClientRect();
    const badgeBox = versus.getBoundingClientRect();
    const styles = getComputedStyle(confetti);

    stopConfetti();
    stopConfetti = burstConfetti({
      canvas: confetti,
      origin: {
        x: badgeBox.left - canvasBox.left + badgeBox.width / 2,
        y: badgeBox.top - canvasBox.top + badgeBox.height / 2,
      },
      colors: CONFETTI_COLORS.map((name) =>
        styles.getPropertyValue(name).trim()
      ),
    });
  }

  function recordHit() {
    streak += 1;
    if (streak <= best) return;

    best = streak;
    isNewBest = true;
    easterEggStorage.write({ rated_higher_streak: streak });
  }

  async function advance() {
    const [leaving, current] = Array.from(track?.children ?? []);
    const [, mystery, upcoming] = slots;

    if (!track || !(leaving instanceof HTMLElement)) return;
    if (!(current instanceof HTMLElement) || !mystery || !upcoming) return;

    phase = "advance";

    const offsetX = leaving.offsetLeft - current.offsetLeft;
    const offsetY = leaving.offsetTop - current.offsetTop;
    const slide = track.animate(
      [
        { transform: "translate3d(0, 0, 0)" },
        { transform: `translate3d(${offsetX}px, ${offsetY}px, 0)` },
      ],
      {
        duration: $motionDuration(ADVANCE_DURATION),
        easing: ADVANCE_EASING,
        fill: "forwards",
      },
    );

    await slide.finished.catch(NOOP_FN);

    slots = [mystery, upcoming, deck.draw({ after: upcoming, streak })];
    guess = null;
    result = null;
    phase = "guess";

    await tick();
    slide.cancel();
  }

  async function onguess(next: Guess) {
    const [known, mystery] = slots;
    if (phase !== "guess" || !isRevealed || !known || !mystery) return;

    guess = next;
    phase = "reveal";
    announcement = "";

    await delay($motionDuration(REVEAL_DURATION));

    const isRight = isRightGuess({
      known: known.title.rating,
      mystery: mystery.title.rating,
      guess: next,
    });

    result = isRight ? "hit" : "miss";
    phase = "result";
    announcement = m.text_game_reveal({
      title: mystery.title.title,
      rating: toGameRating(mystery.title),
    });

    if (isRight) {
      recordHit();
      celebrate();
    }

    await delay(RESULT_HOLD);

    if (!isRight) {
      phase = "over";
      return;
    }

    await advance();
  }

  const keyTriggers = $derived([
    {
      key: "ArrowUp",
      enabled: isRevealed,
      preventDefault: true,
      callback: () => onguess("higher"),
    },
    {
      key: "ArrowDown",
      enabled: isRevealed,
      preventDefault: true,
      callback: () => onguess("lower"),
    },
  ]);

  function onpointerenter() {
    stageBox = stage?.getBoundingClientRect() ?? null;
  }

  function onpointerleave() {
    stageBox = null;
    tilt = { x: 0, y: 0 };
  }

  function onpointermove(event: PointerEvent) {
    if (!$isMouse || $isReducedMotion || !stageBox) return;

    tilt = toTilt({
      point: { x: event.clientX, y: event.clientY },
      box: stageBox,
      max: MAX_TILT,
    });
  }

  function swipeGuessAt(endY: number | undefined): Guess | null {
    return toSwipeGuess({
      startY: touchStartY,
      endY,
      threshold: SWIPE_THRESHOLD,
    });
  }

  function ontouchstart(event: TouchEvent) {
    touchStartY = event.touches.item(0)?.clientY ?? null;
  }

  function ontouchmove(event: TouchEvent) {
    if (phase !== "guess") return;
    swipeGuess = swipeGuessAt(event.touches.item(0)?.clientY);
  }

  function ontouchend(event: TouchEvent) {
    const next = swipeGuessAt(event.changedTouches.item(0)?.clientY);
    touchStartY = null;
    swipeGuess = null;

    if (next) onguess(next);
  }

  onDestroy(() => stopConfetti());
</script>

<svelte:window use:shortcut={{ trigger: keyTriggers }} />

<div
  class="trakt-rated-higher"
  style:--game-advance-duration="{ADVANCE_DURATION}ms"
  class:is-revealed={isRevealed}
  class:has-missed={result === "miss"}
>
  <div
    class="rated-higher-stage"
    role="presentation"
    bind:this={stage}
    style:--game-tilt-x="{tilt.x}deg"
    style:--game-tilt-y="{tilt.y}deg"
    {onpointerenter}
    {onpointermove}
    {onpointerleave}
    {ontouchstart}
    {ontouchmove}
    {ontouchend}
    ontouchcancel={() => (swipeGuess = null)}
  >
    <div class="rated-higher-viewport">
      <div class="rated-higher-track" bind:this={track}>
        {#each slots as slot, index (slot.id)}
          <GamePanel
            title={slot.title}
            role={roles.at(index) ?? "upcoming"}
            guess={index === 1 && isMysteryActive ? guess : null}
            result={index === 1 && isMysteryActive ? result : null}
            leaning={index === 1 ? swipeGuess : null}
            entranceIndex={index}
            {onguess}
          />
        {/each}
      </div>

      <div class="rated-higher-versus" bind:this={versus}>
        <VersusBadge state={versusState} isSpinning={phase === "advance"} />
      </div>
    </div>

    <canvas class="rated-higher-confetti" bind:this={confetti}></canvas>
  </div>

  <header class="rated-higher-hud">
    <h2 class="rated-higher-logo">{m.header_game_rated_higher()}</h2>
    <div class="rated-higher-score" class:is-on-fire={streak >= FIRE_STREAK}>
      <span>{m.label_game_streak()}</span>
      {#key streak}
        <strong class="rated-higher-streak" class:is-popped={streak > 0}>
          {streak}
        </strong>
      {/key}
      <span class="rated-higher-separator"></span>
      <span>{m.label_game_best()}</span>
      <strong>{best}</strong>
    </div>
  </header>

  <p class="rated-higher-hint">
    <span class="hint-keys">
      <span><kbd>↑</kbd> {m.button_text_game_higher()}</span>
      <span><kbd>↓</kbd> {m.button_text_game_lower()}</span>
      <span><kbd>esc</kbd> {m.button_text_game_close()}</span>
    </span>
    <span class="hint-swipe">{m.text_game_hint_swipe()}</span>
  </p>

  <p class="rated-higher-announcer" aria-live="polite">{announcement}</p>

  {#if phase === "over" && missedTitle}
    <GameOver
      title={missedTitle}
      {streak}
      {best}
      {isNewBest}
      {onplayagain}
      {onclose}
    />
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  @keyframes rated-higher-shake {
    0%,
    100% {
      transform: translateX(0);
    }
    15% {
      transform: translateX(calc(var(--ni-12) * -1));
    }
    30% {
      transform: translateX(var(--ni-10));
    }
    45% {
      transform: translateX(calc(var(--ni-8) * -1));
    }
    60% {
      transform: translateX(var(--ni-6));
    }
    75% {
      transform: translateX(calc(var(--ni-3) * -1));
    }
  }

  @keyframes rated-higher-flash {
    15% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }

  @keyframes rated-higher-pop {
    from {
      transform: scale(2.2);
      color: var(--game-green);
    }
  }

  .trakt-rated-higher {

    position: absolute;
    inset: 0;

    .rated-higher-stage {
      position: absolute;
      inset: 0;
      overflow: clip;
      touch-action: none;

      transition:
        transform 1.4s var(--game-ease-out),
        filter 1.4s var(--game-ease-out);

      &::after {
        content: "";
        position: absolute;
        inset: 0;
        z-index: var(--layer-floating);
        pointer-events: none;
        opacity: 0;
        background: radial-gradient(
          circle,
          transparent 25%,
          color-mix(in oklch, var(--game-red) 85%, transparent)
        );
      }
    }

    .rated-higher-viewport {
      position: absolute;
      inset: 0;
      overflow: clip;

      @include for-tablet-sm-and-below {
        inset-block: calc(env(safe-area-inset-top, 0px) + var(--ni-72))
          calc(env(safe-area-inset-bottom, 0px) + var(--ni-40));
      }
    }

    .rated-higher-track {
      position: absolute;
      inset: 0;
      display: grid;
      grid-auto-flow: column;
      grid-auto-columns: 50%;
      grid-template-rows: 100%;

      @include for-tablet-sm-and-below {
        grid-auto-flow: row;
        grid-auto-rows: 50%;
        grid-template-rows: none;
        grid-template-columns: 100%;
      }
    }

    .rated-higher-versus {
      position: absolute;
      left: 50%;
      top: 50%;
      z-index: var(--layer-raised);
      transform: translate(-50%, -50%);
      transition: transform 0.9s var(--game-ease-spring) 0.7s;
    }

    .rated-higher-confetti {
      position: absolute;
      inset: 0;
      z-index: var(--layer-floating);
      width: 100%;
      height: 100%;
      pointer-events: none;
    }

    .rated-higher-hud {
      position: absolute;
      inset-block-start: 0;
      inset-inline: 0;
      z-index: var(--layer-raised);

      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--ni-16);
      padding-block-start: calc(env(safe-area-inset-top, 0px) + var(--ni-20));
      padding-inline: var(--ni-24)
        calc(var(--ni-24) + var(--game-close-size) + var(--ni-16));
      pointer-events: none;

      transition:
        opacity 0.8s var(--game-ease-out) 0.6s,
        transform 0.8s var(--game-ease-out) 0.6s;
    }

    .rated-higher-logo {
      margin: 0;
      font-family: var(--game-font-display);
      font-weight: 900;
      font-size: clamp(var(--ni-20), 2vw, var(--ni-32));
      line-height: 1;
      text-transform: uppercase;
      white-space: nowrap;
    }

    .rated-higher-score {
      display: inline-flex;
      align-items: center;
      gap: var(--ni-8);
      padding-block: var(--ni-6);
      padding-inline: var(--ni-16);
      border-radius: var(--border-radius-xxl);

      background: var(--game-glass);
      border: var(--ni-1) solid var(--game-glass-line);
      backdrop-filter: blur(var(--ni-12));

      font-family: var(--game-font-mono);
      font-size: var(--font-size-tag);
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--game-muted);

      transition:
        border-color var(--transition-duration-short) ease-out,
        box-shadow var(--transition-duration-short) ease-out;

      span {
        font-size: inherit;
      }

      strong {
        display: inline-block;
        min-width: 1ch;
        font-family: var(--game-font-display);
        font-weight: 900;
        font-size: var(--ni-24);
        letter-spacing: 0;
        line-height: 1;
        text-align: center;
        color: var(--game-foreground);
      }

      &.is-on-fire {
        border-color: var(--game-yellow);
        box-shadow: 0 0 var(--ni-24) calc(var(--ni-4) * -1) var(--game-yellow);

        .rated-higher-streak {
          color: var(--game-yellow);
        }
      }
    }

    .rated-higher-streak.is-popped {
      animation: rated-higher-pop 0.65s var(--game-ease-spring);
    }

    .rated-higher-separator {
      width: var(--ni-1);
      height: var(--ni-20);
      background: var(--game-glass-line);
    }

    .rated-higher-hint {
      position: absolute;
      inset-inline: 0;
      inset-block-end: 0;
      z-index: var(--layer-raised);
      margin: 0;
      padding-block-end: calc(env(safe-area-inset-bottom, 0px) + var(--ni-16));

      display: flex;
      justify-content: center;
      pointer-events: none;

      font-family: var(--game-font-mono);
      font-size: var(--font-size-tag);
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--game-muted);

      kbd {
        font-family: inherit;
        padding-inline: var(--ni-6);
        margin-inline-end: var(--ni-4);
        border: var(--ni-1) solid var(--game-glass-line);
        border-block-end-width: var(--ni-2);
        border-radius: var(--border-radius-xs);
        color: var(--game-foreground);
      }
    }

    .hint-keys span,
    .hint-swipe {
      font-size: inherit;
    }

    .hint-keys {
      display: flex;
      gap: var(--ni-24);
    }

    .hint-swipe {
      display: none;
    }

    @include for-touch {
      .hint-keys {
        display: none;
      }

      .hint-swipe {
        display: inline;
      }
    }

    .rated-higher-announcer {
      @include visually-hidden;
    }

    &:not(.is-revealed) {
      .rated-higher-stage {
        transform: scale(1.12);
        filter: brightness(0.3);
      }

      .rated-higher-hud {
        opacity: 0;
        transform: translateY(-60%);
      }

      .rated-higher-versus {
        transform: translate(-50%, -50%) scale(0) rotate(-180deg);
      }
    }

    &.has-missed .rated-higher-stage {
      animation: rated-higher-shake 0.52s ease-out;

      &::after {
        animation: rated-higher-flash 0.8s ease-out;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .rated-higher-stage,
      .rated-higher-hud,
      .rated-higher-versus {
        transition: none;
      }

      &.has-missed .rated-higher-stage,
      &.has-missed .rated-higher-stage::after,
      .rated-higher-streak.is-popped {
        animation: none;
      }
    }
  }
</style>
