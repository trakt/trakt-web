<script lang="ts">
  import { useMedia, WellKnownMediaQuery } from "$lib/utils/css/useMedia";

  const {
    children,
    device,
  }: ChildrenProps & {
    device: Array<"mobile" | "tablet" | "desktop">;
  } = $props();

  const isMobile = useMedia(WellKnownMediaQuery.mobile);
  const isTablet = useMedia(WellKnownMediaQuery.tablet);
  const isDesktop = useMedia(WellKnownMediaQuery.desktop);

  const isAvailableForMobile = $derived(device.includes("mobile"));
  const isAvailableForTablet = $derived(device.includes("tablet"));
  const isAvailableForDesktop = $derived(device.includes("desktop"));

  const shouldRenderDesktop = $derived(isAvailableForDesktop && $isDesktop);
  const shouldRenderTablet = $derived(isAvailableForTablet && $isTablet);
  const shouldRenderMobile = $derived(isAvailableForMobile && $isMobile);

  if (device.length === 2) {
    $inspect({ shouldRenderMobile, shouldRenderTablet, shouldRenderDesktop });
  }
</script>

{#if shouldRenderDesktop || shouldRenderTablet || shouldRenderMobile}
  {@render children()}
{/if}
