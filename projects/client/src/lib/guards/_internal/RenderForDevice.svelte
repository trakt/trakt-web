<script lang="ts">
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

  const shouldRender = useDebouncedValue(false, time.seconds(1) / 60);

  $effect(() => {
    shouldRender.set(
      shouldRenderMobile ||
        shouldRenderTabletSmall ||
        shouldRenderTabletLarge ||
        shouldRenderDesktop,
    );
  });
</script>

{#if $shouldRender}
  {@render children()}
{/if}
