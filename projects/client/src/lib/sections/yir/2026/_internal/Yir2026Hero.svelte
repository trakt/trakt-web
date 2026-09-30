<script lang="ts">
  import { yirBeats } from "./persona/yirBeats";
  import { getLocale } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages";
  import type { YirDetail } from "$lib/requests/models/YirDetail";
  import type { YirPersonaResult } from "$lib/requests/models/YirPersonaResult";
  import { toGroupedNumber } from "$lib/utils/formatting/number/toGroupedNumber";
  import { toPersonaCardData } from "./cards/toPersonaCardData";
  import { traitLabel } from "./persona/traitLabel";
  import YirHybridStamp from "./cards/YirHybridStamp.svelte";
  import { onMount } from "svelte";
  import YirCountUp from "./scenes/YirCountUp.svelte";
  import YirPersonaCard from "./cards/YirPersonaCard.svelte";

  const {
    result,
    detail,
    name,
    isMe,
    isMorphTarget = true,
    hasArrived = false,
    onreplay,
  }: {
    result: YirPersonaResult;
    detail: YirDetail | null;
    name: string;
    isMe: boolean;
    isMorphTarget?: boolean;
    hasArrived?: boolean;
    onreplay: () => void;
  } = $props();

  const card = $derived(
    toPersonaCardData({
      result,
      persona: result.persona,
      highlights: result.highlights,
    }),
  );
  const runner = $derived(
    result.runnerUp
      ? toPersonaCardData({
          result,
          persona: result.runnerUp,
          highlights: result.runnerUpHighlights,
        })
      : null,
  );

  let isMounted = $state(false);
  onMount(() => {
    isMounted = true;
  });

  const totals = $derived(
    [
      detail
        ? {
            key: "hours",
            value: Math.round(detail.stats.all.minutes.total / 60),
            label: m.yir_2026_reel_hours(),
          }
        : null,
      detail
        ? {
            key: "plays",
            value: detail.stats.all.playCounts.total,
            label: m.yir_2026_highlight_plays(),
          }
        : null,
      {
        key: "streak",
        value: result.streak.longest,
        label: m.yir_2026_highlight_streak_days(),
      },
    ].filter((total) => total !== null),
  );

  const locale = getLocale();
</script>

