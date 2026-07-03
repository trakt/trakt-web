<script lang="ts">
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import { useCover } from "./_internal/useCover";

  const { cover } = useCover();

  // Narrow once so the {#if} guard and the reads below share a single
  // reactive source. Reading $cover.data.src separately from the state guard
  // let the image's onerror re-run the src getter mid-transition, when data
  // is undefined.
  const coverData = $derived($cover.state === "ready" ? $cover.data : undefined);
</script>

{#if coverData}
  <div
    class="trakt-background-cover-image"
    data-cover-type={coverData?.type}
    style:--trakt-cover-primary-color={coverData?.colors?.at(0)}
    style:--trakt-cover-secondary-color={coverData?.colors?.at(1)}
  >
    <CrossOriginImage
      loading="eager"
      src={coverData?.src}
      alt={`Background for ${coverData?.type}`}
    />
  </div>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-background-cover-image {
    z-index: var(--layer-background);
    position: absolute;
    max-height: 100dvh;
    overflow: hidden;

    width: 100%;
    background: var(--shade-900);

    opacity: 0.25;

    @include color-mix-variable-with-fallback(
      --trakt-cover-primary-color-transparent,
      color-mix(
        in srgb,
        color-mix(
            in srgb,
            var(--color-background) 25%,
            var(--trakt-cover-primary-color)
          )
          50%,
        transparent
      ),
      color-mix(in srgb, var(--color-background) 25%, transparent)
    );

    &[data-cover-type="main"] {
      --color-transparent-background: transparent;

      :global(img) {
        filter: grayscale(1);
      }
    }

    :global(img) {
      width: 100%;
      height: 100%;
      inset-inline-start: 0;
      position: relative;

      filter: grayscale(0.5);

      transition: var(--transition-increment) ease-in-out;
      transition-property: filter, opacity;

      @include for-tablet-sm-and-below {
        width: 150%;
        inset-inline-start: -25%;
        object-fit: cover;
      }

      @include for-mobile {
        width: 220%;
        inset-inline-start: -60%;
      }
    }
  }

  .trakt-background-cover-image {
    top: 0;
    inset-inline-start: 0;

    &::after,
    &::before {
      content: "";
      width: 100%;
      height: 100%;
      position: absolute;
      bottom: 0;
      inset-inline-start: 0;
      pointer-events: none;
      z-index: var(--layer-floating);
    }

    &::after {
      background: linear-gradient(
        180deg,
        var(--trakt-cover-primary-color-transparent) 0%,
        var(--trakt-cover-primary-color-transparent) 50%,
        transparent 80%
      );

      pointer-events: none;

      @include for-mobile {
        background: linear-gradient(
          180deg,
          var(--trakt-cover-primary-color-transparent) 0%,
          var(--trakt-cover-primary-color-transparent) 50%,
          transparent 100%
        );
      }
    }

    &::before {
      background: linear-gradient(
        180deg,
        transparent 0%,
        color-mix(in srgb, var(--color-background) 90%, transparent) 90%,
        var(--color-background) 100%
      );

      @include for-tablet-sm-and-below {
        background: linear-gradient(
          180deg,
          transparent 0%,
          color-mix(in srgb, var(--color-background) 95%, transparent) 65%,
          var(--color-background) 100%
        );
      }
    }

    &:not([data-cover-type="main"]) {
      :global(img) {
        @include for-tablet-sm-and-below {
          filter: none;
        }
      }

      &::after {
        backdrop-filter: blur(var(--ni-2));
      }
    }
  }
</style>
