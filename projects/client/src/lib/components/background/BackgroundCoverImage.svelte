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
  :global([data-theme="light"]) {
    .background-cover-image {
      &.image-loaded {
        :global(img) {
          opacity: 0.85;
        }
      }
    }
  }

  :global([data-theme="dark"]) {
    .background-cover-image {
      &.image-loaded {
        :global(img) {
          opacity: 0.32;
        }
      }
    }
  }
  .background-cover-image {
    z-index: -1;
    position: absolute;

    top: 0;
    left: 0;
    width: 100%;

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
      height: 50%;

      position: absolute;
      bottom: 0;
      left: 0;

      background: linear-gradient(
        to bottom,
        transparent 0%,
        color-mix(in srgb, var(--color-background) 50%, transparent 50%) 30%,
        var(--color-background) 70%
      );

      pointer-events: none;
    }
  }
</style>
