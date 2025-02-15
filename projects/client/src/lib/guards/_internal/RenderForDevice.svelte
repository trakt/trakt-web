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

  const shouldRender = useDebouncedValue(time.fps(60));

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

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  trakt-render-for {
    display: none;

    &:not([class*="render-for-"]) {
      display: contents !important;
    }
  }

  .render-for-mobile {
    display: none;

    @include for-mobile {
      display: contents !important;
    }
  }

  .render-for-tablet-small {
    display: none;

    @include for-tablet-sm {
      display: contents !important;
    }
  }

  .render-for-tablet-large {
    display: none;

    @include for-tablet-lg {
      display: contents !important;
    }
  }

  .render-for-desktop {
    @include for-desktop {
      display: contents !important;
    }
  }
</style>
