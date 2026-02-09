<script lang="ts">
  import { iffy } from "$lib/utils/function/iffy";
  import { createAuthContext } from "../stores/createAuthContext";
  import { initializeUserManager } from "../stores/initializeUserManager";
  import { useUser } from "../stores/useUser";

  type AuthProviderProps = {
    isAuthorized: boolean;
    accessToken: string | null;
  } & ChildrenProps;

  const {
    children,
    isAuthorized: isAuthorizedOidc,
    accessToken,
  }: AuthProviderProps = $props();

  const { isAuthorized } = iffy(() =>
    createAuthContext({
      isAuthorized: isAuthorizedOidc,
      token: null,
    }),
  );

  const { isInitializing } = iffy(() => initializeUserManager(accessToken));
  const { user } = useUser();
</script>

{#if !$isInitializing && $user != null}
  {@render children()}
{/if}
