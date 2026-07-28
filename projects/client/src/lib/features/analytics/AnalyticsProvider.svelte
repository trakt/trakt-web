<script lang="ts">
  import { setContext } from "svelte";
  import { createHalEngine } from "./_internal/createHalEngine";
  import { ANALYTICS_CONTEXT } from "./useAnalytics";

  const { children }: ChildrenProps = $props();

  // No consent gate: HAL stores no identifier, no IP and no user id, so there is
  // nothing here for a cookie banner to gate.
  setContext(ANALYTICS_CONTEXT, createHalEngine());
</script>

{@render children()}
