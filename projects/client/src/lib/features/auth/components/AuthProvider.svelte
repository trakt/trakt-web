<script lang="ts">
  import { beforeNavigate, goto } from "$app/navigation";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import { get } from "svelte/store";
  import { createAuthContext } from "../stores/createAuthContext";
  import { initializeUserManager } from "../stores/initializeUserManager";

  type AuthProviderProps = {
    isAuthorizedLegacy: boolean;
    isAuthorized: boolean;
  } & ChildrenProps;

  const {
    children,
    isAuthorizedLegacy,
    isAuthorized: isAuthorizedOidc,
  }: AuthProviderProps = $props();

  const { isAuthorized } = createAuthContext({
    isAuthorized: isAuthorizedLegacy || isAuthorizedOidc,
    token: null,
  });

  const { isInitializing } = initializeUserManager(isAuthorizedLegacy);

  beforeNavigate(({ from, to, cancel }) => {
    const isHomePage = from?.url.pathname === UrlBuilder.home();
    const isSamePage = from?.url.pathname === to?.url.pathname;

    if (get(isAuthorized) || isHomePage || isSamePage) {
      return;
    }

    const isNavigatingToHomePage = to?.url.pathname === UrlBuilder.home();

    if (!isNavigatingToHomePage) {
      cancel();
      goto(UrlBuilder.home());
    }
  });
</script>

{#if !$isInitializing}
  {@render children()}
{/if}
