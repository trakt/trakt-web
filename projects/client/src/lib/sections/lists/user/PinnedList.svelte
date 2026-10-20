<script lang="ts">
  import type { DiscoverMode } from "$lib/features/filters/models/DiscoverMode.ts";
  import UserList from "./UserList.svelte";
  import { usePinnedListDismissal } from "./_internal/usePinnedListDismissal.ts";
  import { useUserListSummary } from "./useUserListSummary.ts";

  type PinnedListProps = {
    userId: string;
    listId: string;
    mode?: DiscoverMode;
  };

  const { userId, listId, mode = "media" }: PinnedListProps = $props();

  const { list, isLoading } = $derived(
    useUserListSummary({
      userId,
      listId,
    }),
  );

  const { dismiss, isDismissed } = $derived(
    usePinnedListDismissal(userId, listId),
  );
</script>

{#if !$isLoading && $list && !$isDismissed}
  <UserList list={$list} type={mode} onDismiss={dismiss} scope="pinned-list" />
{/if}
