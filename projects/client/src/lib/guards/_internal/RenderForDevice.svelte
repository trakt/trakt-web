<script lang="ts">
  import { browser } from "$app/environment";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import { useDebouncedValue } from "$lib/stores/useDebouncedValue";
  import { time } from "$lib/utils/timing/time";
  import type { DeviceProps } from "./DeviceProps";

  const { children, device }: ChildrenProps & DeviceProps = $props();

  const isMobile = useMedia(WellKnownMediaQuery.mobile);
  const isTabletSmall = useMedia(WellKnownMediaQuery.tabletSmall);
  const isTabletLarge = useMedia(WellKnownMediaQuery.tabletLarge);
  const isDesktop = useMedia(WellKnownMediaQuery.desktop);

  const isAvailableForMobile = $derived(device.includes("mobile"));
  const isAvailableForTabletSmall = $derived(device.includes("tablet-sm"));
  const isAvailableForTabletLarge = $derived(device.includes("tablet-lg"));
  const isAvailableForDesktop = $derived(device.includes("desktop"));

  const shouldRenderMobile = $derived(isAvailableForMobile && $isMobile);
  const shouldRenderTabletSmall = $derived(
    isAvailableForTabletSmall && $isTabletSmall,
  );
  const shouldRenderTabletLarge = $derived(
    isAvailableForTabletLarge && $isTabletLarge,
  );
  const shouldRenderDesktop = $derived(isAvailableForDesktop && $isDesktop);

  const shouldRender = useDebouncedValue(time.seconds(1) / 60);

  $effect(() => {
    shouldRender.set(
      shouldRenderMobile ||
        shouldRenderTabletSmall ||
        shouldRenderTabletLarge ||
        shouldRenderDesktop,
    );
  });
</script>

{#if !browser || $shouldRender}
  <trakt-render-for
    class:render-for-mobile={isAvailableForMobile && !browser}
    class:render-for-tablet-small={isAvailableForTabletSmall && !browser}
    class:render-for-tablet-large={isAvailableForTabletLarge && !browser}
    class:render-for-desktop={isAvailableForDesktop && !browser}
  >
    {@render children()}
  </trakt-render-for>
{/if}

{@html `
<style>
  trakt-render-for {
    display: contents;

    &.render-for-mobile {
      @media ${WellKnownMediaQuery.mobile} {
        display: contents !important;
      }

      @media ${WellKnownMediaQuery.tabletSmall} {
        display: none;
      }
    }

    &.render-for-tablet-small {
      @media ${WellKnownMediaQuery.tabletSmall} {
        display: contents !important;
      }

      @media ${WellKnownMediaQuery.tabletLarge} {
        display: none;
      }
    }

    &.render-for-tablet-large {
      @media ${WellKnownMediaQuery.tabletLarge} {
        display: contents !important;
      }

      @media ${WellKnownMediaQuery.desktop} {
        display: none;
      }
    }

    &.render-for-desktop {
      @media ${WellKnownMediaQuery.desktop} {
        display: contents !important;
      }

      @media (max-width: 1024px) {
        display: none;
      }
    }
  }
</style>
`}
