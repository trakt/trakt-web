<script lang="ts">
  import { useCookieConsent } from "../cookie-consent/useCookieConsent";
  import FirebaseSetup from "./FirebaseSetup.svelte";

  const { children }: ChildrenProps = $props();

  const { consent } = useCookieConsent();
</script>

<svelte:head>
  {#if $consent === "all"}
    <!-- HOTJAR -->
    <script>
      (function (c, s, q, u, a, r, e) {
        c.hj =
          c.hj ||
          function () {
            (c.hj.q = c.hj.q || []).push(arguments);
          };
        c._hjSettings = { hjid: a };
        r = s.getElementsByTagName("head")[0];
        e = s.createElement("script");
        e.async = true;
        e.src = q + c._hjSettings.hjid + u;
        r.appendChild(e);
      })(
        window,
        document,
        "https://static.hj.contentsquare.net/c/csq-",
        ".js",
        6374269,
      );
    </script>
  {/if}
</svelte:head>

{#if $consent === "all"}
  <FirebaseSetup>
    {@render children()}
  </FirebaseSetup>
{:else}
  {@render children()}
{/if}
