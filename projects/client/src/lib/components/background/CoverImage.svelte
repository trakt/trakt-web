<script lang="ts">
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { NAVBAR_CONFIG } from "$lib/sections/navbar/constants";
  import { useDimensionObserver } from "$lib/stores/css/useDimensionObserver";
  import { isPWA } from "$lib/utils/devices/isPWA";
  import { useCover } from "./_internal/useCover";

  const { cover, state } = useCover();
  const { observedDimension, observeDimension } =
    useDimensionObserver("height");

  const isPwaMode = isPWA();
</script>

{#snippet coverImages(isMirrored: boolean)}
  {#if isMirrored}
    <div
      class="trakt-background-cover-image-mirrored"
      data-cover-type={$cover.type}
      use:observeDimension
      style:--trakt-cover-primary-color={$cover.colors?.at(0)}
      style:--trakt-cover-secondary-color={$cover.colors?.at(1)}
      style:--trakt-cover-height={`${$observedDimension}px`}
    >
      <CrossOriginImage
        loading="eager"
        src={$cover.src}
        alt={`Background for ${$cover.type}`}
      />
    </div>
  {/if}
  <div
    class="trakt-background-cover-image"
    class:trakt-background-has-mirror={isMirrored}
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
{/snippet}

{#if $state === "ready"}
  <RenderFor audience="all" device={NAVBAR_CONFIG.top.device}>
    {@render coverImages(isPwaMode)}
  </RenderFor>
  <RenderFor audience="all" device={NAVBAR_CONFIG.side.device}>
    {@render coverImages(false)}
  </RenderFor>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-background-cover-image-mirrored,
  .trakt-background-cover-image {
    --trakt-cover-primary-color-transparent: color-mix(
      in srgb,
      color-mix(
          in srgb,
          var(--color-background) 25%,
          var(--trakt-cover-primary-color)
        )
        50%,
      transparent
    );
    z-index: var(--layer-background);
    position: absolute;
    max-height: 100dvh;
    overflow: hidden;

    width: 100%;
    background: var(--shade-900);

    &[data-cover-type="main"] {
      --color-transparent-background: transparent;

      :global(img) {
        filter: grayscale(1);
      }
    }

    :global(img) {
      width: 100%;
      height: 100%;
      left: 0;
      position: relative;

      filter: grayscale(0.5);

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
  }

  .trakt-background-has-mirror,
  .trakt-background-cover-image-mirrored {
    --trakt-cover-top: calc(var(--navbar-height) + env(safe-area-inset-top, 0));
  }

  .trakt-background-cover-image-mirrored {
    transform: scaleY(-1);
    top: calc(var(--trakt-cover-height) * -1 + var(--trakt-cover-top));
  }

  .trakt-background-cover-image {
    top: 0;
    left: 0;

    &.trakt-background-has-mirror {
      top: var(--trakt-cover-top);
    }

    &::after,
    &::before {
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
        var(--trakt-cover-primary-color-transparent) 0%,
        var(--trakt-cover-primary-color-transparent) 50%,
        transparent 80%
      );

      pointer-events: none;

      @include for-tablet-sm-and-below {
        background: linear-gradient(
          180deg,
          color-mix(in srgb, var(--color-background) 15%, transparent) 0%,
          color-mix(in srgb, var(--color-background) 50%, transparent) 30%,
          var(--color-background) 100%
        );
      }
    }

    &::before {
      background: linear-gradient(
        180deg,
        transparent 0%,
        color-mix(in srgb, var(--color-background) 95%, transparent) 65%,
        color-mix(in srgb, var(--color-background) 100%, transparent) 100%
      );
    }

    &:not([data-cover-type="main"]) {
      &::after {
        @include backdrop-filter-blur(var(--ni-2));

        @include for-tablet-sm-and-below {
          backdrop-filter: unset;
        }
      }
    }

    &[data-cover-type="main"] {
      &::before {
        @include for-mobile {
          background: none;
        }
      }
    }
  }
</style>
