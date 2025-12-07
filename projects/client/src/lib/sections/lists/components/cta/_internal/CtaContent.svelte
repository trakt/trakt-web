<script lang="ts">
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";

  const {
    children,
    src,
  }: {
    src?: string | Nil;
  } & ChildrenProps = $props();
</script>

<div class="trakt-cta-container">
  {#if src}
    <div class="trakt-cta-cover">
      <CrossOriginImage {src} alt="Background" />
    </div>
  {/if}

  <div class="trakt-cta-content">
    {@render children()}
  </div>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-cta-container {
    --content-padding: var(--ni-16);
    --content-width: var(--width-override-card, var(--width-card));
    --content-height: var(
      --height-override-card-cover,
      var(--height-card-cover)
    );

    display: grid;
    grid-template-columns: 1fr;

    gap: var(--gap-s);

    width: var(--content-width);
    height: var(--content-height);

    border-radius: var(--border-radius-m);

    background-color: var(--color-card-background);

    padding: var(--content-padding);
    box-sizing: border-box;

    box-shadow:
      0px var(--ni-16) var(--ni-8) 0px
        color-mix(in srgb, var(--color-shadow) 2%, transparent),
      0px var(--ni-8) var(--ni-4) 0px
        color-mix(in srgb, var(--color-shadow) 4%, transparent),
      0px var(--ni-4) var(--ni-4) 0px
        color-mix(in srgb, var(--color-shadow) 8%, transparent),
      0px var(--ni-1) var(--ni-2) 0px
        color-mix(in srgb, var(--color-shadow) 8%, transparent);

    transition: padding var(--transition-increment) ease-in-out;

    :global(.trakt-button) {
      width: fit-content;
    }

    &:after {
      content: "";

      position: absolute;
      top: 0;
      left: 0;
      width: var(--content-width);
      height: var(--content-height);

      border-radius: var(--border-radius-m);

      background: var(--color-cta-background-gradient);

      opacity: 0.8;
    }

    @include for-mobile() {
      --content-padding: var(--ni-12);
    }
  }

  .trakt-cta-content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    gap: var(--gap-xs);

    width: calc(var(--content-width) - 2 * var(--content-padding));
    height: calc(var(--content-height) - 2 * var(--content-padding));

    z-index: var(--layer-raised);
  }

  .trakt-cta-cover {
    position: absolute;
    top: 0;
    right: 0;
    width: var(--content-width);
    height: var(--content-height);

    overflow: hidden;
    border-radius: var(--border-radius-m);

    :global(img) {
      position: absolute;
      top: 0;
      right: 0;

      width: min(100%, var(--ni-640));
      height: var(--content-height);

      object-fit: cover;

      mask: linear-gradient(to right, transparent 0%, black 30%);
    }
  }
</style>
