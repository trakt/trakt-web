<script lang="ts">
  import { afterNavigate } from "$app/navigation";
  import { page } from "$app/state";
  import Error404Page from "$lib/pages/errors/Error404Page.svelte";
  import ErrorLockedAccountPage from "$lib/pages/errors/ErrorLockedAccountPage.svelte";
  import ErrorServicePage from "$lib/pages/errors/ErrorServicePage.svelte";
  import UnexpectedErrorPage from "$lib/pages/errors/UnexpectedErrorPage.svelte";
  import { writable } from "$lib/utils/store/WritableSubject.ts";
  import * as Sentry from "@sentry/sveltekit";
  import { onMount } from "svelte";
  import { isErrorExempt } from "./_internal/errorExemptions.ts";
  import { mapToWellKnownError } from "./_internal/mapToWellKnownError";
  import { FETCH_ERROR_EVENT } from "./constants";
  import type { CustomFetchError } from "./models/CustomFetchError";
  import {
    WellKnownErrorType,
    type WellKnownError,
  } from "./models/WellKnownErrors";

  const { children }: ChildrenProps = $props();
  const fetchError = writable<WellKnownError | undefined>(undefined);
  const unexpectedError = writable<Error | undefined>(undefined);

  onMount(() => {
    const handler = (event: Event) => {
      const errorEvent = event as CustomEvent<CustomFetchError>;
      fetchError.set(mapToWellKnownError(errorEvent.detail));
    };

    globalThis.window.addEventListener(FETCH_ERROR_EVENT, handler);

    return () => {
      globalThis.window.removeEventListener(FETCH_ERROR_EVENT, handler);
    };
  });

  afterNavigate((_) => {
    fetchError.set(undefined);
    unexpectedError.set(undefined);
  });

  const hasExemption = $derived(isErrorExempt($fetchError, page.route.id));
  const hasError = $derived($fetchError || $unexpectedError);
</script>

<svelte:window
  onerror={(event) => {
    const error = event.error;
    if (!(error && error instanceof Error)) {
      return;
    }

    // Filter out errors from third-party scripts
    if (!error.stack?.includes(window.location.hostname)) {
      return;
    }

    /*
      Filter out errors caused by blocked frames e.g.,
      due to popup blockers or browser privacy settings)
    */
    if (
      error.name === "SecurityError" &&
      error.message.toLowerCase().includes("blocked a frame")
    ) {
      return;
    }

    Sentry.captureException(error, {
      tags: {
        type: "ErrorProvider",
      },
    });
    unexpectedError.set(error);
  }}
/>

{#if !hasExemption}
  {#if $unexpectedError}
    <UnexpectedErrorPage />
  {/if}

  {#if $fetchError?.type === WellKnownErrorType.LockedAccountError}
    <ErrorLockedAccountPage />
  {/if}

  {#if $fetchError?.type === WellKnownErrorType.RateLimitError}
    <ErrorServicePage message={$fetchError.message} />
  {/if}

  {#if $fetchError?.type === WellKnownErrorType.ServerError}
    <ErrorServicePage message={$fetchError.message} />
  {/if}

  {#if $fetchError?.type === WellKnownErrorType.NotFoundError}
    <Error404Page />
  {/if}
{/if}

{#if !hasError || hasExemption}
  {@render children()}
{/if}
