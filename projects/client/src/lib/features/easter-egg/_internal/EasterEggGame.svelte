<script lang="ts">
  import CloseIcon from "$lib/components/icons/CloseIcon.svelte";
  import * as m from "$lib/features/i18n/messages";
  import { useMotionDuration } from "$lib/stores/css/useMotionDuration";
  import { delay } from "$lib/utils/timing/delay";
  import { time } from "$lib/utils/timing/time";
  import { onMount } from "svelte";
  import GameButton from "./GameButton.svelte";
  import GameCurtain from "./GameCurtain.svelte";
  import { loadGameFont } from "./loadGameFont.ts";
  import RatedHigher from "./RatedHigher.svelte";
  import { useTitlePool } from "./useTitlePool.ts";

  const { onclose }: { onclose?: () => void } = $props();

  const MIN_TITLES = 3;
  const CURTAIN_DURATION = time.seconds(1.1);
  const INTRO_LINES = [m.text_game_intro_hello(), m.text_game_intro_play()];

  const { titles, isError, retry } = useTitlePool();
  const motionDuration = useMotionDuration();

  let dialog = $state<HTMLDialogElement>();
  let lines = $state.raw<ReadonlyArray<string>>(INTRO_LINES);
  let typedLines = $state.raw<ReadonlyArray<string> | null>(null);
  let isRestarting = $state(false);
  let run = $state(0);

  const isReady = $derived($titles.length >= MIN_TITLES);
  const isOpen = $derived(
    isReady && !isRestarting && lines.length > 0 && typedLines === lines,
  );
  const hasFailed = $derived($isError && !isReady && typedLines === lines);

  async function playAgain() {
    if (isRestarting) return;

    isRestarting = true;
    lines = [];

    await delay($motionDuration(CURTAIN_DURATION));

    run += 1;
    lines = [m.text_game_intro_again()];
    isRestarting = false;
  }

  onMount(() => {
    loadGameFont();
    if (typeof dialog?.showModal === "function") dialog.showModal();
    else dialog?.setAttribute("open", "");
  });
</script>

<dialog
  bind:this={dialog}
  class="trakt-easter-egg-game"
  aria-label={m.header_game_rated_higher()}
  oncancel={(event) => {
    event.preventDefault();
    onclose?.();
  }}
>
  {#if isReady}
    {#key run}
      <RatedHigher
        titles={$titles}
        isRevealed={isOpen}
        onplayagain={playAgain}
        {onclose}
      />
    {/key}
  {/if}

  <GameCurtain
    {isOpen}
    {lines}
    ontyped={(typed) => (typedLines = typed)}
  >
    {#if hasFailed}
      <span class="easter-egg-error">{m.text_game_load_error()}</span>
      <GameButton onclick={retry}>{m.button_text_retry()}</GameButton>
    {/if}
  </GameCurtain>

  <div class="easter-egg-grain" aria-hidden="true"></div>

  {#if onclose}
    <div class="easter-egg-close">
      <GameButton shape="round" label={m.button_label_close()} onclick={onclose}>
        <CloseIcon />
      </GameButton>
    </div>
  {/if}
</dialog>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  @keyframes easter-egg-grain {
    0%,
    100% {
      transform: translate(0, 0);
    }
    20% {
      transform: translate(-5%, 3%);
    }
    40% {
      transform: translate(4%, -6%);
    }
    60% {
      transform: translate(-3%, 6%);
    }
    80% {
      transform: translate(6%, 2%);
    }
  }

  .trakt-easter-egg-game {
    --game-void: var(--shade-1000);
    --game-foreground: var(--shade-10);
    --game-muted: color-mix(in oklch, var(--shade-10) 60%, transparent);
    --game-glass: color-mix(in oklch, var(--shade-10) 8%, transparent);
    --game-glass-line: color-mix(in oklch, var(--shade-10) 15%, transparent);
    --game-green: var(--green-400);
    --game-red: var(--red-500);
    --game-purple: var(--purple-500);
    --game-yellow: var(--yellow-300);
    --game-font-display: "Big Shoulders Display", Impact, "Arial Narrow",
      sans-serif;
    --game-font-mono: "Roboto Mono", "Courier New", monospace;
    --game-close-size: var(--ni-44);
    --game-ease-out: cubic-bezier(0.16, 1, 0.3, 1);
    --game-ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
    --game-ease-in-out: cubic-bezier(0.76, 0, 0.24, 1);

    position: fixed;
    inset: 0;
    width: 100%;
    max-width: none;
    height: 100%;
    max-height: none;
    margin: 0;
    padding: 0;
    border: 0;
    overflow: hidden;
    overscroll-behavior: contain;
    z-index: var(--layer-overlay);

    background: var(--game-void);
    color: var(--game-foreground);
    color-scheme: dark;

    &::backdrop {
      background: var(--game-void);
    }

    &:focus-visible {
      outline: none;
    }

    .easter-egg-grain {
      position: absolute;
      inset: -50%;
      z-index: var(--layer-top);
      pointer-events: none;
      opacity: 0.085;
      mix-blend-mode: overlay;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
      animation: easter-egg-grain 0.9s steps(6) infinite;
    }

    .easter-egg-close {
      position: absolute;
      inset-block-start: calc(env(safe-area-inset-top, 0px) + var(--ni-16));
      inset-inline-end: var(--ni-20);
      z-index: var(--layer-top);
    }

    .easter-egg-error {
      max-width: 32ch;
      font-size: var(--font-size-text);
    }


    @media (prefers-reduced-motion: reduce) {
      .easter-egg-grain {
        animation: none;
      }
    }
  }
</style>
