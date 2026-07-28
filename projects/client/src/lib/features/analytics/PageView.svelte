<script lang="ts">
  import { page } from "$app/state";
  import { onMount } from "svelte";
  import { AnalyticsEvent } from "./events/AnalyticsEvent";
  import { useTrack } from "./useTrack";

  const { track } = useTrack(AnalyticsEvent.PageView);

  // `route.id` only, never a pathname: HAL cannot tell a template from a real
  // path, so a pathname would store user slugs. Null on unmatched routes.
  onMount(() => {
    const route = page.route.id;

    if (!route) {
      return;
    }

    track({ route });
  });
</script>
