<script lang="ts">
  import { getUserManager } from "$lib/features/auth/stores/userManager";
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
        navigateToHome();
      });
  });
</script>

<style>
  :global(body) {
    display: none;
  }
</style>
