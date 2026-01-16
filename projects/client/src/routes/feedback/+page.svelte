<script lang="ts">
  import { browser } from "$app/environment";
  import { onMount } from "svelte";

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
        /* Required - Organization identifier */
        organization: "trakt", // Replace with your organization name (subdomain from your Featurebase workspace URL)

        embedOptions: {
          path: "/", // Initial page to load: '/' for feedback board, '/roadmap' for roadmap, '/changelog' for changelog, etc.
          filters: "", // Query params that can be used for default filters (e.g. 'b=63f827df2d62cb301468aac4&sortBy=upvotes:desc')
          // routeSyncingBasePath: "" // ADVANCED - Sync URLs between your website & the embed, read the documentation below for usage
        },

        /* Optional - Styling configuration */
        stylingOptions: {
          theme: "light", // Theme options: 'light', 'dark', or '' for auto-detection
          hideMenu: false, // Toggle visibility of the top navigation bar
          hideLogo: false, // Toggle visibility of the logo in the navigation bar
        },

        /* Optional - User authentication & data */
        // user: {
        //   jwt: "", // For SSO authentication, use jwt parameter here
        //   metadata: {} // Custom metadata to attach to feedback submissions
        // },
        // Note: When SDK identify is set up, the user will be automatically authenticated

        /* Optional - Localization */
        // locale: "en" // Language setting (all available at https://help.featurebase.app/en/articles/8879098)
      });
    });
  }
  /*
  https://help.featurebase.app/articles/0950893-embedded-web-portal-view

  TODO:
  -link in footer
  -FF
  -auth
  -styling
  -extract
*/
</script>

<main>
  <div data-featurebase-embed></div>
</main>
