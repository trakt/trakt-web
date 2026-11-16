<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import type { ReviewTitle } from "$lib/sections/review/models/ReviewTitle.ts";
  import { toPlaysLabel } from "$lib/sections/review/toPlaysLabel.ts";
  import { SvelteSet } from "svelte/reactivity";

  const DECK_SIZE = 6;

  const {
    titles,
    isLoading,
  }: {
    titles: ReadonlyArray<ReviewTitle>;
    isLoading: boolean;
  } = $props();

  const deck = $derived(
    [...titles]
      .sort((a, b) => b.plays - a.plays)
      .slice(0, DECK_SIZE)
      .reverse(),
  );

  const loaded = new SvelteSet<string>();
  const markLoaded = (poster: string) => loaded.add(poster);

  const offset = $derived(DECK_SIZE - deck.length);
  const slots = $derived(
    Array.from({ length: DECK_SIZE }, (_, index) =>
      isLoading || index < offset ? null : deck.at(index - offset),
    ),
  );
</script>

<div class="trakt-month-review-poster-deck">
  {#each slots as title, index (index)}
    <div
      aria-hidden={title ? undefined : "true"}
      class="poster"
      class:is-placeholder={isLoading || (title && !loaded.has(title.poster))}
      class:is-empty={!isLoading && !title}
      class:is-top={index === DECK_SIZE - 1}
      style="--index: {index}"
    >
      <div class="card">
        {#if title}
          <Link
            href={UrlBuilder.media(title.type, title.slug)}
            label={title.title || toPlaysLabel(title.plays)}
            underline="none"
          >
            <img
              src={title.poster}
              alt=""
              onload={() => markLoaded(title.poster)}
              onerror={() => markLoaded(title.poster)}
            />
            {#if index === DECK_SIZE - 1}
              <span class="tag bold">{m.month_review_tag_number_one()}</span>
            {/if}
          </Link>
        {/if}
      </div>
    </div>
  {/each}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-month-review-poster-deck {
    --spread: 1;
    --shift: 0cqi;

    position: relative;
    height: min(70vh, var(--ni-480));
    min-height: var(--ni-320);
    container-type: inline-size;

    @include for-tablet-sm-and-below {
      --spread: 0.45;
      --shift: 23cqi;
    }

    @include for-mobile {
      height: auto;
      min-height: 0;
      aspect-ratio: 1;
    }
  }

  .poster {
    --dx: 0cqi;
    --dy: 0cqi;
    --tilt: 0deg;
    --sx: 0cqi;
    --sy: 0cqi;
    --sr: 0deg;
    --progress: var(--deal, var(--p, 1));

    position: absolute;
    left: 50%;
    top: 50%;
    width: clamp(var(--ni-96), 28%, var(--ni-180));
    aspect-ratio: 2 / 3;
    animation: float 7s ease-in-out infinite alternate;
    animation-delay: calc(var(--index) * -1.3s);
    transform: translate(-50%, -50%)
      translate(
        calc(
          var(--rtl-sign) *
            (
              (var(--sx) * var(--spread) + var(--shift)) *
                (1 - var(--progress)) + var(--dx) * var(--progress)
            )
        ),
        calc(
          var(--sy) * var(--spread) * (1 - var(--progress)) + var(--dy) *
            var(--progress)
        )
      )
      rotate(
        calc(
          var(--rtl-sign) *
            (var(--sr) * (1 - var(--progress)) + var(--tilt) * var(--progress))
        )
      )
      scale(calc(1.15 - 0.15 * var(--progress)));

    &:nth-child(1) {
      --sx: -150cqi;
      --sy: 34cqi;
      --sr: -8deg;
      --dx: -36cqi;
      --dy: -14cqi;
      --tilt: -10deg;
    }

    &:nth-child(2) {
      --sx: -112cqi;
      --sy: 42cqi;
      --sr: 5deg;
      --dx: -24cqi;
      --dy: 14cqi;
      --tilt: -5deg;
    }

    &:nth-child(3) {
      --sx: -72cqi;
      --sy: 30cqi;
      --sr: -4deg;
      --dx: 26cqi;
      --dy: -16cqi;
      --tilt: 6deg;
    }

    &:nth-child(4) {
      --sx: -32cqi;
      --sy: 44cqi;
      --sr: 7deg;
      --dx: 34cqi;
      --dy: 12cqi;
      --tilt: 10deg;
    }

    &:nth-child(5) {
      --sx: 6cqi;
      --sy: 30cqi;
      --sr: -6deg;
      --dx: -12cqi;
      --dy: -22cqi;
      --tilt: -3deg;
    }

    &.is-top {
      --sx: 46cqi;
      --sy: 38cqi;
      --sr: 6deg;
      --dx: 4cqi;
      --dy: 6cqi;
      --tilt: 2deg;

      width: clamp(var(--ni-120), 36%, var(--ni-220));
      z-index: 1;
    }

    &.is-empty {
      opacity: 0;
      pointer-events: none;
      transition: opacity var(--transition-increment) ease;
    }

    :global(.is-moving) & {
      will-change: transform;
    }

    :global(.is-scroll-driven) & {
      animation:
        poster-deal linear both,
        float 7s ease-in-out infinite alternate;
      animation-duration: auto, 7s;
      animation-delay: 0s, calc(var(--index) * -1.3s);
      animation-timeline: --month-review-hero, auto;
      animation-range:
        exit-crossing 0 exit-crossing var(--ni-380),
        normal;
    }
  }

  @keyframes poster-deal {
    from {
      transform: translate(-50%, -50%)
        translate(
          calc(var(--rtl-sign) * (var(--sx) * var(--spread) + var(--shift))),
          calc(var(--sy) * var(--spread))
        )
        rotate(calc(var(--rtl-sign) * var(--sr))) scale(1.15);
    }

    to {
      transform: translate(-50%, -50%)
        translate(calc(var(--rtl-sign) * var(--dx)), var(--dy))
        rotate(calc(var(--rtl-sign) * var(--tilt))) scale(1);
    }
  }

  .card {
    height: 100%;
    border-radius: var(--border-radius-m);
    overflow: hidden;
    background: color-mix(in srgb, var(--color-border) 80%, transparent);
    box-shadow: var(--shadow-floating);

    :global(.trakt-link) {
      display: block;
      height: 100%;
      background: var(--color-month-review-tile);
      animation: deal-in 900ms cubic-bezier(0.16, 1, 0.3, 1) backwards;
      animation-delay: calc(var(--index) * 70ms);
    }

    &:has(:focus-visible) {
      outline: var(--ni-2) solid var(--color-month-review-accent);
      outline-offset: var(--ni-2);
    }

    .is-placeholder & {
      box-shadow: none;
      animation: pulse calc(5 * var(--transition-increment)) ease-in-out
        infinite alternate;

      :global(.trakt-link) {
        opacity: 0;
        animation: none;
      }
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  @include for-mouse {
    .poster {
      transition:
        filter 300ms ease,
        opacity var(--transition-increment) ease;

      &:not(.is-placeholder):hover {
        z-index: 3;
      }
    }

    .card {
      transition:
        scale 400ms cubic-bezier(0.16, 1, 0.3, 1),
        rotate 400ms cubic-bezier(0.16, 1, 0.3, 1),
        box-shadow 300ms ease;

      .poster:not(.is-placeholder):hover & {
        scale: 1.08;
        rotate: calc(-1 * var(--rtl-sign) * var(--tilt));
        box-shadow: var(--shadow-raised);
      }
    }

    .trakt-month-review-poster-deck:has(.poster:not(.is-placeholder):hover)
      .poster:not(:hover):not(.is-placeholder) {
      filter: saturate(0.5) brightness(0.8);
    }
  }

  .poster .tag {
    position: absolute;
    top: var(--gap-s);
    inset-inline-start: var(--gap-s);
    padding: var(--ni-2) var(--ni-8);
    border-radius: var(--border-radius-pill);
    background: var(--color-month-review-accent);
    color: var(--shade-10);
    font-size: var(--font-size-tag);
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  @keyframes deal-in {
    from {
      opacity: 0;
    }
  }

  @keyframes float {
    from {
      translate: 0 -5px;
    }

    to {
      translate: 0 5px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .poster,
    .card,
    .card :global(.trakt-link) {
      animation: none;
      transition: none;
    }
  }
</style>
