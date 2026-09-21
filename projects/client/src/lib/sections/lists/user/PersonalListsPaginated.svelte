<script lang="ts">
  import PaginatedList from "$lib/components/lists/PaginatedList.svelte";
  import { useIsMe } from "$lib/features/auth/stores/useIsMe.ts";
  import { useDiscover } from "$lib/features/filters/useDiscover";
  import type { UserListsSortBy } from "$lib/requests/models/UserListsSortBy.ts";
  import { DEFAULT_LISTS_DRILL_SIZE } from "$lib/utils/constants";
  import type { PersonalListType } from "./models/PersonalListType";
  import type { SortDirection } from "./models/SortDirection";
  import LeaveCollaborationButton from "./_internal/LeaveCollaborationButton.svelte";
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
  const { isMe } = $derived(useIsMe(slug));
  const canLeave = $derived(type === "collaboration" && $isMe);
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
        {#snippet popupActions()}
          <LeaveCollaborationButton {list} />
        {/snippet}

        <UserList
          {list}
          type={$mode}
          popupActions={canLeave ? popupActions : undefined}
        />
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
