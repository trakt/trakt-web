<script lang="ts">
  import { page } from "$app/state";
  import AnalyticsLoader from "./_internal/AnalyticsLoader.svelte";
  import { useAnalytics } from "./useAnalytics";

  const eventName = "page_view";

  const analytics = useAnalytics();

  const record = async (userId: string | Nil) => {
    analytics.setUserId(userId);

    analytics.record(eventName, {
      page_location: page.url.href,
      page_path: page.url.pathname,
    });
  };
</script>

<AnalyticsLoader onload={record} />
