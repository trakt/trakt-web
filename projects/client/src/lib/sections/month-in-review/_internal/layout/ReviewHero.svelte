<script lang="ts">
  import { getLocale, getTextDirection, languageTag } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import { toHumanMonth } from "$lib/utils/formatting/date/toHumanMonth";
  import type { Snippet } from "svelte";
  import type { MonthReviewTitle } from "../models/MonthReviewTitle.ts";
  import PosterDeck from "./PosterDeck.svelte";
  import { heroScroll } from "./heroScroll.ts";

  const {
    year,
    month,
    subtitle,
    titles,
    isLoading,
    scrollIntro,
    stats,
  }: {
    year: number;
    month: number;
    subtitle: string;
    titles: ReadonlyArray<MonthReviewTitle>;
    isLoading: boolean;
    scrollIntro: boolean;
    stats: Snippet;
  } = $props();

  const monthName = $derived(
    toHumanMonth(new Date(year, month - 1, 1), languageTag()),
  );
  const letters = $derived(
    getTextDirection(getLocale()) === "rtl"
      ? [monthName]
      : Array.from(
          new Intl.Segmenter(languageTag(), {
            granularity: "grapheme",
          }).segment(monthName),
          ({ segment }) => segment,
        ),
  );
  const isStatic = $derived(
    !scrollIntro || (!isLoading && titles.length === 0),
  );
</script>

<div
  class="trakt-month-review-hero-scroll"
  class:is-static={isStatic}
  use:heroScroll={isStatic}
>
  <section class="trakt-month-review-hero">
    <div class="copy">
      <span class="kicker bold">
        <i></i>
        {year} · {m.month_review_kicker({ episode: month })}
      </span>
      <h1 class="title" aria-label={monthName}>
        {#each letters as letter, index (index)}
          <span class="letter" style="--index: {index}" aria-hidden="true"
            >{letter}</span
          >
        {/each}
      </h1>
      <p class="subtitle"><i></i>{subtitle}</p>
      <div class="stats">{@render stats()}</div>
    </div>

    {#if isLoading || titles.length > 0}
      <PosterDeck {titles} {isLoading} />
    {/if}
  </section>
  <div class="travel" aria-hidden="true">
    <span class="cue bold"><i></i>{m.month_review_scroll_cue()}</span>
  </div>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-month-review-hero-scroll {
    --hero-scroll-mode: scroll;
    --p: 0;

    .travel {
      display: flex;
      justify-content: center;
      height: var(--ni-380);
      padding-top: var(--ni-80);
      box-sizing: border-box;
    }

    @include for-tablet-sm-and-below {
      --hero-scroll-mode: stacked;
      --p: 1;

      .travel {
        display: none;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      --p: 1;

      .travel {
        display: none;
      }
    }

    &.is-static {
      --hero-scroll-mode: stacked;
      --p: 1;

      .travel {
        display: none;
      }

      .trakt-month-review-hero {
        min-height: 0;
      }

      .cue {
        display: none;
      }
    }
  }

  .trakt-month-review-hero {
    position: sticky;
    top: 0;
    z-index: 1;
    isolation: isolate;
    display: grid;
    grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
    align-items: center;
    gap: var(--gap-xl);
    padding-block: var(--gap-l) var(--ni-72);
    container-type: inline-size;

    &::before {
      content: "";
      position: absolute;
      inset: calc(-1 * var(--ni-120)) -50vw 0;
      z-index: -1;
      pointer-events: none;
      background: radial-gradient(
        34% 62% at 38% 16%,
        var(--color-month-review-glow),
        transparent 74%
      );
    }

    @include for-tablet-sm-and-below {
      grid-template-columns: minmax(0, 1fr);
      gap: var(--gap-m);
      padding-block: var(--gap-m) var(--gap-xl);
    }
  }

  .copy {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);
    min-width: 0;
  }

  .kicker {
    display: inline-flex;
    align-items: center;
    gap: var(--gap-s);
    font-size: var(--font-size-text-small);
    letter-spacing: 0.13em;
    text-transform: uppercase;
    color: var(--color-text-secondary);

    i {
      width: var(--ni-8);
      height: var(--ni-8);
      border-radius: 50%;
      background: var(--color-month-review-accent);
      box-shadow: 0 0 0 var(--ni-4)
        color-mix(in srgb, var(--color-month-review-accent) 18%, transparent);
    }
  }

  .title {
    transform-origin: 0 0;

    &:dir(rtl) {
      transform-origin: 100% 0;
    }
    scale: calc(1.3 - 0.3 * var(--p));
    margin-block-end: calc(0.27em * (1 - var(--p)));
    margin: 0;
    font-size: clamp(var(--ni-64), 11cqi, var(--ni-160));
    font-weight: 700;
    letter-spacing: -0.05em;
    line-height: 0.9;
    white-space: nowrap;
  }

  .letter {
    display: inline-block;
    font-size: inherit;
    font-weight: inherit;
    letter-spacing: inherit;
    line-height: inherit;
    padding-block-end: 0.18em;
    margin-block-end: -0.18em;
    background: linear-gradient(
      180deg,
      var(--color-text-primary) 48%,
      color-mix(
        in srgb,
        var(--color-text-primary) 58%,
        var(--color-month-review-accent)
      )
    );
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: letter-in 900ms cubic-bezier(0.16, 1, 0.3, 1) both;
    animation-delay: calc(var(--index) * 38ms + 80ms);
  }

  .subtitle,
  .stats {
    opacity: clamp(0, calc(var(--p) * 1.6 - 0.3), 1);
    translate: 0 calc((1 - var(--p)) * var(--ni-24));
  }

  .cue {
    display: inline-flex;
    align-self: flex-start;
    flex-direction: column;
    align-items: center;
    gap: var(--gap-xs);
    font-size: var(--font-size-text-small);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--color-text-secondary);
    opacity: clamp(0, calc(1 - var(--p) * 4), 1);
    pointer-events: none;

    i {
      display: block;
      width: 1px;
      height: var(--ni-28);
      background: currentColor;
      transform-origin: top;
      animation: cue 1.6s ease-in-out infinite;
    }
  }

  @keyframes cue {
    0% {
      transform: scaleY(0);
      transform-origin: top;
    }

    50% {
      transform: scaleY(1);
      transform-origin: top;
    }

    51% {
      transform-origin: bottom;
    }

    100% {
      transform: scaleY(0);
      transform-origin: bottom;
    }
  }

  .subtitle {
    display: flex;
    align-items: center;
    gap: var(--gap-m);
    margin: 0;
    font-size: var(--font-size-title);
    color: var(--color-text-secondary);

    i {
      width: var(--ni-56);
      height: var(--ni-2);
      border-radius: var(--ni-2);
      background: var(--color-month-review-accent);
    }
  }

  .stats {
    display: flex;
    flex-wrap: wrap;
    gap: var(--gap-l) var(--gap-xl);
    margin-top: var(--gap-s);
  }

  @keyframes letter-in {
    from {
      opacity: 0;
      transform: translateY(0.32em) rotate(2.5deg);
      filter: blur(8px);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .letter,
    .cue i {
      animation: none;
    }
  }
</style>