<section class="trakt-yir-2026-hero" id="section-totals">
  <div class="yir-2026-hero-inner">
  <div
    class="yir-2026-hero-card"
    class:has-arrived={hasArrived}
    style:view-transition-name={isMorphTarget ? "yir-persona-card" : null}
  >
    <YirPersonaCard {card} />
  </div>

  <div class="yir-2026-hero-copy">
    <span class="yir-2026-hero-kicker">{m.yir_2026_reel_and_you_are()}</span>
    <h1 class="yir-2026-hero-name">{card.name}</h1>
    <p class="yir-2026-hero-tagline">{card.tagline}</p>

    {#if runner}
      <YirHybridStamp name={runner.name} />
    {/if}

    <p class="yir-2026-hero-rarity">
      {m.yir_2026_rarity({ percent: result.rarity, persona: card.name })}
    </p>

    <dl class="yir-2026-hero-totals">
      {#each totals as total (total.key)}
        <div>
          <dt>{total.label}</dt>
          <dd>
            <YirCountUp
              value={total.value}
              active={isMounted}
              format={(value) => toGroupedNumber(Math.round(value), locale)}
              duration={yirBeats(18)}
            />
          </dd>
        </div>
      {/each}
    </dl>

    <div class="yir-2026-hero-traits">
      <span class="yir-2026-hero-kicker">{m.yir_2026_traits()}</span>
      <ul>
        {#each result.traits as trait (trait)}
          <li>{traitLabel(trait)}</li>
        {/each}
      </ul>
    </div>

    <button class="yir-2026-hero-replay" type="button" onclick={onreplay}>
      ▶ {isMe ? m.yir_2026_replay() : m.yir_2026_watch_reel({ name })}
    </button>
  </div>
  </div>
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-yir-2026-hero {
    position: relative;
    width: 100%;
    background:
      radial-gradient(
        70% 90% at 15% 0%,
        color-mix(in srgb, var(--color-yir-accent) 24%, transparent),
        transparent 70%
      ),
      radial-gradient(
        55% 70% at 90% 15%,
        color-mix(in srgb, var(--color-yir-accent) 14%, transparent),
        transparent 70%
      ),
      var(--color-yir-background);
  }

  .yir-2026-hero-inner {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    justify-items: center;
    gap: var(--ni-32);
    box-sizing: border-box;
    max-width: var(--ni-1280);
    margin-inline: auto;
    padding: calc(var(--ni-104) + env(safe-area-inset-top, 0px)) var(--ni-24)
      var(--ni-72);

    @include for-tablet-lg {
      grid-template-columns: minmax(0, var(--ni-340)) minmax(0, 1fr);
      justify-items: start;
      align-items: center;
      gap: var(--ni-48);
      padding-inline: var(--ni-48);
    }

    @include for-desktop {
      grid-template-columns: minmax(0, var(--ni-380)) minmax(0, 1fr);
      justify-items: start;
      align-items: center;
      gap: var(--ni-72);
      padding-inline: var(--ni-72);
    }
  }

  .yir-2026-hero-card {
    justify-self: center;
    width: min(100%, var(--ni-340));
    margin-inline: auto;

    @include for-tablet-lg {
      justify-self: start;
      margin-inline: 0;
    }

    @include for-desktop {
      justify-self: start;
      margin-inline: 0;
    }
  }

  .yir-2026-hero-copy {
    container-type: inline-size;
    width: 100%;
    min-width: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: var(--ni-12);

    @include for-tablet-lg {
      align-items: flex-start;
      text-align: start;
    }

    @include for-desktop {
      align-items: flex-start;
      text-align: start;
    }
  }

  .yir-2026-hero-kicker {
    font-family: var(--yir-font-mono);
    font-size: var(--font-size-tag);
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--color-yir-text-muted);
  }

  .yir-2026-hero-name {
    margin: 0;
    font-family: var(--yir-font-display);
    font-size: clamp(var(--ni-32), 11cqi, var(--ni-104));
    line-height: 0.95;
    overflow-wrap: break-word;
    color: var(--color-yir-text-primary);
  }

  .yir-2026-hero-tagline,
  .yir-2026-hero-rarity {
    margin: 0;
    color: var(--color-yir-text-secondary);
    font-size: var(--font-size-title);
  }

  .yir-2026-hero-rarity {
    font-size: var(--font-size-text);
    color: var(--color-yir-text-accent);
  }

  .yir-2026-hero-totals {
    display: flex;
    flex-wrap: wrap;
    justify-content: inherit;
    gap: var(--ni-24);
    margin: var(--ni-8) 0 0;

    div {
      display: flex;
      flex-direction: column-reverse;
    }

    dt {
      font-size: var(--font-size-tag);
      color: var(--color-yir-text-muted);
    }

    dd {
      margin: 0;
      font-family: var(--yir-font-display);
      font-size: clamp(var(--ni-40), 9cqi, var(--ni-80));
      line-height: 1;
      color: var(--color-yir-accent);
      font-variant-numeric: tabular-nums;
    }
  }

  .yir-2026-hero-traits {
    display: flex;
    flex-direction: column;
    align-items: inherit;
    gap: var(--ni-6);

    ul {
      display: flex;
      flex-wrap: wrap;
      gap: var(--ni-6);
      margin: 0;
      padding: 0;
      list-style: none;
    }

    li {
      padding: var(--ni-4) var(--ni-12);
      border-radius: var(--border-radius-xxl);
      border: var(--ni-1) solid var(--color-yir-border-subtle);
      font-size: var(--font-size-tag);
    }
  }

  .yir-2026-hero-replay {
    margin-top: var(--ni-8);
    padding: var(--ni-12) var(--ni-24);
    border: 0;
    border-radius: var(--border-radius-xxl);
    background: var(--color-yir-accent);
    color: var(--color-yir-background);
    font: inherit;
    font-weight: 700;
    cursor: pointer;
  }

  .trakt-yir-2026-hero {
    overflow: clip;
  }

  .trakt-yir-2026-hero::before {
    content: "";
    position: absolute;
    inset: -10%;
    pointer-events: none;
    background: radial-gradient(
      40% 50% at 70% 30%,
      color-mix(in srgb, var(--color-yir-accent) 16%, transparent),
      transparent 70%
    );
    animation: hero-drift 18s ease-in-out infinite alternate;
  }

  .yir-2026-hero-inner {
    position: relative;
    z-index: var(--layer-base);
  }

  .yir-2026-hero-card {
    animation:
      hero-rise var(--yir-t-hero) var(--yir-ease) both,
      hero-float 7s ease-in-out var(--yir-t-hero) infinite alternate;
  }

  .yir-2026-hero-copy > :global(*) {
    animation: hero-rise calc(var(--yir-beat) * 9) var(--yir-ease) both;
  }

  @for $i from 1 through 9 {
    .yir-2026-hero-copy > :global(:nth-child(#{$i})) {
      animation-delay: calc(var(--yir-beat) * #{1.5 + $i * 0.7});
    }
  }

  .yir-2026-hero-traits li {
    transition:
      translate var(--yir-t-quick) var(--yir-ease),
      border-color var(--yir-t-quick) ease,
      color var(--yir-t-quick) ease;
  }

  .yir-2026-hero-replay {
    position: relative;
    overflow: hidden;
    transition:
      transform var(--yir-t-quick) var(--yir-ease),
      box-shadow var(--yir-t-quick) ease;

    &::after {
      content: "";
      position: absolute;
      inset: 0;
      width: 40%;
      background: linear-gradient(
        100deg,
        transparent,
        color-mix(in srgb, var(--shade-10) 50%, transparent),
        transparent
      );
      transform: translateX(-150%) skewX(-20deg);
      animation: replay-sheen 4.5s ease-in-out 2.2s infinite;
    }
  }

  @media (hover: hover) {
    .yir-2026-hero-traits li:hover {
      translate: 0 calc(-1 * var(--ni-2));
      border-color: var(--color-yir-accent);
      color: var(--color-yir-text-accent);
    }

    .yir-2026-hero-replay:hover {
      transform: translateY(calc(-1 * var(--ni-2)));
      box-shadow: 0 var(--ni-12) var(--ni-32)
        color-mix(in srgb, var(--color-yir-accent) 45%, transparent);
    }
  }

  @keyframes hero-rise {
    from {
      opacity: 0;
      translate: 0 var(--ni-24);
    }
  }

  @keyframes hero-float {
    to {
      transform: translateY(calc(-1 * var(--ni-8)));
    }
  }

  @keyframes hero-drift {
    to {
      transform: translate(-6%, 4%) scale(1.1);
    }
  }

  @keyframes replay-sheen {
    0%,
    70% {
      transform: translateX(-150%) skewX(-20deg);
    }
    100% {
      transform: translateX(350%) skewX(-20deg);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .trakt-yir-2026-hero::before,
    .yir-2026-hero-card,
    .yir-2026-hero-copy > :global(*),
    .yir-2026-hero-replay::after {
      animation: none;
    }

    .yir-2026-hero-traits li,
    .yir-2026-hero-replay {
      transition: none;
    }
  }

  .yir-2026-hero-card.has-arrived {
    animation: hero-float 7s ease-in-out var(--yir-t-hero) infinite alternate;
  }
</style>
