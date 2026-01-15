<script lang="ts">
  import { useCookieConsent } from "../cookie-consent/useCookieConsent";
  import FirebaseSetup from "./FirebaseSetup.svelte";

  const { children }: ChildrenProps = $props();

  const { consent } = useCookieConsent();
</script>

{#if $consent === "all"}
  <FirebaseSetup>
    {@render children()}
  </FirebaseSetup>
{:else}
  {@render children()}
{/if}
