<script lang="ts">
  import { replaceState } from "$app/navigation";
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { AuthEndpoint } from "../AuthEndpoint";
  import type { ClientAuthResponse } from "../models/SerializedAuthResponse";
  import { provisionAuth, useAuth } from "../stores/useAuth";

  type AuthProviderProps = {
    url: string;
    isAuthorized: boolean;
  } & ChildrenProps;

  const { isAuthorized, url, children }: AuthProviderProps = $props();

  provisionAuth({
    isAuthorized,
    url,
  });

  const store = useAuth();

  function requestAuthStatus(code: string) {
    return fetch(AuthEndpoint.Exchange, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    }).then((res) => res.json() as Promise<ClientAuthResponse>);
  }

  onMount(async () => {
    const url = new URL($page.url.href);
    const queryParams = url.searchParams;
    const code = queryParams.get("code");

    if (!code) {
      return;
    }

    const { isAuthorized } = await requestAuthStatus(code);
    store.isAuthorized.set(isAuthorized);
    if (!isAuthorized) {
      return;
    }

    queryParams.delete("code");

    replaceState(
      `${url.pathname}${queryParams.toString() ? "?" + queryParams.toString() : ""}`,
      {},
    );
  });
</script>

{@render children()}
