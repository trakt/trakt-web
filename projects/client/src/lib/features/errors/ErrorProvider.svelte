<script lang="ts">
  import { afterNavigate } from "$app/navigation";
  import ErrorLockedAccountPage from "$lib/pages/errors/ErrorLockedAccountPage.svelte";
  import ErrorServicePage from "$lib/pages/errors/ErrorServicePage.svelte";
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import { mapToWellKnownError } from "./_internal/mapToWellKnownError";
  import { FETCH_ERROR_EVENT } from "./constants";
  import { WellKnownError } from "./models/WellKnownErrors";

  const { children }: ChildrenProps = $props();
  const fetchError = writable<WellKnownError | undefined>(undefined);

  onMount(() => {
    const handler = (event: Event) => {
      const errorEvent = event as CustomEvent<number>;
      fetchError.set(mapToWellKnownError(errorEvent.detail));
    };

    globalThis.window.addEventListener(FETCH_ERROR_EVENT, handler);

    return () => {
      globalThis.window.removeEventListener(FETCH_ERROR_EVENT, handler);
    };
  });

  afterNavigate((_) => fetchError.set(undefined));
</script>

{#if $fetchError === WellKnownError.LockedAccountError}
  <ErrorLockedAccountPage />
{/if}

{#if $fetchError === WellKnownError.ServerError}
  <ErrorServicePage />
{/if}

{#if !$fetchError}
  {@render children()}
{/if}
