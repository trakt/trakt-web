<script lang="ts">
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import { useCover } from "./_internal/useCover";

  const { cover } = useCover();
</script>

{#if $cover.state === "ready"}
  <div class="trakt-cover-image" data-cover-type={$cover.data.type}>
    <div class="trakt-cover-image-overlay">
      <CrossOriginImage src={$cover.data.src} alt={`Background for footer`} />
    </div>
  </div>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-cover-image {
    --max-image-height: var(--ni-300);

    width: calc(100dvw - 2 * var(--layout-distance-side));
    height: var(--max-image-height);
    overflow: hidden;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: flex-end;

    .trakt-cover-image-overlay {
      display: flex;
      mask-repeat: no-repeat;
      mask-image: url("$lib/components/background/assets/text_logo.svg");
      mask-size: 100% auto;
      mask-position: top center;
      position: relative;

      &::after {
        content: "";
        width: 100%;
        height: 100%;

        opacity: 0.8;
        position: absolute;
        bottom: 0;
        left: 0;

        background: linear-gradient(
          180deg,
          color-mix(in srgb, var(--color-background) 48%, transparent) 0%,
          color-mix(in srgb, var(--color-background) 50%, transparent) 13%,
          color-mix(in srgb, var(--color-background) 57%, transparent) 25%,
          color-mix(in srgb, var(--color-background) 62%, transparent) 34%,
          color-mix(in srgb, var(--color-background) 70%, transparent) 46%,
          color-mix(in srgb, var(--color-background) 80%, transparent) 64%,
          color-mix(in srgb, var(--color-background) 95%, transparent) 85%,
          color-mix(in srgb, var(--color-background), transparent) 100%
        );

        pointer-events: none;
      }
    }

    :global(img) {
      width: 100%;
      max-height: var(--max-image-height);
      object-fit: cover;
      object-position: top;

      aspect-ratio: 4.4;
    }

    @include for-tablet-sm-and-below {
      --max-image-height: var(--ni-120);
      position: absolute;
      bottom: 0;
    }

    @include for-mobile {
      opacity: 0.6;

      .trakt-cover-image-overlay {
        mask-position: bottom center;
      }

      :global(img) {
        aspect-ratio: 2.75;
      }
    }
  }
</style>
