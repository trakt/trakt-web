<script lang="ts">
  import DevtoolsDrawer from "./_internal/DevtoolsDrawer.svelte";
  import QueryDevtoolsPanel from "./_internal/QueryDevtoolsPanel.svelte";
  import { devtoolsStore } from "./devtoolsStore.ts";
</script>

{#if $devtoolsStore.isDrawerOpen}
  <DevtoolsDrawer onClose={devtoolsStore.closeDrawer} />
{/if}

{#if $devtoolsStore.activeTool === "query"}
  <QueryDevtoolsPanel onClose={devtoolsStore.closeTool} />
{/if}
