<script lang="ts">
  import { useCookieConsent } from "../cookie-consent/useCookieConsent";
  import FirebaseSetup from "./FirebaseSetup.svelte";

  const { children }: ChildrenProps = $props();

  const { consent } = useCookieConsent();
</script>

<svelte:head>
  {#if $consent === "all"}
    <!-- Reddit Pixel -->
    <script>
      !(function (w, d) {
        if (!w.rdt) {
          var p = (w.rdt = function () {
            p.sendEvent
              ? p.sendEvent.apply(p, arguments)
              : p.callQueue.push(arguments);
          });
          p.callQueue = [];
          var t = d.createElement("script");
          ((t.src = "https://www.redditstatic.com/ads/pixel.js"),
            (t.async = !0));
          var s = d.getElementsByTagName("script")[0];
          s.parentNode.insertBefore(t, s);
        }
      })(window, document);
      rdt("init", "a2_i1ea6gxvoudq");
      rdt("track", "PageVisit");
    </script>
    <!-- DO NOT MODIFY UNLESS TO REPLACE A USER IDENTIFIER -->
    <!-- End Reddit Pixel -->
  {/if}
</svelte:head>

{#if $consent === "all"}
  <FirebaseSetup>
    {@render children()}
  </FirebaseSetup>
{:else}
  {@render children()}
{/if}
