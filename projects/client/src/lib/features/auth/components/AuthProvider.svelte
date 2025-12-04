<script lang="ts">
  import { beforeNavigate, goto } from "$app/navigation";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import { get } from "svelte/store";
  import { createAuthContext } from "../stores/createAuthContext";
  import { initializeUserManager } from "../stores/initializeUserManager";
  import { useUser } from "../stores/useUser";

  type AuthProviderProps = {
    isAuthorized: boolean;
  } & ChildrenProps;

  const { children, isAuthorized: isAuthorizedOidc }: AuthProviderProps =
    $props();

  const { isAuthorized } = createAuthContext({
    isAuthorized: isAuthorizedOidc,
    token: null,
  });

  const { isInitializing } = initializeUserManager();
  const { user } = useUser();

  beforeNavigate(({ from, to, cancel }) => {
    const isSamePage = from?.url.pathname === to?.url.pathname;

    if (get(isAuthorized) || isSamePage) {
      return;
    }

    const isNavigatingToHomePage = to?.url.pathname === UrlBuilder.home();

    if (!isNavigatingToHomePage) {
      goto(UrlBuilder.home(), { replaceState: true });
    }
  });
</script>

{#if !$isInitializing && $user != null}
  {@render children()}
{/if}
