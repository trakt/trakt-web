<script lang="ts">
  import { createAuthContext } from "../stores/createAuthContext";
  import { initializeUserManager } from "../stores/initializeUserManager";

  type AuthProviderProps = {
    isAuthorizedLegacy: boolean;
    isAuthorized: boolean;
  } & ChildrenProps;

  const { children, isAuthorizedLegacy, isAuthorized }: AuthProviderProps =
    $props();

  createAuthContext({ isAuthorized: isAuthorizedLegacy || isAuthorized });

  initializeUserManager(isAuthorizedLegacy);
</script>

{@render children()}
