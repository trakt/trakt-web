<script lang="ts">
  import BookmarkIcon from "$lib/components/icons/BookmarkIcon.svelte";
  import SwapIcon from "$lib/components/icons/SwapIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import { useIsWatchlisted } from "$lib/stores/useIsWatchlisted.ts";
  import MixtapeMatchTag from "./MixtapeMatchTag.svelte";
  import type { MixtapeFanPosterProps } from "./MixtapeFanPosterProps.ts";
  import { toMediaStoreProps } from "./toMediaStoreProps.ts";

  const {
    slot,
    place,
    isSelected,
    isSwapping,
    canSwap,
    onSelect,
    onSwap,
  }: MixtapeFanPosterProps = $props();

  const { isWatchlisted } = $derived(
    useIsWatchlisted(toMediaStoreProps(slot.media)),
  );
</script>

<div
  class="trakt-mixtape-fan-poster"
  data-place={place}
  class:is-selected={isSelected}
  class:is-swapping={isSwapping}
>
  <div class="poster-inner">
    <CrossOriginImage
      src={slot.media.poster.url.medium}
      alt={m.image_alt_media_poster({ title: slot.media.title })}
    />
    {#if $isWatchlisted}
      <span class="poster-kept">
        <BookmarkIcon state="added" />
        {m.tag_mixtape_on_watchlist()}
      </span>
    {/if}
    <div class="poster-match">
      <MixtapeMatchTag match={slot.match} />
    </div>
  </div>
  <button
    type="button"
    class="poster-select"
    aria-label={m.button_label_show_details()}
    aria-pressed={isSelected}
    onclick={onSelect}
  ></button>
  {#if canSwap}
    <button
      type="button"
      class="poster-swap"
      title={m.button_text_mixtape_show_another()}
      aria-label={m.button_label_mixtape_show_another_for({
        title: slot.media.title,
      })}
      onclick={onSwap}
    >
      <SwapIcon />
    </button>
  {/if}
  <span class="poster-tip small secondary">{slot.media.title}</span>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-mixtape-fan-poster {
    --fan-x: 0px;
    --fan-y: 0px;
    --fan-tilt: 0deg;
    --fan-scale: 1;

    position: absolute;
    inset-inline-start: 50%;
    inset-block-start: 50%;
    width: var(--width-mixtape-fan-poster);
    aspect-ratio: 2 / 3;
    margin-block-start: calc(var(--width-mixtape-fan-poster) * -0.75);
    margin-inline-start: calc(var(--width-mixtape-fan-poster) * -0.5);
    z-index: var(--layer-base);

    transform: translate(var(--fan-x), var(--fan-y)) rotate(var(--fan-tilt))
      scale(var(--fan-scale));
    filter: brightness(0.6) saturate(0.8);
    transition:
      transform 350ms cubic-bezier(0.2, 0.8, 0.2, 1),
      filter var(--transition-increment);

    &[data-place="start"] {
      --fan-x: calc(var(--width-mixtape-fan-poster) * -0.905);
      --fan-y: calc(var(--ni-24) + var(--ni-2));
      --fan-tilt: -9deg;
    }

    &[data-place="end"] {
      --fan-x: calc(var(--width-mixtape-fan-poster) * 0.905);
      --fan-y: calc(var(--ni-24) + var(--ni-2));
      --fan-tilt: 9deg;
    }

    &[data-place="center"] {
      z-index: var(--layer-raised);
    }

    &.is-selected {
      --fan-y: calc(var(--ni-18) * -1);
      --fan-tilt: 0deg;
      --fan-scale: 1.08;

      z-index: var(--layer-floating);
      filter: none;
    }

    @include for-mouse {
      &:hover {
        filter: none;
      }
    }
  }

  .poster-inner {
    position: absolute;
    inset: 0;
    overflow: hidden;

    border-radius: var(--border-radius-l);
    background: var(--color-card-background);
    box-shadow: var(--shadow-base);

    transition:
      transform 180ms ease-in,
      opacity 180ms ease-in;

    :global(img) {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &::after {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: inherit;
      box-shadow: inset 0 0 0 var(--border-thickness-s) var(--purple-400);
      opacity: 0;
    }

    .is-selected &::after {
      opacity: 1;
    }

    .is-swapping & {
      transform: rotateY(90deg);
      opacity: 0.2;
    }
  }

  .poster-kept {
    position: absolute;
    inset-block-start: var(--gap-s);
    inset-inline-start: var(--gap-s);

    display: flex;
    align-items: center;
    gap: var(--ni-4);
    padding: var(--ni-4) var(--ni-10);

    border-radius: var(--border-radius-xxl);
    background: var(--purple-500);
    color: var(--purple-50);
    font-size: var(--font-size-text-small);
    font-weight: 700;

    :global(svg) {
      width: var(--ni-14);
      height: var(--ni-14);
    }
  }

  .poster-match {
    position: absolute;
    inset-block-end: var(--gap-s);
    inset-inline-end: var(--gap-s);
  }

  .poster-select {
    all: unset;
    position: absolute;
    inset: 0;
    border-radius: var(--border-radius-l);
    cursor: pointer;

    &:focus-visible {
      outline: var(--border-thickness-s) solid var(--purple-300);
    }
  }

  .poster-swap {
    all: unset;
    position: absolute;
    inset-block-start: var(--gap-xs);
    inset-inline-end: var(--gap-xs);

    display: grid;
    place-items: center;
    width: var(--ni-32);
    height: var(--ni-32);

    border-radius: 50%;
    background: color-mix(in srgb, var(--shade-940) 65%, transparent);
    color: var(--shade-10);
    cursor: pointer;

    opacity: 0;
    pointer-events: none;
    transition: opacity var(--transition-increment);

    .is-selected &,
    &:focus-visible {
      opacity: 1;
      pointer-events: auto;
    }

    @include for-mouse {
      .trakt-mixtape-fan-poster:hover & {
        opacity: 1;
        pointer-events: auto;
      }

      &:hover {
        background: var(--shade-940);
      }
    }
  }

  .poster-tip {
    position: absolute;
    inset-block-start: calc(100% + var(--ni-14));
    inset-inline-start: 50%;
    transform: translateX(-50%);

    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transition: opacity var(--transition-increment);

    @include for-mouse {
      .trakt-mixtape-fan-poster:hover & {
        opacity: 1;
      }
    }
  }
</style>
