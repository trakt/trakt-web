<script lang="ts">
  const { children }: ChildrenProps = $props();
</script>

<div class="trakt-vip-content">
  <div class="trakt-vip-content-background"></div>
  {@render children()}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-vip-content {
    --top-bottom-padding: var(--ni-64);

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: calc(2 * var(--gap-xxl));

    align-self: center;
    max-width: var(--ni-1280);

    padding: var(--top-bottom-padding) var(--layout-distance-side);
    transition:
      padding,
      gap var(--transition-increment) ease-in-out;

    @include for-tablet-sm-and-below {
      --top-bottom-padding: var(--ni-36);
      gap: var(--gap-xxl);
    }

    @include for-mobile {
      --top-bottom-padding: var(--ni-24);
    }
  }

  .trakt-vip-content-background {
    position: fixed;
    inset: 0;
    z-index: var(--layer-background);

    background-image: url("./assets/curtains.jpg");
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;

    filter: blur(var(--ni-8)) grayscale(0.5);
  }

  .trakt-vip-content-background::after {
    content: "";
    position: absolute;
    inset: 0;

    background-color: var(--color-vip-background-overlay);
  }
</style>
