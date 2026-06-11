<script lang="ts">
  import { iffy } from "$lib/utils/function/iffy";
  import { of } from "rxjs";
  import { untrack } from "svelte";
  import { createAuthContext } from "../stores/createAuthContext";
  import { initializeUserManager } from "../stores/initializeUserManager";
  import { useUser } from "../stores/useUser";

  type AuthProviderProps = {
    isAuthorized: boolean;
    accessToken: string | null;
    isAuthorizedLegacy: boolean;
  } & ChildrenProps;

  const {
    children,
    isAuthorized: isAuthorizedOidc,
    accessToken,
    isAuthorizedLegacy,
  }: AuthProviderProps = $props();

  const ctx = iffy(() =>
    createAuthContext({
      isAuthorized: isAuthorizedLegacy || isAuthorizedOidc,
      token: null,
    }),
  );

  // Skip OIDC init for legacy auth users — OIDC user manager would clobber auth state
  const legacyMode = untrack(() => isAuthorizedLegacy);
  const { isInitializing } = legacyMode
    ? { isInitializing: of(false) }
    : iffy(() =>
        initializeUserManager({ ctx, tokenFromServer: accessToken }),
      );
  const { user } = useUser();
</script>

{#if !$isInitializing && $user != null}
  {@render children()}
{/if}
