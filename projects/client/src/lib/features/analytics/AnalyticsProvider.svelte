<script lang="ts">
  import { useCookieConsent } from "../cookie-consent/useCookieConsent";
  import FirebaseSetup from "./FirebaseSetup.svelte";
  import RedditPixel from "./_internal/RedditPixel.svelte";

  const { children }: ChildrenProps = $props();

  const { consent } = useCookieConsent();
</script>

{#if $consent === "all"}
  <RedditPixel />
{/if}

{#if $consent === "all"}
  <FirebaseSetup>
    {@render children()}
  </FirebaseSetup>
{:else}
  {@render children()}
{/if}
