<script lang="ts">
  import { setContext } from "svelte";
  import { initialize } from "./_internal/initialize";
  import { ANALYTICS_CONTEXT } from "./useAnalytics";

  const { children }: ChildrenProps = $props();

  setContext(ANALYTICS_CONTEXT, initialize());
</script>

{@render children()}
