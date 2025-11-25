<script lang="ts">
  import { page } from "$app/state";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import ListSortActions from "$lib/sections/lists/user/ListSortActions.svelte";
  import type { Sorting } from "$lib/sections/lists/user/models/Sorting";
  import UserListPaginatedList from "$lib/sections/lists/user/UserListPaginatedList.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/constants";
  import { writable } from "svelte/store";
  import { mapToMediaType } from "../../../users/[user]/lists/[list]/_internal/mapToMediaType";
  import type { PageProps } from "./$types";
  import { useListSummary } from "./useListSummary";

  const { params }: PageProps = $props();

  const type = $derived(mapToMediaType(page.url.searchParams));

  const { list, isLoading } = $derived(
    useListSummary({
      listId: params.id,
    }),
  );

  const listName = $derived($list?.name ?? "");
  const sorting = writable<Sorting | null>(null);
</script>

<TraktPage
  audience="all"
  image={DEFAULT_SHARE_COVER}
  title={listName}
  hasDynamicContent={true}
>
  <TraktPageCoverSetter />

  <NavbarStateSetter hasFilters>
    {#snippet contextualActions()}
      <ListSortActions
        onSort={sorting.set}
        sortHow={$list?.sortHow}
        sortBy={$list?.sortBy}
      />
    {/snippet}
  </NavbarStateSetter>

  {#if !$isLoading}
    <UserListPaginatedList
      title={listName}
      list={$list!}
      {type}
      sorting={$sorting}
    />
  {/if}
</TraktPage>
