<script lang="ts">
  import type { GifTileProps } from "./GifTileProps.ts";

  const { gif, isReducedMotion, onSelect }: GifTileProps = $props();

  // A wall of looping gifs is what reduced motion asks us not to do.
  const source = $derived(isReducedMotion && gif.still ? gif.still : gif.preview);
</script>

<button
  type="button"
  class="trakt-gif-tile"
  aria-label={gif.title}
  onclick={onSelect}
  style:--gif-tile-ratio="{gif.preview.width} / {gif.preview.height}"
  style:--gif-tile-image={gif.blurPreview
    ? `url(${gif.blurPreview})`
    : "none"}
>
  <img src={source.url} alt={gif.title} loading="lazy" decoding="async" />
</button>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-gif-tile {
    @include gif-tile-surface;

    display: block;
    width: 100%;
    aspect-ratio: var(--gif-tile-ratio);

    transition-property: transform, outline-color;

    &:hover,
    &:focus-visible {
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
