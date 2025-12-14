<script lang="ts">
  import { useAuth } from "$lib/features/auth/stores/useAuth";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import { isSupported } from "firebase/analytics";
  import { filter, switchMap } from "rxjs/operators";
  import { onMount } from "svelte";
  import type { AnalyticsProps } from "./AnalyticsProps";

  const { onload }: AnalyticsProps = $props();

  const { user } = useUser();
  const { isAuthorized } = useAuth();

  onMount(async () => {
    if (!(await isSupported())) {
      return;
    }

    const subscription = isAuthorized
      .pipe(
        filter((isAuthed) => isAuthed),
        switchMap(() => user),
        filter(Boolean),
      )
      .subscribe((user) => {
        const userId = `${user.id}`;

        onload(userId);
      });

    subscription.unsubscribe();
  });
</script>
