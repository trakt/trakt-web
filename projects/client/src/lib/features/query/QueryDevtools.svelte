<script lang="ts">
  import { browser, dev } from "$app/environment";
  import { onlineManager, type QueryClient } from "@tanstack/query-core";
  import type {
    DevtoolsButtonPosition,
    DevtoolsErrorType,
    DevtoolsPosition,
  } from "@tanstack/query-devtools";
  import { onMount } from "svelte";
  import { mountQueryDevtools } from "./mountQueryDevtools.ts";

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

  onMount(() => {
    if (!dev || !browser) return;

    return mountQueryDevtools({
      target: ref,
      create: (m) =>
        new m.TanstackQueryDevtools({
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
        }),
    });
  });
</script>

<div class="tsqd-parent-container" bind:this={ref}></div>
