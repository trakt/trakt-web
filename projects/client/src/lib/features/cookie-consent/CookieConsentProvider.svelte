<script lang="ts">
  import CookieNotice from "$lib/sections/cookie/CookieNotice.svelte";
  import { getDeviceType } from "$lib/utils/devices/getDeviceType";
  import { useCookieConsent } from "./useCookieConsent";

  const { hasConsent, children }: { hasConsent: boolean } & ChildrenProps =
    $props();

  const { setConsent } = useCookieConsent();
  setConsent(hasConsent);

  const isTV = $derived(getDeviceType(navigator.userAgent) === "tv");
</script>

{@render children()}

{#if !isTV}
  <CookieNotice />
{/if}
