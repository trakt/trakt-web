<script lang="ts">
  import { isSupported } from "firebase/analytics";
  import { onMount } from "svelte";
  import { useUser } from "../auth/stores/useUser";
  import { useAnalytics } from "./useAnalytics";

  const eventName = "page_view";

  const analytics = useAnalytics();
  const user = useUser();

  onMount(async () => {
    if (!(await isSupported())) {
      return;
    }

    const userId = (() => {
      try {
        return user.current().id;
      } catch {
        return null;
      }
    })();

    analytics.setUserId(userId);

    analytics.record(eventName, {
      page_location: window.location.href,
      page_path: window.location.pathname,
    });
  });
</script>
