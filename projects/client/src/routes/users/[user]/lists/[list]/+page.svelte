<script lang="ts">
  import { page } from "$app/state";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import ListSortActions from "$lib/sections/lists/user/ListSortActions.svelte";
  import type { Sorting } from "$lib/sections/lists/user/models/Sorting.ts";
  import UserListPaginatedList from "$lib/sections/lists/user/UserListPaginatedList.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/constants";
  import { writable } from "svelte/store";
  import type { PageProps } from "./$types";
  import { mapToMediaType } from "./_internal/mapToMediaType";
  import { userListSummary } from "./userListSummary.ts";

  const { params }: PageProps = $props();

  const { list } = $derived(
    userListSummary({
      userId: params.user,
      listId: params.list,
    }),
  );

  const type = $derived(mapToMediaType(page.url.searchParams));
  const listName = $derived($list?.name ?? "");

  // TODO: search params
  const sorting = writable<Sorting | null>(null);
</script>

<TraktPage
  audience="all"
  image={DEFAULT_SHARE_COVER}
  title={listName}
  hasDynamicContent={true}
>
  <NavbarStateSetter hasFilters>
    {#snippet contextualActions()}
      <ListSortActions
        onSort={sorting.set}
        sortHow={$list?.sortHow}
        sortBy={$list?.sortBy}
      />
    {/snippet}
  </NavbarStateSetter>

  <TraktPageCoverSetter />

  {#if $list}
    <UserListPaginatedList
      title={listName}
      list={$list}
      {type}
      sorting={$sorting}
    />
  {/if}
</TraktPage>
