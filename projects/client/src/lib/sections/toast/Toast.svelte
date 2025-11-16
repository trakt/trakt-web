<script lang="ts">
  import { fade } from "svelte/transition";
  import { useFooterHeight } from "./_internal/useFooterHeight";
  import { useScrollDistance } from "./_internal/useScrollDistance";

  const { children }: ChildrenProps = $props();
  const { distanceFromBottom } = useScrollDistance();
  const { footerHeight } = useFooterHeight();
</script>

<div
  class="trakt-toast"
  style="--distance-from-bottom: {$distanceFromBottom}px; --footer-height: {$footerHeight}px"
  transition:fade={{ duration: 300 }}
>
  {@render children()}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-toast {
    --toast-padding: var(--ni-12);
    --toast-gap: var(--gap-m);
    --toast-bottom-distance: var(--ni-24);
    --toast-height: calc(var(--height-toast-card) + 2 * var(--toast-padding));
    --toast-footer-top: var(--footer-height) - var(--footer-bar-padding);
    --toast-footer-offset: var(--toast-footer-top) - var(--toast-height);

    position: fixed;
    z-index: var(--layer-overlay);

    border-radius: var(--border-radius-l);

    box-sizing: border-box;
    padding: var(--toast-padding);

    max-height: var(--toast-height);
    width: min(var(--ni-480), 90dvw);

    bottom: max(
      var(--toast-bottom-distance),
      var(--toast-footer-offset) - var(--distance-from-bottom)
    );
    left: 50%;
    transform: translateX(-50%);

    display: flex;
    align-items: center;
    gap: var(--toast-gap);

    box-shadow: var(--ni-0) var(--ni-8) var(--ni-8) var(--ni-0)
      color-mix(in srgb, var(--color-shadow) 25%, transparent);

    background-color: var(--color-toast-background);
    border: var(--border-thickness-xxs) solid var(--color-toast-border);

    transition: var(--transition-increment) ease-in-out;
    transition-property: padding, gap;

    backdrop-filter: blur(var(--ni-16));
  }
</style>
