<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import CloseIcon from "$lib/components/icons/CloseIcon.svelte";
  import { useQueryClient } from "$lib/features/query/_internal/queryClientContext.ts";
  import { onlineManager } from "@tanstack/query-core";
  import type { TanstackQueryDevtoolsPanel } from "@tanstack/query-devtools";
  import { onMount } from "svelte";

  const { onClose }: { onClose: () => void } = $props();

  const client = useQueryClient();

  let ref: HTMLDivElement;

  onMount(() => {
    let panel: TanstackQueryDevtoolsPanel | undefined;
    let isCancelled = false;

    import("@tanstack/query-devtools").then((m) => {
      if (isCancelled) return;

      panel = new m.TanstackQueryDevtoolsPanel({
        client,
        queryFlavor: "Svelte Query",
        version: "5",
        onlineManager,
        onClose,
      });
      panel.mount(ref);
    });

    return () => {
      isCancelled = true;
      panel?.unmount();
    };
  });
</script>

<section class="trakt-query-devtools-panel">
  <header class="panel-header">
    <span class="bold">TanStack Query</span>
    <ActionButton label="Close devtools" style="ghost" onclick={onClose}>
      <CloseIcon />
    </ActionButton>
  </header>

  <div class="panel-content" bind:this={ref}></div>
</section>

<style lang="scss">
  .trakt-query-devtools-panel {
    position: fixed;
    inset-inline-start: var(--layout-sidebar-distance);
    inset-inline-end: 0;
    bottom: 0;
    z-index: var(--layer-top);

    display: flex;
    flex-direction: column;

    height: min(50dvh, var(--ni-480));

    background: var(--color-floating-background);
  }

  .panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--gap-s);

    padding: var(--gap-xs) var(--gap-s);
  }

  .panel-content {
    flex: 1;
    min-height: 0;
  }
</style>
