<script lang="ts">
  import CookieNotice from "$lib/sections/cookie/CookieNotice.svelte";
  import { iffy } from "$lib/utils/function/iffy";
  import type { CookieConsent } from "./models/CookieConsent";
  import { useCookieConsent } from "./useCookieConsent";

  const { consent, children }: { consent: CookieConsent } & ChildrenProps =
    $props();

  const { setConsent } = useCookieConsent();

  iffy(() => setConsent(consent));
</script>

{@render children()}

<CookieNotice />
