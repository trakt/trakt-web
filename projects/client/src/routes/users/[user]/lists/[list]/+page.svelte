<script lang="ts">
  import { useDiscover } from "$lib/features/discover/useDiscover";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import { useListSorting } from "$lib/sections/lists/user/_internal/useListSorting.ts";
  import ListActions from "$lib/sections/lists/user/ListActions.svelte";
  import ListSortActions from "$lib/sections/lists/user/ListSortActions.svelte";
  import UserListPaginatedList from "$lib/sections/lists/user/UserListPaginatedList.svelte";
  import { useUserListSummary } from "$lib/sections/lists/user/useUserListSummary.ts";
  import ResponsiveNavbarStateSetter from "$lib/sections/navbar/ResponsiveNavbarStateSetter.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets";
  import type { PageProps } from "./$types";

  const { params }: PageProps = $props();

  const { list, isLoading } = $derived(
    useUserListSummary({
      userId: params.user,
      listId: params.list,
    }),
  );

  const { mode, current: currentDiscoverMode } = useDiscover();

  const listName = $derived($list?.name ?? "");

  const { current, update, options, urlBuilder } = $derived(
    useListSorting({ list: $list, type: "user-list" }),
  );
</script>

{#snippet listActions()}
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
  <ResponsiveNavbarStateSetter
    hasFilters
    header={{
      title: listName,
      metaInfo: $currentDiscoverMode.text(),
      actions: listActions,
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
  </ResponsiveNavbarStateSetter>

  <TraktPageCoverSetter />

  {#if $list}
    <UserListPaginatedList
      list={$list}
      type={$mode}
      sortBy={$current.sorting.value}
      sortHow={$current.sortHow}
    />
  {/if}
</TraktPage>
