<script lang="ts">
  import { useCookieConsent } from "../cookie-consent/useCookieConsent";
  import FirebaseSetup from "./FirebaseSetup.svelte";
  import XPixel from "./_internal/XPixel.svelte";

  const { children }: ChildrenProps = $props();

  const { consent } = useCookieConsent();
</script>

{#if $consent === "all"}
  <XPixel />
  <FirebaseSetup>
    {@render children()}
  </FirebaseSetup>
{:else}
  {@render children()}
{/if}
