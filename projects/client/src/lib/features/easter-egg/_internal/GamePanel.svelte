<script lang="ts">
  import * as m from "$lib/features/i18n/messages";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import { toTranslatedType } from "$lib/utils/formatting/string/toTranslatedType";
  import type { GamePanelProps } from "./GamePanelProps.ts";
  import RollingNumber from "./RollingNumber.svelte";
  import { toGameRating } from "./toGameRating.ts";

  const {
    title,
    role,
    guess,
    result,
    leaning,
    entranceIndex,
    onguess,
  }: GamePanelProps = $props();

  const isRatingRevealed = $derived(
    role === "known" || role === "leaving" || guess !== null,
  );
  const isGuessable = $derived(role === "mystery" && guess === null);
  const kind = $derived(
    [toTranslatedType(title.type), title.year].filter(Boolean).join(" · "),
  );
</script>

<div
  class="trakt-game-panel"
  data-role={role}
  data-result={result ?? undefined}
  data-leaning={leaning ?? undefined}
  style:--panel-entrance-index={entranceIndex}
>
  <div class="panel-backdrop">
    <CrossOriginImage
      src={title.poster}
      alt=""
      loading="eager"
      animate={false}
    />
  </div>

  <div class="panel-content">
    <div class="panel-poster">
      <CrossOriginImage src={title.poster} alt="" loading="eager" />
    </div>

    <div class="panel-meta">
      <span class="panel-kind">{kind}</span>
      <span class="panel-title">{title.title}</span>
      <span class="panel-score" aria-hidden="true">
        <RollingNumber value={title.rating} isRevealed={isRatingRevealed} />
      </span>
      {#if isRatingRevealed}
        <span class="panel-rating-label">
          {toGameRating(title)}
        </span>
      {/if}

    </div>
    <div class="panel-choices">
      <button
        class="panel-choice"
        data-guess="higher"
        class:is-picked={guess === "higher"}
        class:is-dimmed={guess === "lower"}
        disabled={!isGuessable}
        onclick={() => onguess("higher")}
      >
        <span class="panel-choice-icon" aria-hidden="true">▲</span>
        {m.button_text_game_higher()}
      </button>
      <button
        class="panel-choice"
        data-guess="lower"
        class:is-picked={guess === "lower"}
        class:is-dimmed={guess === "higher"}
        disabled={!isGuessable}
        onclick={() => onguess("lower")}
      >
        <span class="panel-choice-icon" aria-hidden="true">▼</span>
        {m.button_text_game_lower()}
      </button>
    </div>
  </div>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  @mixin leaning-choice($color, $direction) {
    background: color-mix(in oklch, #{$color} 22%, transparent);
    box-shadow:
      0 0 0 var(--ni-1) #{$color},
      0 var(--ni-12) var(--ni-32) calc(var(--ni-10) * -1) #{$color};
    transform: translateY(calc(var(--ni-2) * #{$direction}));
  }

  @mixin leaning-poster($color, $direction) {
    --panel-lean: calc(5% * #{$direction});
    box-shadow:
      0 0 0 var(--ni-2) #{$color},
      0 var(--ni-24) var(--ni-64) calc(var(--ni-12) * -1) #{$color};
  }

  @keyframes panel-rise {
    from {
      opacity: 0;
      transform: translateY(var(--ni-32));
    }
    to {
      opacity: 1;
      transform: none;
    }
  }

  .trakt-game-panel {
    --panel-swing: rotateY(calc(var(--rtl-sign) * -50deg));

    position: relative;
    display: grid;
    place-items: center;
    overflow: clip;

    @include for-tablet-sm-and-below {
      --panel-swing: rotateX(45deg);
    }

    &:not(:first-child)::before {
      content: "";
      position: absolute;
      z-index: var(--layer-raised);
      inset-block: 0;
      inset-inline-start: 0;
      width: var(--ni-1);
      background: linear-gradient(
        transparent,
        var(--game-glass-line),
        transparent
      );

      @include for-tablet-sm-and-below {
        inset-inline: 0;
        inset-block: 0 auto;
        width: auto;
        height: var(--ni-1);
        background: linear-gradient(
          90deg,
          transparent,
          var(--game-glass-line),
          transparent
        );
      }
    }

    .panel-backdrop {
      position: absolute;
      inset: -15%;

      :global(img) {
        width: 100%;
        height: 100%;
        object-fit: cover;
        filter: blur(var(--ni-40)) saturate(1.5) brightness(0.55);
        transition: filter 0.8s var(--game-ease-out);
      }

      &::after {
        content: "";
        position: absolute;
        inset: 0;
        background:
          radial-gradient(
            110% 85% at 50% 45%,
            transparent 25%,
            color-mix(in oklch, var(--game-void) 80%, transparent)
          ),
          linear-gradient(
            transparent 55%,
            color-mix(in oklch, var(--game-void) 55%, transparent)
          );
      }
    }

    .panel-content {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--ni-20);
      padding-block-start: var(--ni-48);
      text-align: center;

      transition:
        opacity var(--game-advance-duration) var(--game-ease-in-out),
        transform var(--game-advance-duration) var(--game-ease-in-out),
        filter var(--game-advance-duration) var(--game-ease-in-out);

      @include for-tablet-lg-and-below {
        display: grid;
        grid-template-columns: auto minmax(0, 1fr);
        align-items: center;
        gap: var(--ni-16) var(--ni-20);
        justify-self: stretch;
        padding-block-start: var(--ni-48);
        padding-inline: var(--ni-24);
        text-align: start;
      }

      @include for-tablet-sm-and-below {
        row-gap: var(--ni-12);
        padding-block-start: 0;
      }
    }

    .panel-poster {
      flex: none;
      width: clamp(var(--ni-104), 13vw, var(--ni-220));
      aspect-ratio: 2 / 3;
      overflow: hidden;
      border-radius: var(--border-radius-m);

      box-shadow:
        0 var(--ni-24) var(--ni-48) calc(var(--ni-12) * -1)
          color-mix(in oklch, var(--game-void) 75%, transparent),
        0 0 0 var(--ni-1) var(--game-glass-line);

      transform: perspective(var(--ni-920))
        rotateX(var(--game-tilt-y, 0deg)) rotateY(var(--game-tilt-x, 0deg))
        translateY(var(--panel-lean, 0%));
      transition:
        transform 0.7s var(--game-ease-out),
        box-shadow 0.4s ease-out,
        opacity 0.7s var(--game-ease-out);

      @include for-tablet-lg-and-below {
        width: min(30vw, 18dvh, var(--ni-160));
      }

      @include for-tablet-sm-and-below {
        width: min(30vw, 14dvh, var(--ni-160));
      }

      :global(img) {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: filter 0.8s var(--game-ease-out);
      }
    }

    .panel-meta {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--ni-8);
      min-width: 0;

      @include for-tablet-lg-and-below {
        align-items: flex-start;
      }
    }

    .panel-kind {
      font-family: var(--game-font-mono);
      font-size: var(--font-size-tag);
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--game-muted);
    }

    .panel-title {
      max-width: 32ch;
      font-size: clamp(var(--ni-18), 2vw, var(--ni-32));
      font-weight: 700;
      line-height: 1.1;
      overflow-wrap: anywhere;

      @include for-tablet-lg-and-below {
        font-size: clamp(var(--ni-16), 2.4dvh, var(--ni-20));
      }
    }

    .panel-score {
      font-family: var(--game-font-display);
      font-weight: 900;
      font-size: clamp(var(--ni-56), 7vw, var(--ni-104));
      line-height: 0.9;
      transition:
        color var(--transition-duration-short) ease-out,
        text-shadow var(--transition-duration-short) ease-out;

      @include for-tablet-lg-and-below {
        font-size: clamp(var(--ni-40), 7dvh, var(--ni-56));
      }
    }

    .panel-rating-label {
      @include visually-hidden;
    }

    .panel-choices {
      display: flex;
      gap: var(--ni-10);

      transition: opacity var(--transition-duration-short) ease-out;

      @include for-tablet-lg-and-below {
        grid-column: 1 / -1;

        .panel-choice {
          flex: 1;
          justify-content: center;
        }
      }
    }

    .panel-choice {
      all: unset;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;

      display: inline-flex;
      align-items: center;
      gap: var(--ni-10);
      padding-block: var(--ni-10);
      padding-inline: var(--ni-10) var(--ni-20);
      border-radius: var(--border-radius-xxl);

      background: var(--game-glass);
      border: var(--ni-1) solid var(--game-glass-line);
      backdrop-filter: blur(var(--ni-12));

      font-size: var(--font-size-text);
      font-weight: 700;
      letter-spacing: 0.02em;
      white-space: nowrap;

      transition:
        background var(--transition-increment) ease-out,
        box-shadow var(--transition-increment) ease-out,
        opacity var(--transition-duration-short) ease-out,
        transform 0.35s var(--game-ease-spring);

      &:focus-visible {
        outline: var(--border-thickness-xs) solid var(--game-purple);
        outline-offset: var(--ni-2);
      }

      &:disabled {
        cursor: default;
      }

      &:active:not(:disabled) {
        transform: scale(0.94);
      }

      &.is-picked {
        transform: scale(1.08);
      }

      &.is-dimmed {
        opacity: 0.2;
        transform: scale(0.92);
      }
    }

    .panel-choice-icon {
      display: grid;
      place-items: center;
      width: var(--ni-24);
      height: var(--ni-24);
      border-radius: 50%;
      font-size: var(--font-size-tag);
    }

    .panel-choice[data-guess="higher"] {
      .panel-choice-icon {
        background: var(--game-green);
        color: var(--game-void);
      }

      &.is-picked {
        background: var(--game-green);
        color: var(--game-void);

        .panel-choice-icon {
          background: var(--game-void);
          color: var(--game-foreground);
        }
      }
    }

    .panel-choice[data-guess="lower"] {
      .panel-choice-icon {
        background: var(--game-red);
      }

      &.is-picked {
        background: var(--game-red);

        .panel-choice-icon {
          background: var(--game-void);
        }
      }
    }

    @include for-mouse {
      .panel-choice[data-guess="higher"]:hover:not(:disabled) {
        @include leaning-choice(var(--game-green), -1);
      }

      .panel-choice[data-guess="lower"]:hover:not(:disabled) {
        @include leaning-choice(var(--game-red), 1);
      }

      &:has(.panel-choice[data-guess="higher"]:hover:not(:disabled))
        .panel-poster {
        @include leaning-poster(var(--game-green), -1);
      }

      &:has(.panel-choice[data-guess="lower"]:hover:not(:disabled))
        .panel-poster {
        @include leaning-poster(var(--game-red), 1);
      }
    }

    &[data-leaning="higher"] {
      .panel-choice[data-guess="higher"] {
        @include leaning-choice(var(--game-green), -1);
      }

      .panel-poster {
        @include leaning-poster(var(--game-green), -1);
      }
    }

    &[data-leaning="lower"] {
      .panel-choice[data-guess="lower"] {
        @include leaning-choice(var(--game-red), 1);
      }

      .panel-poster {
        @include leaning-poster(var(--game-red), 1);
      }
    }

    &[data-role="known"] .panel-choices,
    &[data-role="leaving"] .panel-choices {
      opacity: 0;
      pointer-events: none;
    }

    &[data-role="upcoming"] .panel-poster {
      opacity: 0.2;
      transform: perspective(var(--ni-920)) var(--panel-swing)
        scale(0.75);
    }

    &[data-role="upcoming"] .panel-meta > *,
    &[data-role="upcoming"] .panel-choices {
      opacity: 0;
      transform: translateY(var(--ni-24));
    }

    &[data-role="mystery"] .panel-meta > *,
    &[data-role="mystery"] .panel-choices {
      transition:
        opacity 0.7s var(--game-ease-out) 0.4s,
        transform 0.7s var(--game-ease-out) 0.4s;
    }

    &[data-role="leaving"] .panel-content {
      opacity: 0;
      transform: scale(0.78);
      filter: blur(var(--ni-8));
    }

    &[data-result="hit"] {
      .panel-backdrop :global(img) {
        filter: blur(var(--ni-40)) saturate(1.9) brightness(0.75);
      }

      .panel-poster {
        box-shadow:
          0 0 0 var(--ni-2) var(--game-green),
          0 0 var(--ni-64) calc(var(--ni-8) * -1) var(--game-green);
      }

      .panel-score {
        color: var(--game-green);
        text-shadow: 0 0 0.35em
          color-mix(in oklch, var(--game-green) 60%, transparent);
      }
    }

    &[data-result="miss"] {
      .panel-backdrop :global(img) {
        filter: blur(var(--ni-40)) grayscale(1) brightness(0.3);
      }

      .panel-poster :global(img) {
        filter: grayscale(1) brightness(0.6);
      }

      .panel-score {
        color: var(--game-red);
        text-shadow: 0 0 0.35em
          color-mix(in oklch, var(--game-red) 60%, transparent);
      }
    }

    :global(.trakt-rated-higher:not(.is-revealed)) & .panel-content {
      opacity: 0;
    }

    :global(.trakt-rated-higher.is-revealed) & .panel-poster,
    :global(.trakt-rated-higher.is-revealed) & .panel-meta,
    :global(.trakt-rated-higher.is-revealed) &[data-role="mystery"] .panel-choices {
      animation: panel-rise 0.9s var(--game-ease-out) backwards;
      animation-delay: calc(0.4s + var(--panel-entrance-index) * 0.14s);
    }

    @media (prefers-reduced-motion: reduce) {
      .panel-content,
      .panel-poster,
      .panel-meta > *,
      .panel-choices,
      .panel-choice,
      &[data-role="mystery"] .panel-meta > *,
      &[data-role="mystery"] .panel-choices {
        transition: none;
      }

      :global(.trakt-rated-higher.is-revealed) & .panel-poster,
      :global(.trakt-rated-higher.is-revealed) & .panel-meta,
      :global(.trakt-rated-higher.is-revealed)
        &[data-role="mystery"]
        .panel-choices {
        animation: none;
      }
    }
  }
</style>
