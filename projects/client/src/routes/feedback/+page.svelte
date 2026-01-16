<script lang="ts">
  import { browser } from "$app/environment";
  import { getLanguageAndRegion } from "$lib/features/i18n";
  import { Theme } from "$lib/features/theme/models/Theme";
  import { useTheme } from "$lib/features/theme/useTheme";
  import { onMount } from "svelte";

  // TODO typings
  const { data }: { data: any } = $props();

  const { theme } = useTheme();
  const { language } = getLanguageAndRegion();

  const featureBaseTheme = $derived.by(() => {
    switch ($theme) {
      case Theme.Dark:
        return "dark";
      case Theme.Light:
        return "light";
      default:
        return "";
    }
  });

  // TODO extract and improve
  if (browser) {
    let win: any = window;

    const script = document.createElement("script");
    script.src = "https://do.featurebase.app/js/sdk.js";
    script.id = "featurebase-sdk";
    document.head.appendChild(script);

    onMount(() => {
      if (typeof win.Featurebase !== "function") {
        win.Featurebase = function () {
          (win.Featurebase.q = win.Featurebase.q || []).push(arguments);
        };
      }
      win.Featurebase("init_embed_widget", {
        organization: "trakt",

        embedOptions: {
          path: "/", // Initial page to load: '/' for feedback board, '/roadmap' for roadmap, '/changelog' for changelog, etc.
          filters: "", // Query params that can be used for default filters (e.g. 'b=63f827df2d62cb301468aac4&sortBy=upvotes:desc')
          // routeSyncingBasePath: "" // ADVANCED - Sync URLs between your website & the embed, read the documentation below for usage
        },

        stylingOptions: {
          theme: featureBaseTheme, // Theme options: 'light', 'dark', or '' for auto-detection
          hideMenu: true, // Toggle visibility of the top navigation bar
          hideLogo: false, // Toggle visibility of the logo in the navigation bar
        },

        user: {
          jwt: data.featurebaseToken,
        },

        locale: language, // Language setting (all available at https://help.featurebase.app/en/articles/8879098)
      });
    });
  }
  /*
  https://help.featurebase.app/articles/0950893-embedded-web-portal-view

  TODO:
  -link in footer
  -FF
*/
</script>

<main>
  <div data-featurebase-embed></div>
</main>
