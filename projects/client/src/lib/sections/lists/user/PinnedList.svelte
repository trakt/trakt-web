<script lang="ts">
  import type { DiscoverMode } from "$lib/features/discover/models/DiscoverMode.ts";
  import UserList from "./UserList.svelte";
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
</script>

{#if !$isLoading && $list}
  <div class="trakt-pinned-list">
    <UserList list={$list} type={mode} />
  </div>
{/if}

<style>
  .trakt-pinned-list {
    display: flex;
    flex-direction: column;
    gap: var(--gap-micro);
  }
</style>
