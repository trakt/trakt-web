<script lang="ts">
  import type { DeviceType } from "$lib/models/DeviceType";
  import CookieNotice from "$lib/sections/cookie/CookieNotice.svelte";
  import type { CookieConsent } from "./models/CookieConsent";
  import { useCookieConsent } from "./useCookieConsent";

  const {
    consent,
    device,
    children,
  }: { consent: CookieConsent; device: DeviceType } & ChildrenProps = $props();

  const { setConsent } = useCookieConsent();
  setConsent(consent);
</script>

{@render children()}

{#if device !== "tv"}
  <CookieNotice />
{/if}
