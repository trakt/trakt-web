<script lang="ts">
  import CookieNotice from "$lib/sections/cookie/CookieNotice.svelte";
  import { iffy } from "$lib/utils/function/iffy";
  import type { CookieConsent } from "./models/CookieConsent";
  import { useCookieConsent } from "./useCookieConsent";

  type CookieConsentProviderProps = {
    consent: CookieConsent;
    isBot: boolean;
  } & ChildrenProps;

  const { consent, isBot, children }: CookieConsentProviderProps = $props();

  const { setConsent } = useCookieConsent();

  iffy(() => setConsent(consent));
</script>

{@render children()}

{#if !isBot}
  <CookieNotice />
{/if}
