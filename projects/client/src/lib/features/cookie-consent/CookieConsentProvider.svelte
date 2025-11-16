<script lang="ts">
  import CookieNotice from "$lib/sections/cookie/CookieNotice.svelte";
  import type { CookieConsent } from "./models/CookieConsent";
  import { useCookieConsent } from "./useCookieConsent";

  const { consent, children }: { consent: CookieConsent } & ChildrenProps =
    $props();

  const { setConsent } = useCookieConsent();
  setConsent(consent);
</script>

{@render children()}

<CookieNotice />
