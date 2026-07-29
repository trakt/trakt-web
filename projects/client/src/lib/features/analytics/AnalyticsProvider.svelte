<script lang="ts">
  import { useUser } from "$lib/features/auth/stores/useUser";
  import { onDestroy, setContext } from "svelte";
  import { createHalEngine } from "./_internal/createHalEngine";
  import { getUserAnalyticsData } from "./_internal/getUserAnalyticsData";
  import { ANALYTICS_CONTEXT } from "./useAnalytics";

  const { children }: ChildrenProps = $props();

  const { user } = useUser();

  // Enriched here, not in `useTrack`: callers that record straight through
  // `useAnalytics` would otherwise carry no user context.
  const engine = createHalEngine({
    enrich: () => getUserAnalyticsData($user),
  });

  setContext(ANALYTICS_CONTEXT, engine);

  onDestroy(engine.destroy);
</script>

{@render children()}
