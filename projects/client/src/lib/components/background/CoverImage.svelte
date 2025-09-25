<script lang="ts">
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
  import { useCover } from "./_internal/useCover";

  const { cover } = useCover();
</script>

{#snippet coverImage(hasClearMobileImage: boolean)}
  {#if $cover.state === "ready"}
    <div
      class="trakt-background-cover-image"
      class:has-clear-mobile-image={hasClearMobileImage}
      data-cover-type={$cover.data.type}
      style:--trakt-cover-primary-color={$cover.data.colors?.at(0)}
      style:--trakt-cover-secondary-color={$cover.data.colors?.at(1)}
    >
      <CrossOriginImage
        loading="eager"
        src={$cover.data.src}
        alt={`Background for ${$cover.data.type}`}
      />
    </div>
  {/if}
{/snippet}

<RenderForFeature flag={FeatureFlag.SummaryV2}>
  {#snippet enabled()}
    {@render coverImage(false)}
  {/snippet}

  {@render coverImage(true)}
</RenderForFeature>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-background-cover-image {
    z-index: var(--layer-background);
    position: absolute;
    max-height: 100dvh;
    overflow: hidden;

    width: 100%;
    background: var(--shade-900);

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
      var(--cm-background-25)
    );

    &[data-cover-type="main"] {
      --color-transparent-background: transparent;

      opacity: 0.5;

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
      transition-property: filter, opacity, width, left;

      @include for-tablet-sm-and-below {
        width: 150%;
        left: -25%;
        object-fit: cover;
      }

      @include for-mobile {
        width: 220%;
        left: -60%;
      }
    }
  }

  .trakt-background-cover-image {
    top: 0;
    left: 0;

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

      @include for-mobile {
        background: linear-gradient(
          180deg,
          var(--trakt-cover-primary-color-transparent) 0%,
          var(--trakt-cover-primary-color-transparent) 75%,
          transparent 100%
        );
      }

      pointer-events: none;
    }

    &::before {
      background: linear-gradient(
        180deg,
        transparent 0%,
        var(--cm-background-95) 65%,
        var(--color-background) 100%
      );
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

  .trakt-background-cover-image.has-clear-mobile-image {
    &::after {
      @include for-tablet-sm-and-below {
        background: linear-gradient(
          180deg,
          var(--cm-background-15) 0%,
          var(--cm-background-50) 30%,
          var(--color-background) 100%
        );
      }
    }

    &:not([data-cover-type="main"]) {
      &::after {
        @include for-tablet-sm-and-below {
          backdrop-filter: unset;

          background: linear-gradient(
            180deg,
            var(--color-background) 0%,
            var(--cm-background-48) 10%,
            transparent 25%,
            var(--cm-background-25) 45%,
            var(--cm-background-88) 60%,
            var(--color-background) 90%
          );
        }
      }

      &::before {
        @include for-tablet-sm-and-below {
          background: none;
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
