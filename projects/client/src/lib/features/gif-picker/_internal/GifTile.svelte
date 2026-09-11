<script lang="ts">
  import type { GifTileProps } from "./GifTileProps.ts";

  const { gif, isReducedMotion, onSelect }: GifTileProps = $props();

  // A wall of looping gifs is exactly what reduced motion asks us not to do,
  // so the frozen frame stands in wherever Klipy ships one.
  const source = $derived(isReducedMotion && gif.still ? gif.still : gif.preview);
</script>

<button
  type="button"
  class="trakt-gif-tile"
  aria-label={gif.title}
  onclick={onSelect}
  style:--gif-tile-ratio="{gif.preview.width} / {gif.preview.height}"
  style:--gif-tile-placeholder={gif.blurPreview
    ? `url(${gif.blurPreview})`
    : "none"}
>
  <img src={source.url} alt={gif.title} loading="lazy" decoding="async" />
</button>

<style lang="scss">
  .trakt-gif-tile {
    all: unset;

    display: block;
    width: 100%;
    aspect-ratio: var(--gif-tile-ratio);

    cursor: pointer;
    -webkit-tap-highlight-color: transparent;

    border-radius: var(--border-radius-s);
    overflow: hidden;

    background-color: var(--color-input-background);
    background-image: var(--gif-tile-placeholder);
    background-size: cover;
    background-position: center;

    outline: var(--border-thickness-xs) solid transparent;

    transition: var(--transition-increment) ease-in-out;
    transition-property: transform, outline-color;

    &:hover,
    &:focus-visible {
      outline-color: var(--color-link-active);
      transform: scale(1.02);
    }

    img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .trakt-gif-tile:hover,
    .trakt-gif-tile:focus-visible {
      transform: none;
    }
  }
</style>
