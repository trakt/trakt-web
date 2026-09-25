<script lang="ts">
  import PaginatedList from "$lib/components/lists/PaginatedList.svelte";
  import { useDiscover } from "$lib/features/filters/useDiscover";
  import * as m from "$lib/features/i18n/messages.ts";
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
    searchTerm,
  }: {
    slug: string;
    type: PersonalListType;
    sortBy?: UserListsSortBy | Nil;
    sortHow?: SortDirection | Nil;
    searchTerm?: string | Nil;
  } = $props();

  const { mode } = useDiscover();

  const terms = $derived(searchTerm?.trim() || undefined);
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
        terms,
      })}
  >
    {#snippet items(items, isLoading)}
      {#each items as list (list.id)}
        <UserList {list} type={$mode} />
      {/each}

      {#if terms && !isLoading && items.length === 0}
        <p class="lists-search-placeholder secondary">
          {m.list_placeholder_no_matching_lists()}
        </p>
      {/if}
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

    .lists-search-placeholder {
      margin: 0 var(--layout-distance-side);
    }
  }
</style>
