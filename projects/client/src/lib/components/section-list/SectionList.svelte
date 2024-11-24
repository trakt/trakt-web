<script lang="ts">
  import { varToPixels } from "$lib/utils/css/varToPixels";
  import { writable } from "svelte/store";
  import { scrollTracking } from "./scrollTracking";

  type SectionListProps = {
    title: string;
  } & ChildrenProps;

  const { children, title }: SectionListProps = $props();
  const layoutDistanceSide = varToPixels("--layout-distance-side");

  const scrollX = writable({ left: 0, right: 0 });

  const isLeftShadowVisible = $derived($scrollX.left > layoutDistanceSide);
  const isRightShadowVisible = $derived($scrollX.right > layoutDistanceSide);
</script>

<section class="section-list-container">
  <h4 class="section-list-title">{title}</h4>

  <div
    class="section-list"
    class:section-list-left-shadow={isLeftShadowVisible}
    class:section-list-right-shadow={isRightShadowVisible}
  >
    <div use:scrollTracking={scrollX} class="section-list-horizontal-scroll">
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

  .section-list-title {
    color: var(--color-text-primary);
    margin: 0;
    margin-left: calc(var(--ni-56) + var(--layout-distance-side));

    transition: calc(var(--transition-increment) * 2) ease-in-out;
    transition-property: margin-left, font-size;

    @media (max-width: 480px) {
      margin-left: var(--ni-32);
      font-size: var(--ni-24);
    }
  }

  .section-list {
    position: relative;

    &.section-list-left-shadow::before {
      opacity: 1;
    }

    &.section-list-right-shadow::after {
      opacity: 1;
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

      transition: opacity var(--transition-increment) ease-in-out;
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
  }
</style>
