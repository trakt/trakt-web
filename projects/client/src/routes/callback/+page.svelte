<script lang="ts">
  import { getUserManager } from "$lib/features/auth/stores/userManager";
  import { setCacheBuster } from "$lib/utils/url/setCacheBuster";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import { onMount } from "svelte";

  onMount(() => {
    getUserManager()
      ?.signinRedirectCallback()
      .then(() => {
        const homeUrl = new URL(
          UrlBuilder.home(),
          globalThis.window.location.origin,
        );
        globalThis.window.location.replace(setCacheBuster(homeUrl));
      });
  });
</script>
