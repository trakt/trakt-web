<script lang="ts">
  import { isSupported } from "firebase/analytics";
  import { onDestroy, onMount } from "svelte";
  import { useAuth } from "../auth/stores/useAuth";
  import { useUser } from "../auth/stores/useUser";
  import type { AnalyticsProps } from "./AnalyticsProps";
  import { useAnalytics } from "./useAnalytics";

  const { onload }: AnalyticsProps = $props();

  const analytics = useAnalytics();
  const { user } = useUser();
  const { isAuthorized } = useAuth();

  let unsubscribe = $state(() => {});

  onMount(async () => {
    if (!(await isSupported())) {
      return;
    }

    unsubscribe = user.subscribe((user) => {
      if (!user) {
        return;
      }

      const userId = isAuthorized ? user.id : null;
      analytics.setUserId(userId);
      onload(analytics);
    });
  });

  onDestroy(() => {
    unsubscribe();
  });
</script>
