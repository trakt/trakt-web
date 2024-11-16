<script lang="ts">
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";

  type ImageBackgroundProps = {
    src: string;
    type: "Main" | "Show" | "Movie";
  };

  const { src, type }: ImageBackgroundProps = $props();
  let isImageLoaded = $state(false);
</script>

<div class="background-cover-image" class:image-loaded={isImageLoaded}>
  <CrossOriginImage
    {src}
    alt={`${type} background`}
    onLoad={() => (isImageLoaded = true)}
  />
</div>

<style>
  .background-cover-image {
    z-index: -1;
    position: absolute;

    top: 0;
    left: 0;
    width: 100%;
    background: var(--shade-900);

    &.image-loaded {
      :global(img) {
        opacity: 1;
      }
    }

    :global(img) {
      width: 100%;
      height: 100%;
      position: relative;

      transition: opacity 250ms ease-in;
      opacity: 0;
    }

    &::after {
      content: "";
      width: 100%;
      height: 100%;

      position: absolute;
      bottom: 0;
      left: 0;

      background: linear-gradient(
        180deg,
        color-mix(in srgb, var(--color-background) 64%, transparent 36%) 0%,
        color-mix(in srgb, var(--color-background) 65%, transparent 35%) 5%,
        color-mix(in srgb, var(--color-background) 66%, transparent 34%) 9%,
        color-mix(in srgb, var(--color-background) 67%, transparent 33%) 13%,
        color-mix(in srgb, var(--color-background) 68%, transparent 32%) 17%,
        color-mix(in srgb, var(--color-background) 69%, transparent 31%) 20%,
        color-mix(in srgb, var(--color-background) 70%, transparent 30%) 25%,
        color-mix(in srgb, var(--color-background) 72%, transparent 28%) 29%,
        color-mix(in srgb, var(--color-background) 74%, transparent 26%) 34%,
        color-mix(in srgb, var(--color-background) 77%, transparent 23%) 40%,
        color-mix(in srgb, var(--color-background) 79%, transparent 21%) 46%,
        color-mix(in srgb, var(--color-background) 83%, transparent 17%) 55%,
        color-mix(in srgb, var(--color-background) 86%, transparent 14%) 64%,
        color-mix(in srgb, var(--color-background) 90%, transparent 10%) 74%,
        color-mix(in srgb, var(--color-background) 95%, transparent 5%) 85%,
        var(--color-background) 100%
      );

      pointer-events: none;
    }
  }
</style>
