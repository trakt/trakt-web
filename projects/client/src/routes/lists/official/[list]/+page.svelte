<script lang="ts">
  import { useDiscover } from "$lib/features/discover/useDiscover";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import { useListSorting } from "$lib/sections/lists/user/_internal/useListSorting";
  import ListActions from "$lib/sections/lists/user/ListActions.svelte";
  import ListSortActions from "$lib/sections/lists/user/ListSortActions.svelte";
  import UserListPaginatedList from "$lib/sections/lists/user/UserListPaginatedList.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets";
  import type { PageProps } from "../[list]/$types";
  import { useListSummary } from "./useListSummary";

  const { params }: PageProps = $props();

  const { mode, current: currentDiscoverMode } = useDiscover();

  const { list, isLoading } = $derived(
    useListSummary({
      listId: params.list,
    }),
  );

  const listName = $derived($list?.name ?? "");

  const { current, update, options, urlBuilder } = $derived(
    useListSorting({ list: $list, type: "user-list" }),
  );
</script>

{#snippet actions()}
  {#if $list}
    <ListActions list={$list} />
  {/if}
{/snippet}

<TraktPage
  audience="all"
  image={DEFAULT_SHARE_COVER}
  title={listName}
  hasDynamicContent={true}
>
  <TraktPageCoverSetter />

  <NavbarStateSetter
    hasFilters
    header={{
      title: listName,
      metaInfo: $currentDiscoverMode.text(),
      actions,
    }}
  >
    {#snippet headerActions()}
      <ListSortActions
        {options}
        {urlBuilder}
        current={$current}
        onUpdate={update}
        disabled={$isLoading}
      />
    {/snippet}
  </NavbarStateSetter>

  {#if !$isLoading}
    <UserListPaginatedList
      list={$list!}
      type={$mode}
      sortBy={$current.sorting.value}
      sortHow={$current.sortHow}
    />
  {/if}
</TraktPage>
