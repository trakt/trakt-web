<script lang="ts">
  import { useUser } from "$lib/features/auth/stores/useUser";
  import MarkAsWatchedAction from "$lib/sections/media-actions/mark-as-watched/MarkAsWatchedAction.svelte";
  import { useIsWatched } from "$lib/sections/media-actions/mark-as-watched/useIsWatched";
  import type { MarkAsWatchedStoreProps } from "$lib/sections/media-actions/mark-as-watched/useMarkAsWatched";

  type WatchAgainProps = {
    title: string;
  } & MarkAsWatchedStoreProps;

  const { title, ...target }: WatchAgainProps = $props();

  const { isWatched } = $derived(useIsWatched(target));
  const { user } = useUser();
  // TODO: get rid of refactor, move logic to MarkAsWatchedAction; should be centralized there
</script>

{#if $user.preferences.hasWatchAgain && $isWatched}
  <MarkAsWatchedAction style="dropdown-item" mode="ask" {title} {...target} />
{/if}
