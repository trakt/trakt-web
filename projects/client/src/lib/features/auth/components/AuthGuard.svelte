<script lang="ts">
  import { deserialize } from "$app/forms";
  import { initiateDeviceAuth } from "$lib/requests/auth/initiateDeviceAuth";
  import { onMount, type Snippet } from "svelte";
  import { writable } from "svelte/store";
  import type { SerializedAuthResponse } from "../models/SerializedAuthResponse";
  import Logo from "$lib/components/logo/Logo.svelte";
  import { setToken } from "../token";

  type AuthGuardProps = {
    token: string | Nil;
    children: Snippet;
  };

  const { token: seed, children }: AuthGuardProps = $props();
  const authUrl = writable<string | Nil>();
  const token = writable<string | Nil>(seed);

  token.subscribe(setToken);

  function requestAuthStatus(code: string) {
    const body = new FormData();
    body.append("code", code);

    return fetch("/auth/?/resolve", {
      method: "POST",
      headers: {
        "x-sveltekit-action": "true",
      },
      body: body,
    }).then(async (res) => {
      const text = await res.text();
      const deserialized = deserialize<SerializedAuthResponse, undefined>(text);

      if (deserialized?.type !== "success") {
        throw new Error("Deserialization error. The data has betrayed us.");
      }

      return deserialized.data!;
    });
  }

  onMount(async () => {
    if (seed != null) {
      return;
    }

    const auth = await initiateDeviceAuth();
    authUrl.set(auth.url);

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

{#if $token != null}
  {@render children()}
{:else}
  <div class="auth-container">
    <div class="trakt-logo">
      <Logo />
    </div>
    <p>The path is guarded by ancient algorithms. Only the worthy may pass.</p>
    <a href={$authUrl} class="trakt-button" target="_blank"> Authorize </a>
  </div>
{/if}

<style>
  .auth-container {
    width: 20dvw;
    padding: 10rem;
    border-radius: 0.5rem;

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;

    inset: 0;
    margin: auto;
  }

  .trakt-logo {
    width: 100%;
  }

  .trakt-button {
    display: inline-flex;
    align-items: center;

    max-width: fit-content;
    height: 1.5rem;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;

    text-decoration: none;

    background: var(--purple-500);
    color: var(--shade-10);

    font-size: 1rem;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    text-transform: uppercase;

    transition: 100ms background linear;

    &:hover {
      background: var(--purple-700);
    }
  }
</style>
