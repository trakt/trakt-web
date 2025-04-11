<script lang="ts">
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import { useCover } from "./_internal/useCover";

  const { cover, state } = useCover();
</script>

{#if $state === "ready"}
  <div class="background-cover-image">
    <CrossOriginImage
      loading="eager"
      src={$cover.src}
      alt={`Background for ${$cover.type}`}
    />
  </div>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .background-cover-image {
    z-index: var(--layer-background);
    position: absolute;
    max-height: 100dvh;
    overflow: hidden;

    top: 0;
    left: 0;
    width: 100%;
    background: var(--shade-900);

    :global(img) {
      width: 100%;
      height: 100%;
      left: 0;
      position: relative;

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
        color-mix(in srgb, var(--color-background) 67%, transparent 33%) 13%,
        color-mix(in srgb, var(--color-background) 70%, transparent 30%) 25%,
        color-mix(in srgb, var(--color-background) 74%, transparent 26%) 34%,
        color-mix(in srgb, var(--color-background) 79%, transparent 21%) 46%,
        color-mix(in srgb, var(--color-background) 86%, transparent 14%) 64%,
        color-mix(in srgb, var(--color-background) 95%, transparent 5%) 85%,
        var(--color-background) 100%
      );

      pointer-events: none;

      @include for-tablet-sm-and-below {
        background: linear-gradient(
          180deg,
          color-mix(in srgb, var(--color-background) 15%, transparent 85%) 0%,
          var(--color-background) 100%
        );
      }
    }
  }
</style>
