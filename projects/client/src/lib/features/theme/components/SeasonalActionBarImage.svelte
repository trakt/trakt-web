<script lang="ts">
  import { useSeasonalTheme } from "../useSeasonalTheme";

  const { activeTheme, actionBarImageSrc } = useSeasonalTheme();
</script>

{#if $activeTheme && $actionBarImageSrc}
  <img
    src={$actionBarImageSrc}
    alt={`${$activeTheme} seasonal action bar image`}
    class={`trakt-seasonal-image theme-${$activeTheme}`}
  />
{/if}

<style>
  .trakt-seasonal-image {
    --image-size: var(--ni-40);

    width: var(--image-size);
    height: var(--image-size);
    object-fit: contain;

    z-index: var(--layer-background);

    position: absolute;

    &:global(.theme-halloween) {
      top: calc(-0.5 * var(--image-size));
      right: calc(0.5 * var(--image-size));
      animation: lift-and-swing 5s infinite;
    }

    &:global(.theme-christmas) {
      z-index: 1;

      top: calc(-0.5 * var(--image-size));
      right: calc(-0.35 * var(--image-size));

      transform: rotate(15deg);
    }
  }
</style>
