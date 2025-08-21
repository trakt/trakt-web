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
      <CrossOriginImage {src} alt={`Background`} />
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

    display: grid;
    grid-template-columns: 1fr;

    gap: var(--gap-s);

    width: var(--width-card);
    height: var(--height-card-cover);

    border-radius: var(--border-radius-m);

    background-color: var(--color-card-background);

    padding: var(--content-padding);
    box-sizing: border-box;

    box-shadow:
      0px var(--ni-16) var(--ni-8) 0px var(--cm-shadow-2),
      0px var(--ni-8) var(--ni-4) 0px var(--cm-shadow-4),
      0px var(--ni-4) var(--ni-4) 0px var(--cm-shadow-8),
      0px var(--ni-1) var(--ni-2) 0px var(--cm-shadow-8);

    transition: padding var(--transition-increment) ease-in-out;

    :global(.trakt-button) {
      width: fit-content;
    }

    &:after {
      content: "";

      position: absolute;
      top: 0;
      left: 0;
      width: var(--width-card);
      height: var(--height-card-cover);

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

    width: calc(var(--width-card) - 2 * var(--content-padding));
    height: calc(var(--height-card-cover) - 2 * var(--content-padding));

    z-index: var(--layer-raised);
  }

  .trakt-cta-cover {
    position: absolute;
    top: 0;
    right: 0;
    width: var(--width-card);
    height: var(--height-card-cover);

    overflow: hidden;
    border-radius: var(--border-radius-m);

    :global(img) {
      position: absolute;
      top: 0;
      right: 0;

      width: min(100%, var(--ni-640));
      height: var(--height-card-cover);

      object-fit: cover;

      mask: linear-gradient(to right, transparent 0%, black 30%);
    }
  }
</style>
