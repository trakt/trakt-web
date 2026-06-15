<script lang="ts">
  import { browser, dev } from "$app/environment";
  import { onlineManager, type QueryClient } from "@tanstack/query-core";
  import type {
    DevtoolsButtonPosition,
    DevtoolsErrorType,
    DevtoolsPosition,
    TanstackQueryDevtools,
  } from "@tanstack/query-devtools";
  import { onMount } from "svelte";

  type QueryDevtoolsProps = {
    client: QueryClient;
    initialIsOpen?: boolean;
    buttonPosition?: DevtoolsButtonPosition;
    position?: DevtoolsPosition;
    errorTypes?: Array<DevtoolsErrorType>;
    styleNonce?: string;
    shadowDOMTarget?: ShadowRoot;
    hideDisabledQueries?: boolean;
  };

  const {
    client,
    initialIsOpen = false,
    buttonPosition = "bottom-right",
    position = "bottom",
    errorTypes = [],
    styleNonce,
    shadowDOMTarget,
    hideDisabledQueries = false,
  }: QueryDevtoolsProps = $props();

  let ref: HTMLDivElement;
  let devtools: TanstackQueryDevtools | undefined;

  onMount(() => {
    if (!dev || !browser) return;
    let cancelled = false;

    import("@tanstack/query-devtools").then((m) => {
      if (cancelled) return;
      devtools = new m.TanstackQueryDevtools({
        client,
        queryFlavor: "Svelte Query",
        version: "5",
        onlineManager,
        buttonPosition,
        position,
        initialIsOpen,
        errorTypes,
        styleNonce,
        shadowDOMTarget,
        hideDisabledQueries,
      });
      devtools.mount(ref);
    });

    return () => {
      cancelled = true;
      devtools?.unmount();
    };
  });
</script>

<div class="tsqd-parent-container" bind:this={ref}></div>
