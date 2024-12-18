<script lang="ts">
  import { replaceState } from "$app/navigation";
  import { onMount } from "svelte";
  import { AuthEndpoint } from "../AuthEndpoint";
  import type { SerializedAuthResponse } from "../models/SerializedAuthResponse";
  import { provisionAuth, useAuth } from "../stores/useAuth";

  type AuthProviderProps = {
    token: string | Nil;
    url: string;
  } & ChildrenProps;

  const { token, url, children }: AuthProviderProps = $props();

  provisionAuth({
    token,
    url,
  });

  const auth = useAuth();

  function requestAuthStatus(code: string) {
    return fetch(AuthEndpoint.Exchange, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    }).then((res) => res.json() as Promise<SerializedAuthResponse>);
  }

  onMount(async () => {
    const url = new URL(window.location.href);
    const queryParams = url.searchParams;
    const code = queryParams.get("code");

    if (!code) {
      return;
    }

    const {
      isAuthorized,
      token: { access },
    } = await requestAuthStatus(code);

    if (!isAuthorized) {
      return;
    }

    queryParams.delete("code");

    replaceState(
      `${url.pathname}${queryParams.toString() ? "?" + queryParams.toString() : ""}`,
      {},
    );

    auth.token.set(access);
  });
</script>

{@render children()}
