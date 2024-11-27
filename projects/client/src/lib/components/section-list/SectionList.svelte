<script lang="ts">
  import { useVarToPixels } from "$lib/utils/css/useVarToPixels";
  import { writable } from "svelte/store";
  import ActionButton from "../buttons/ActionButton.svelte";
  import CaretLeftIcon from "../icons/CaretLeftIcon.svelte";
  import CaretRightIcon from "../icons/CaretRightIcon.svelte";
  import { scrollTracking } from "./scrollTracking";

  type SectionListProps = {
    title: string;
  } & ChildrenProps;

  const { children, title }: SectionListProps = $props();
  const sideDistance = useVarToPixels("var(--layout-distance-side)");
  const windowShadowWidth = useVarToPixels("var(--ni-64)");

  const scrollX = writable({ left: 0, right: 0 });

  const isLeftShadowVisible = $derived($scrollX.left > $sideDistance);
  const isRightShadowVisible = $derived($scrollX.right > $sideDistance);

  const leftShadowIntensity = $derived(
    ($scrollX.left - $sideDistance) / $windowShadowWidth,
  );

  const rightShadowIntensity = $derived(
    ($scrollX.right - $sideDistance) / $windowShadowWidth,
  );

  let horizontalScrollContainer: HTMLDivElement;

  function scrollToLeft() {
    horizontalScrollContainer.scrollBy({
      left: -window.innerWidth,
      behavior: "smooth",
    });
  }

  function scrollToRight() {
    horizontalScrollContainer.scrollBy({
      left: window.innerWidth,
      behavior: "smooth",
    });
  }

  const isLeftScrollDisabled = $derived($scrollX.left <= 0);
  const isRightScrollDisabled = $derived($scrollX.right <= 0);
</script>

<section class="section-list-container">
  <div class="section-list-header">
    <h4 class="section-list-title ellipsis">{title}</h4>
    <div class="section-list-navigation-actions">
      <ActionButton
        onclick={scrollToLeft}
        label={`Scroll ${title} to the left`}
        variant="purple"
        disabled={isLeftScrollDisabled}
      >
        <CaretLeftIcon />
      </ActionButton>
      <ActionButton
        onclick={scrollToRight}
        label={`Scroll ${title} to the right`}
        variant="purple"
        disabled={isRightScrollDisabled}
      >
        <CaretRightIcon />
      </ActionButton>
    </div>
  </div>
  <div
    class="section-list"
    class:section-list-left-shadow={isLeftShadowVisible}
    class:section-list-right-shadow={isRightShadowVisible}
    style:--left-shadow-opacity={leftShadowIntensity}
    style:--right-shadow-opacity={rightShadowIntensity}
  >
    <div
      bind:this={horizontalScrollContainer}
      use:scrollTracking={scrollX}
      class="section-list-horizontal-scroll"
    >
      {@render children()}
    </div>
  </div>
</section>

<style>
  .section-list-container {
    display: flex;
    flex-direction: column;
    gap: var(--ni-32);
  }

  .section-list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--ni-16);

    margin: 0;
    margin-left: calc(var(--ni-56) + var(--layout-distance-side));
    margin-right: var(--layout-distance-side);
    transition: margin-left calc(var(--transition-increment) * 2) ease-in-out;

    @media (max-width: 480px) {
      margin-left: var(--ni-32);

      .section-list-navigation-actions {
        display: none;
      }
    }
  }

  .section-list-navigation-actions {
    display: flex;
    gap: var(--ni-4);
  }

  .section-list-title {
    color: var(--color-text-primary);
    transition: font-size calc(var(--transition-increment) * 2) ease-in-out;

    @media (max-width: 768px) {
      font-size: var(--ni-32);
    }

    @media (max-width: 480px) {
      font-size: var(--ni-24);
    }
  }

  .section-list {
    position: relative;

    &.section-list-left-shadow::before {
      opacity: var(--left-shadow-opacity);
    }

    &.section-list-right-shadow::after {
      opacity: var(--right-shadow-opacity);
    }

    &::before {
      --list-shadow-direction: to left;
      left: 0;
    }

    &::after {
      --list-shadow-direction: to right;
      right: 0;
    }

    &::before,
    &::after {
      content: "";
      z-index: 2;
      pointer-events: none;

      position: absolute;
      top: 0;

      width: var(--ni-56);
      height: calc(
        var(--height-section-list) - var(--layout-distance-scroll-card)
      );

      opacity: 0;

      background: linear-gradient(
        var(--list-shadow-direction),
        transparent 0%,
        color-mix(in srgb, var(--color-background) 2%, transparent 98%) 5%,
        color-mix(in srgb, var(--color-background) 4%, transparent 96%) 9%,
        color-mix(in srgb, var(--color-background) 7%, transparent 93%) 13%,
        color-mix(in srgb, var(--color-background) 10%, transparent 90%) 17%,
        color-mix(in srgb, var(--color-background) 14%, transparent 86%) 20%,
        color-mix(in srgb, var(--color-background) 18%, transparent 82%) 24%,
        color-mix(in srgb, var(--color-background) 23%, transparent 77%) 29%,
        color-mix(in srgb, var(--color-background) 29%, transparent 71%) 34%,
        color-mix(in srgb, var(--color-background) 35%, transparent 65%) 40%,
        color-mix(in srgb, var(--color-background) 43%, transparent 57%) 46%,
        color-mix(in srgb, var(--color-background) 52%, transparent 48%) 54%,
        color-mix(in srgb, var(--color-background) 62%, transparent 38%) 63%,
        color-mix(in srgb, var(--color-background) 73%, transparent 27%) 74%,
        color-mix(in srgb, var(--color-background) 86%, transparent 14%) 86%,
        var(--color-background) 100%
      );
    }
  }

  .section-list-horizontal-scroll {
    padding: 0 var(--layout-distance-side);

    display: flex;
    height: var(--height-section-list);
    gap: var(--ni-16);
    overflow-x: auto;
    scroll-snap-type: x proximity;

    & > :global(:not(svelte-css-wrapper)) {
      scroll-snap-align: start;

      &:first-child,
      &:last-child {
        scroll-snap-align: end;
      }
    }

    & > :global(svelte-css-wrapper > *) {
      scroll-snap-align: start;
    }

    & > :global(svelte-css-wrapper:first-child > *),
    & > :global(svelte-css-wrapper:last-child > *) {
      scroll-snap-align: end;
    }
  }
</style>
