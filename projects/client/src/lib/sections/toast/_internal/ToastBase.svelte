<script lang="ts">
  import type { LastWatchedItem } from "$lib/features/toast/models/LastWatchedItem";
  import type { NowPlayingItem } from "$lib/requests/models/NowPlayingItem";
  import { fade } from "svelte/transition";
  import ToastItemCard from "./ToastItemCard.svelte";
  import { useFooterHeight } from "./useFooterHeight";
  import { useScrollDistance } from "./useScrollDistance";

  const {
    children,
    item,
  }: { item: NowPlayingItem | LastWatchedItem } & ChildrenProps = $props();
  const { distanceFromBottom } = useScrollDistance();
  const { footerHeight } = useFooterHeight();
</script>

<div
  class="trakt-toast-base"
  style="--distance-from-bottom: {$distanceFromBottom}px; --footer-height: {$footerHeight}px"
  transition:fade={{ duration: 300 }}
>
  <ToastItemCard {item} />
  <div class="trakt-toast-content">
    {@render children()}
  </div>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-toast-base {
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

    height: var(--toast-height);
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
      var(--cm-shadow-25);

    background-color: var(--color-toast-background);
    border: var(--border-thickness-xxs) solid var(--color-toast-border);

    transition: var(--transition-increment) ease-in-out;
    transition-property: padding, gap;

    backdrop-filter: blur(var(--ni-16));

    @include for-tablet-sm-and-below {
      --toast-bottom-distance: calc(var(--ni-12) + var(--mobile-navbar-height));
      --toast-footer-offset: calc(
        var(--mobile-navbar-height) + var(--footer-height)
      );
    }

    @include for-mobile {
      --toast-padding: var(--ni-10);
      --toast-gap: var(--gap-s);
    }
  }

  .trakt-toast-content {
    flex: 1;
    height: calc(100% - var(--ni-8));

    display: flex;
    flex-direction: column;
    justify-content: space-between;

    gap: var(--gap-xxs);
    max-width: calc(100% - var(--toast-gap) - var(--width-toast-card));
  }
</style>
