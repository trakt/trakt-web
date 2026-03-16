<script lang="ts">
  import type { DiscoverMode } from "$lib/features/discover/models/DiscoverMode.ts";
  import { useQuery } from "$lib/features/query/useQuery.ts";
  import { userListSummaryQuery } from "$lib/requests/queries/users/userListSummaryQuery.ts";
  import UserList from "./UserList.svelte";

  type PinnedListProps = {
    userId: string;
    listId: string;
    mode?: DiscoverMode;
  };

  const { userId, listId, mode }: PinnedListProps = $props();

  const query = useQuery(userListSummaryQuery({ userId, listId }));
</script>

{#if $query && $query.data}
  <div class="trakt-pinned-list">
    <UserList list={$query.data} type={mode} />
  </div>
{/if}

<style>
  .trakt-pinned-list {
    display: flex;
    flex-direction: column;
    gap: var(--gap-micro);
  }
</style>
