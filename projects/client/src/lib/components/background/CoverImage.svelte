<script lang="ts">
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import { useCover } from "./_internal/useCover";

  const { cover, state } = useCover();
</script>

{#if $state === "ready"}
  <div
    class="trakt-background-cover-image"
    data-cover-type={$cover.type}
    style:--trakt-cover-primary-color={$cover.colors?.at(0)}
    style:--trakt-cover-secondary-color={$cover.colors?.at(1)}
  >
    <CrossOriginImage
      loading="eager"
      src={$cover.src}
      alt={`Background for ${$cover.type}`}
    />
  </div>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-background-cover-image {
    --color-transparent-background: color-mix(
      in srgb,
      var(--color-background) 35%,
      transparent
    );

    z-index: var(--layer-background);
    position: absolute;
    max-height: 100dvh;
    overflow: hidden;

    top: 0;
    left: 0;
    width: 100%;
    background: var(--shade-900);
    z-index: var(--layer-background);

    &[data-cover-type="main"] {
      --color-transparent-background: transparent;

      :global(img) {
        filter: grayscale(1);

        @include for-tablet-sm-and-below {
          filter: grayscale(0);
        }
      }
    }

    :global(img) {
      width: 100%;
      height: 100%;
      left: 0;
      position: relative;

      filter: grayscale(0.25);

      transition: var(--transition-increment) ease-in-out;
      transition-property: opacity, width, left;

      @include for-tablet-sm-and-below {
        width: 150%;
        left: -25%;
        object-fit: cover;
      }

      @include for-mobile {
        width: 180%;
        left: -40%;
      }
    }

    &:not([data-cover-type="main"]) {
      &::after {
        backdrop-filter: blur(2px);

        @include for-tablet-sm-and-below {
          backdrop-filter: unset;
        }
      }
    }

    &::after {
      content: "";
      width: 100%;
      height: 100%;
      position: absolute;
      bottom: 0;
      left: 0;
      pointer-events: none;
      z-index: var(--layer-floating);
    }

    &::after {
      background: linear-gradient(
        180deg,
        color-mix(
            in srgb,
            var(--trakt-cover-primary-color) 64%,
            var(--color-transparent-background)
          )
          0%,
        color-mix(
            in srgb,
            var(--trakt-cover-primary-color) 67%,
            var(--color-transparent-background)
          )
          13%,
        color-mix(
            in srgb,
            var(--trakt-cover-primary-color) 70%,
            var(--color-transparent-background)
          )
          25%,
        color-mix(
            in srgb,
            var(--trakt-cover-primary-color) 74%,
            var(--color-transparent-background)
          )
          34%,
        color-mix(
            in srgb,
            var(--trakt-cover-primary-color) 79%,
            var(--color-transparent-background)
          )
          46%,
        var(--color-background) 100%
      );

      pointer-events: none;

      @include for-tablet-sm-and-below {
        background: linear-gradient(
          180deg,
          color-mix(in srgb, var(--color-background) 15%, transparent) 0%,
          var(--color-background) 100%
        );
      }
    }
  }
</style>
