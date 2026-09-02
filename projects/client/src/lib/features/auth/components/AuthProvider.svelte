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

  // A lapsed access token is not a session that can be spent. Seeding it
  // authorizes the `useUser` fan-out to leave with a dead bearer, and the 401
  // that comes back tears the session down before the renewal lands.
  const hasLiveSession = iffy(
    () => clientAuth?.hasSession === true && !clientAuth.isExpired,
  );

  const isAuthorized = iffy(() =>
    clientAuth == null ? isAuthorizedOidc : hasLiveSession,
  );

  // `useUser` subscribes authorized queries during this first render, before
  // `initializeUserManager` mounts; without a token they 401 and sign out.
  iffy(() => {
    if (!hasLiveSession || clientAuth?.token.value == null) {
      return;
    }

    setToken(clientAuth.token);
  });

  const ctx = iffy(() =>
    createAuthContext({
      isAuthorized,
      token: hasLiveSession ? (clientAuth?.token ?? null) : null,
    }),
  );

  const { isInitializing } = iffy(() =>
    initializeUserManager({
      ctx,
      tokenFromServer: accessToken,
      hasServerSession,
      // Only skip the gate for a session that can be spent right now: a lapsed
      // one waits behind its renewal instead. Ungating an unauthorized tree
      // renders children in this same cycle, and their `onMount` runs before
      // ours - so `/callback` would reach for `getUserManager()` before
      // `setUserManager` has been called.
      isResolved: hasLiveSession,
    }),
  );
  const { user } = useUser();
</script>

{#if !$isInitializing && $user != null}
  {@render children()}
{/if}
