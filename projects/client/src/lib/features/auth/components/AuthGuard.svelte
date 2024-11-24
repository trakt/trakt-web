<script lang="ts">
  import Logo from "$lib/components/logo/Logo.svelte";
  import { type InitiateDeviceAuth } from "$lib/features/auth/requests/initiateDeviceAuth";
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import { AuthEndpoint } from "../AuthEndpoint";
  import type { SerializedAuthResponse } from "../models/SerializedAuthResponse";
  import { useToken } from "../stores/useToken";

  type AuthGuardProps = {
    token: string | Nil;
  } & ChildrenProps;

  const { token: seed, children }: AuthGuardProps = $props();
  const { token } = useToken(seed);
  const authUrl = writable<string | Nil>();

  function requestAuthStatus(code: string) {
    return fetch(AuthEndpoint.Verify, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    }).then((res) => res.json() as Promise<SerializedAuthResponse>);
  }

  function requestAuthCode() {
    return fetch(AuthEndpoint.Initiate, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json() as Promise<InitiateDeviceAuth>);
  }

  onMount(async () => {
    if (seed != null) {
      return;
    }

    const auth = await requestAuthCode();
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
    width: max(30dvw, 15em);
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

    transition: var(--transition-increment) background linear;

    &:hover {
      background: var(--purple-700);
    }
  }
</style>
