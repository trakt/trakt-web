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
    top: calc(-0.5 * var(--image-size));
    right: calc(0.5 * var(--image-size));

    &:global(.theme-halloween) {
      animation: lift-and-swing 5s infinite;
    }
  }
</style>
