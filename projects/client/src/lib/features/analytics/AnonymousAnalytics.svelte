<script lang="ts">
  import { isSupported } from "firebase/analytics";
  import { onMount } from "svelte";
  import type { AnalyticsProps } from "./AnalyticsProps";
  import { useAnalytics } from "./useAnalytics";

  const analytics = useAnalytics();
  const { onload }: AnalyticsProps = $props();

  onMount(async () => {
    if (!(await isSupported())) {
      return;
    }

    analytics.setUserId(null);
    onload(analytics);
  });
</script>
