<script lang="ts">
  import DevtoolsDrawer from "./_internal/DevtoolsDrawer.svelte";
  import QueryDevtoolsPanel from "./_internal/QueryDevtoolsPanel.svelte";
  import { devtoolsStore } from "./devtoolsStore.ts";
</script>

{#if $devtoolsStore.isDrawerOpen}
  <DevtoolsDrawer
    onClose={devtoolsStore.closeDrawer}
    onSelect={devtoolsStore.openTool}
  />
{/if}

{#if $devtoolsStore.activeTool === "query"}
  <QueryDevtoolsPanel onClose={devtoolsStore.closeTool} />
{/if}
