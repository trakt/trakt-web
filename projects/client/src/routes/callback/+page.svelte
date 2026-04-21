<script lang="ts">
  import { getUserManager } from "$lib/features/auth/stores/userManager";
  import { FETCH_ERROR_EVENT } from "$lib/features/errors/constants";
  import { error as printError } from "$lib/utils/console/print.ts";
  import { setCacheBuster } from "$lib/utils/url/setCacheBuster";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import { onMount } from "svelte";

  const navigateToHome = () => {
    const homeUrl = new URL(
      UrlBuilder.home(),
      globalThis.window.location.origin,
    );
    globalThis.window.location.replace(setCacheBuster(homeUrl));
  };

  onMount(() => {
    getUserManager()
      ?.signinCallback()
      .then(navigateToHome)
      .catch((error) => {
        printError("Error during sign-in callback:", error);

        if (error instanceof Error && error.message.includes("429")) {
          document.body.style.display = "block";
          globalThis.window.dispatchEvent(
            new CustomEvent(FETCH_ERROR_EVENT, {
              detail: {
                status: 429,
                message: "Rate limited during sign-in",
              },
            }),
          );
          return;
        }

        navigateToHome();
      });
  });
</script>

<style>
  :global(body) {
    display: none;
  }
</style>
