<script lang="ts">
  import { iffy } from "$lib/utils/function/iffy";
  import { resolveBrowserAuthState } from "../resolveBrowserAuthState";
  import { createAuthContext } from "../stores/createAuthContext";
  import { initializeUserManager } from "../stores/initializeUserManager";
  import { useUser } from "../stores/useUser";
  import { setToken } from "../token/index";

  type AuthProviderProps = {
    isAuthorized: boolean;
    accessToken: string | null;
    hasServerSession: boolean;
  } & ChildrenProps;

  const {
    children,
    isAuthorized: isAuthorizedOidc,
    accessToken,
    hasServerSession,
  }: AuthProviderProps = $props();

  // The SSR flag describes the document, not the viewer: a cache-replayed
  // document was rendered for whoever populated the entry. Storage is truth.
  const clientAuth = iffy(resolveBrowserAuthState);

  // Optimistic: an expired session still seeds authorized, since
  // `automaticSilentRenew` almost always renews it before it matters.
  const isAuthorized = iffy(() => clientAuth?.hasSession ?? isAuthorizedOidc);

  // `useUser` subscribes authorized queries during this first render, before
  // `initializeUserManager` mounts; without a token they 401 and sign out.
  iffy(() => {
    if (clientAuth?.token.value == null) {
      return;
    }

    setToken(clientAuth.token);
  });

  const ctx = iffy(() =>
    createAuthContext({
      isAuthorized,
      token: clientAuth?.token ?? null,
    }),
  );

  const { isInitializing } = iffy(() =>
    initializeUserManager({
      ctx,
      tokenFromServer: accessToken,
      hasServerSession,
      // Only skip the gate for a session we actually found. Ungating an
      // unauthorized tree renders children in this same cycle, and their
      // `onMount` runs before ours - so `/callback` would reach for
      // `getUserManager()` before `setUserManager` has been called.
      isResolved: clientAuth?.hasSession === true,
    }),
  );
  const { user } = useUser();
</script>

{#if !$isInitializing && $user != null}
  {@render children()}
{/if}
