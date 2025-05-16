<script lang="ts">
  import type { DeviceType } from "$lib/models/DeviceType";
  import CookieNotice from "$lib/sections/cookie/CookieNotice.svelte";
  import { useCookieConsent } from "./useCookieConsent";

  const {
    hasConsent,
    device,
    children,
  }: { hasConsent: boolean; device: DeviceType } & ChildrenProps = $props();

  const { setConsent } = useCookieConsent();
  setConsent(hasConsent);
</script>

{@render children()}

{#if device !== "tv"}
  <CookieNotice />
{/if}
