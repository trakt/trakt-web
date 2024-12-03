<script lang="ts">
  import { type InitiateDeviceAuth } from "$lib/features/auth/requests/initiateDeviceAuth";
  import { onMount } from "svelte";
  import { AuthEndpoint } from "../AuthEndpoint";
  import type { SerializedAuthResponse } from "../models/SerializedAuthResponse";
  import { provisionAuth, useAuth } from "../stores/useAuth";

  type AuthProviderProps = {
    auth: InitiateDeviceAuth;
    token: string | Nil;
  } & ChildrenProps;

  const { token: seed, auth, children }: AuthProviderProps = $props();

  provisionAuth({
    token: seed,
    url: auth.url,
  });

  const { token } = useAuth();

  function requestAuthStatus(code: string) {
    return fetch(AuthEndpoint.Verify, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    }).then((res) => res.json() as Promise<SerializedAuthResponse>);
  }

  onMount(async () => {
    if (seed != null) {
      return;
    }

    const interval = setInterval(async () => {
      if (Date.now() > auth.expireAt) {
        clearInterval(interval);
        return;
      }

      const {
        isAuthorized,
        token: { access },
      } = await requestAuthStatus(auth.code);

      if (!isAuthorized) {
        return;
      }

      clearInterval(interval);
      token.set(access);
    }, auth.interval);
  });
</script>

{@render children()}
