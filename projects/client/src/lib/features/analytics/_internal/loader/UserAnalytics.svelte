<script lang="ts">
  import { useAuth } from "$lib/features/auth/stores/useAuth";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import { sha256 } from "$lib/utils/string/sha256";
  import { isSupported } from "firebase/analytics";
  import { from } from "rxjs";
  import { filter, map, switchMap, tap } from "rxjs/operators";
  import { onMount } from "svelte";
  import type { AnalyticsProps } from "./AnalyticsProps";

  const { onload }: AnalyticsProps = $props();

  const { user } = useUser();
  const { isAuthorized } = useAuth();

  onMount(() => {
    const subscription = from(isSupported())
      .pipe(
        filter((supported) => supported),
        switchMap(() => isAuthorized),
        filter((isAuthed) => isAuthed),
        switchMap(() => user),
        filter(Boolean),
        map((user) => `${user.id}`),
        tap((userId) => onload(userId)),
        switchMap((userId) => sha256(userId)),
        filter(() => typeof window !== "undefined" && "rdt" in window),
        tap((hashedExternalId) => {
          // @ts-expect-error - rdt is added by the reddit pixel
          window.rdt("init", "a2_i1ea6gxvoudq", {
            external_id: hashedExternalId,
          });
        }),
      )
      .subscribe();

    return () => {
      subscription?.unsubscribe();
    };
  });
</script>
