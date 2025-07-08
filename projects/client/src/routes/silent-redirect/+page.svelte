<script lang="ts">
  import { getOidcConfig } from "$lib/features/auth/getOidcConfig";
  import { error } from "$lib/utils/console/print";
  import { UserManager } from "oidc-client-ts";
  import { onMount } from "svelte";

  onMount(async () => {
    try {
      const userManager = new UserManager({
        ...getOidcConfig(),
        automaticSilentRenew: false,
      });

      await userManager.signinSilentCallback();
    } catch (_) {
      error("Failed to refresh token silently.");
    }
  });
</script>
