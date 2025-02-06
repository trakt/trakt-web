<script lang="ts">
  import { useAuth } from "$lib/features/auth/stores/useAuth";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import { isSupported } from "firebase/analytics";
  import { onDestroy, onMount } from "svelte";
  import { get } from "svelte/store";
  import type { AnalyticsProps } from "./AnalyticsProps";

  const { onload }: AnalyticsProps = $props();

  const { user } = useUser();
  const { isAuthorized } = useAuth();

  let unsubscribe: (() => void) | undefined;

  onMount(async () => {
    if (!(await isSupported())) {
      return;
    }

    unsubscribe = user.subscribe((user) => {
      if (!user) {
        return;
      }
      const userId = get(isAuthorized) ? `${user.id}` : null;

      onload(userId);
    });
  });

  onDestroy(() => {
    unsubscribe?.();
  });
</script>
