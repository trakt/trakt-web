<script lang="ts">
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent.ts";
  import { useTrack } from "$lib/features/analytics/useTrack.ts";
  import { mapToToken } from "$lib/features/auth/mapToToken";
  import { postToken } from "$lib/features/auth/postToken";
  import { toLoginFailureCode } from "$lib/features/auth/toLoginFailureCode.ts";
  import { getUserManager } from "$lib/features/auth/stores/userManager";
  import { FETCH_ERROR_EVENT } from "$lib/features/errors/constants";
  import { error as printError } from "$lib/utils/console/print.ts";
  import { setCacheBuster } from "$lib/utils/url/setCacheBuster";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import { claimSigninCallback } from "./_internal/claimSigninCallback.ts";
  import type { User } from "oidc-client-ts";
  import { onMount } from "svelte";

  const { track: trackLoginComplete } = useTrack(AnalyticsEvent.LoginComplete);
  const { track: trackLoginFailed } = useTrack(AnalyticsEvent.LoginFailed);

  const storeSession = async (user: User | Nil) => {
    if (!user) {
      return;
    }

    const response = await postToken(mapToToken(user));

    if (response instanceof Response && response.ok) {
      trackLoginComplete();
      return;
    }

    trackLoginFailed({ error: "session_not_stored" });
  };

  const navigateToHome = () => {
    const homeUrl = new URL(
      UrlBuilder.home(),
      globalThis.window.location.origin,
    );
    globalThis.window.location.replace(setCacheBuster(homeUrl));
  };

  onMount(() => {
    const manager = getUserManager();

    if (!manager || !claimSigninCallback()) {
      return;
    }

    manager
      .signinCallback()
      .then(storeSession)
      .then(navigateToHome)
      .catch((error) => {
        printError("Error during sign-in callback:", error);
        trackLoginFailed({ error: toLoginFailureCode(error) });

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
