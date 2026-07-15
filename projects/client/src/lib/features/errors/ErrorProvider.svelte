<script lang="ts">
  import { afterNavigate } from "$app/navigation";
  import { page } from "$app/state";
  import Error404Page from "$lib/pages/errors/Error404Page.svelte";
  import ErrorLockedAccountPage from "$lib/pages/errors/ErrorLockedAccountPage.svelte";
  import ErrorServicePage from "$lib/pages/errors/ErrorServicePage.svelte";
  import UnexpectedErrorPage from "$lib/pages/errors/UnexpectedErrorPage.svelte";
  import * as Sentry from "@sentry/sveltekit";
  import { onMount } from "svelte";
  import { isErrorExempt } from "./_internal/errorExemptions.ts";
  import { isInjectedScriptError } from "./_internal/isInjectedScriptError.ts";
  import { mapToWellKnownError } from "./_internal/mapToWellKnownError";
  import { FETCH_ERROR_EVENT } from "./constants";
  import { EXTENSION_PROTOCOLS } from "./constants/index.ts";
  import type { CustomFetchError } from "./models/CustomFetchError";
  import {
    WellKnownErrorType,
    type WellKnownError,
  } from "./models/WellKnownErrors";

  const { children }: ChildrenProps = $props();

  let fetchError = $state<WellKnownError | undefined>(undefined);
  let unexpectedError = $state<Error | undefined>(undefined);
  let sessionId = $state<string | undefined>(undefined);

  onMount(() => {
    const handler = (event: Event) => {
      const errorEvent = event as CustomEvent<CustomFetchError>;
      fetchError = mapToWellKnownError(errorEvent.detail);
    };

    globalThis.window.addEventListener(FETCH_ERROR_EVENT, handler);

    return () => {
      globalThis.window.removeEventListener(FETCH_ERROR_EVENT, handler);
    };
  });

  afterNavigate((_) => {
    fetchError = undefined;
    unexpectedError = undefined;
    sessionId = undefined;
  });

  const hasExemption = $derived(isErrorExempt(fetchError, page.route.id));
  const hasError = $derived(fetchError || unexpectedError);
</script>

<svelte:window
  onerror={(event) => {
    const error = event.error;
    if (!(error && error instanceof Error)) {
      return;
    }

    // Filter out extension noise and third-party scripts
    const isExternalNoise =
      !error.stack?.includes(window.location.hostname) ||
      // Scripts injected into the page (e.g. the iOS app's WKWebView
      // evaluateJavaScript scrolling to a YIR anchor that does not exist
      // for this year) throw as `global code` attributed to the document
      // URL. Nothing the page can act on — ignore instead of replacing
      // the page with the full-screen error.
      isInjectedScriptError(error) ||
      EXTENSION_PROTOCOLS.some((protocol) => error.stack?.includes(protocol)) ||
      // YouTube IFrame API (www-widgetapi.js) can be injected by
      // browser extensions as a second copy alongside Plyr's own instance.
      // When the iframe is torn down during SPA navigation the orphaned
      // API copy accesses stale registry entries; not actionable for us.
      error.stack?.includes("www-widgetapi.js") ||
      // Plyr's own scripts throw from an XHR error listener on network-layer
      // failures (e.g. Error: 0). Sentry wraps XMLHttpRequest and injects an
      // app-origin frame, so the hostname check above lets these through even
      // though the originating frame is third-party. A cosmetic player hiccup
      // must not escalate to the full-page error screen. Match both the CDN
      // host and the bare filename so self-hosted/bundled Plyr is covered too.
      error.stack?.includes("cdn.plyr.io") ||
      error.stack?.includes("plyr.js");

    if (isExternalNoise) return;

    /*
      Filter out errors caused by blocked frames e.g.,
      due to popup blockers or browser privacy settings)
    */
    const message = error.message.toLowerCase();
    if (
      error.name === "SecurityError" &&
      (message.includes("blocked a frame") ||
        message.includes("cross-origin object"))
    ) {
      return;
    }

    const id = crypto.randomUUID();
    sessionId = id;

    Sentry.captureException(error, {
      tags: {
        type: "ErrorProvider",
        sessionId: id,
      },
    });
    unexpectedError = error;
  }}
/>

{#if !hasExemption}
  {#if unexpectedError}
    <UnexpectedErrorPage error={unexpectedError} {sessionId} />
  {/if}

  {#if fetchError?.type === WellKnownErrorType.LockedAccountError}
    <ErrorLockedAccountPage message={fetchError.message} />
  {/if}

  {#if fetchError?.type === WellKnownErrorType.RateLimitError}
    <ErrorServicePage message={fetchError.message} />
  {/if}

  {#if fetchError?.type === WellKnownErrorType.ServerError}
    <ErrorServicePage message={fetchError.message} />
  {/if}

  {#if fetchError?.type === WellKnownErrorType.NotFoundError}
    <Error404Page />
  {/if}
{/if}

{#if !hasError || hasExemption}
  {@render children()}
{/if}
