<script lang="ts">
  import { page } from "$app/state";
  import AnalyticsLoader from "./_internal/loader/AnalyticsLoader.svelte";
  import { useAnalytics } from "./useAnalytics";

  const eventName = "page_view";

  const { setUser, record } = useAnalytics();

  const recordPageView = async (userId: string | Nil) => {
    setUser(userId);
    record(eventName, {
      page_location: page.url.href,
      page_path: page.url.pathname,
    });
  };
</script>

<AnalyticsLoader onload={recordPageView} />
