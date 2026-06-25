<script lang="ts">
  import PaginatedList from "$lib/components/lists/PaginatedList.svelte";
  import { useDiscover } from "$lib/features/filters/useDiscover";
  import type { UserListsSortBy } from "$lib/requests/models/UserListsSortBy.ts";
  import { DEFAULT_LISTS_DRILL_SIZE } from "$lib/utils/constants";
  import type { PersonalListType } from "./models/PersonalListType";
  import type { SortDirection } from "./models/SortDirection";
  import { usePersonalListsSummary } from "./usePersonalListsSummary";
  import UserList from "./UserList.svelte";

  const {
    slug,
    type,
    sortBy,
    sortHow,
  }: {
    slug: string;
    type: PersonalListType;
    sortBy?: UserListsSortBy | Nil;
    sortHow?: SortDirection | Nil;
  } = $props();

  const { mode } = useDiscover();
</script>

<div class="trakt-paginated-lists">
  <PaginatedList
    {type}
    useList={(params) =>
      usePersonalListsSummary({
        ...params,
        slug,
        limit: DEFAULT_LISTS_DRILL_SIZE,
        sortBy,
        sortHow,
      })}
  >
    {#snippet items(items)}
      {#each items as list (list.id)}
        <UserList {list} type={$mode} />
      {/each}
    {/snippet}
  </PaginatedList>
</div>

<style>
  .trakt-paginated-lists {
    display: contents;

    :global(.trakt-paginated-list) {
      display: flex;
      flex-direction: column;
      gap: var(--content-gap);
    }
  }
</style>
