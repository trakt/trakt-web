<script lang="ts">
  import CheckIcon from "$lib/components/icons/CheckIcon.svelte";
  import SwapIcon from "$lib/components/icons/SwapIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import MixtapeMatchTag from "./MixtapeMatchTag.svelte";
  import type { MixtapeStageCardProps } from "./MixtapeStageCardProps.ts";

  const {
    slot,
    offset,
    isSelected,
    isSwapping,
    isKept,
    canSwap,
    onSelect,
    onSwap,
  }: MixtapeStageCardProps = $props();

  const isAside = $derived(Math.abs(offset) > 1);
</script>

<div
  class="trakt-mixtape-stage-card"
  class:is-selected={isSelected}
  class:is-swapping={isSwapping}
  class:is-aside={isAside}
  style:--card-offset={offset}
>
  <button
    type="button"
    class="card-select"
    aria-label={slot.media.title}
    aria-pressed={isSelected}
    tabindex={isAside ? -1 : undefined}
    onclick={onSelect}
  >
    <span class="card-art">
      <CrossOriginImage
        src={slot.media.poster.url.medium}
        alt={m.image_alt_media_poster({ title: slot.media.title })}
      />
    </span>
    <span class="card-shade" aria-hidden="true"></span>
    <span class="card-match">
      <MixtapeMatchTag match={slot.match} />
    </span>
    {#if isKept}
      <span class="card-kept">
        <CheckIcon />
        <span class="visually-hidden">{m.tag_mixtape_kept()}</span>
      </span>
    {/if}
  </button>
  {#if canSwap && isSelected && !isKept}
    <button
      type="button"
      class="card-swap"
      title={m.button_text_mixtape_show_another()}
      aria-label={m.button_label_mixtape_show_another_for({
        title: slot.media.title,
      })}
      onclick={onSwap}
    >
      <SwapIcon />
    </button>
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-mixtape-stage-card {
    --card-offset: 0;
    --card-scale: 0.8;
    --card-shift: calc(
      var(--rtl-sign, 1) * var(--card-offset) * var(--stage-card-step)
    );
    --card-tilt: calc(
      var(--rtl-sign, 1) * var(--card-offset) * var(--stage-card-tilt)
    );

    position: absolute;
    inset-block-start: 0;
    inset-inline-start: 50%;
    z-index: var(--layer-base);

    width: var(--width-mixtape-stage-card);
    aspect-ratio: 2 / 3;
    margin-inline-start: calc(var(--width-mixtape-stage-card) / -2);

    transform: translateX(var(--card-shift)) scale(var(--card-scale))
      rotate(var(--card-tilt));
    transition:
      transform calc(3.5 * var(--transition-increment))
        cubic-bezier(0.2, 0.8, 0.2, 1),
      opacity calc(2 * var(--transition-increment)) ease-in-out;

    &.is-selected {
      --card-scale: 1;

      z-index: var(--layer-raised);
    }

    &.is-aside {
      opacity: 0;
      pointer-events: none;
    }

    .visually-hidden {
      @include visually-hidden;
    }
  }

  .card-select {
    all: unset;
    position: absolute;
    inset: 0;
    display: block;
    overflow: hidden;

    border-radius: var(
      --border-radius-mixtape-stage-card,
      var(--border-radius-xl)
    );
    box-shadow: var(--shadow-base);
    cursor: pointer;

    transition: box-shadow calc(2 * var(--transition-increment)) ease-in-out;

    .is-selected & {
      box-shadow:
        0 0 0 var(--border-thickness-xs) var(--color-foreground),
        var(--shadow-floating);
      cursor: default;
    }

    &:focus-visible {
      outline: var(--border-thickness-s) solid var(--purple-300);
      outline-offset: var(--ni-4);
    }
  }

  .card-art {
    position: absolute;
    inset: 0;

    background: var(--color-card-background);
    filter: brightness(0.45);

    transition:
      filter calc(2.4 * var(--transition-increment)) ease-in-out,
      transform 180ms ease-in,
      opacity 180ms ease-in;

    :global(img) {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .is-selected & {
      filter: none;
    }

    .is-swapping & {
      transform: rotateY(90deg);
      opacity: 0.2;
    }

    @include for-mouse {
      .trakt-mixtape-stage-card:not(.is-selected):hover & {
        filter: brightness(0.7);
      }
    }
  }

  .card-shade {
    position: absolute;
    inset-inline: 0;
    inset-block-end: 0;
    height: 30%;

    background: linear-gradient(
      180deg,
      transparent,
      color-mix(in srgb, var(--shade-940) 70%, transparent)
    );
    pointer-events: none;
  }

  .card-match {
    position: absolute;
    inset-block-end: var(--ni-14);
    inset-inline-start: var(--ni-14);
  }

  .card-kept {
    position: absolute;
    inset-block-start: var(--ni-14);
    inset-inline-end: var(--ni-14);

    display: grid;
    place-items: center;
    width: var(--ni-32);
    height: var(--ni-32);

    border-radius: 50%;
    background: var(--color-foreground);
    color: var(--color-background);

    animation: stage-card-pop-in calc(3 * var(--transition-increment))
      cubic-bezier(0.34, 1.56, 0.64, 1) both;

    :global(svg) {
      width: var(--ni-14);
      height: var(--ni-14);
    }
  }

  .card-swap {
    all: unset;
    position: absolute;
    inset-block-start: var(--ni-12);
    inset-inline-end: var(--ni-12);
    z-index: var(--layer-raised);

    display: grid;
    place-items: center;
    width: var(--ni-36);
    height: var(--ni-36);

    border-radius: 50%;
    background: color-mix(in srgb, var(--shade-940) 55%, transparent);
    backdrop-filter: blur(var(--ni-6));
    color: var(--shade-10);
    cursor: pointer;

    animation: stage-card-pop-in calc(2 * var(--transition-increment)) ease-out
      both;

    :global(svg) {
      width: var(--ni-16);
      height: var(--ni-16);
    }

    @include for-mouse {
      &:hover {
        background: var(--shade-940);
      }
    }

    &:focus-visible {
      outline: var(--border-thickness-xs) solid var(--purple-300);
      outline-offset: var(--ni-2);
    }
  }

  @keyframes stage-card-pop-in {
    from {
      opacity: 0;
      transform: scale(0.4);
    }
  }
</style>
