<script lang="ts">
  import { useDiscover } from "$lib/features/filters/useDiscover";
  import { useFilter } from "$lib/features/filters/useFilter.ts";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import ListMeta from "$lib/sections/lists/components/ListMeta.svelte";
  import { useListSorting } from "$lib/sections/lists/user/_internal/useListSorting.ts";
  import ListPopupMenu from "$lib/sections/lists/user/ListPopupMenu.svelte";
  import ListSortActions from "$lib/sections/lists/user/ListSortActions.svelte";
  import { useListItemCount } from "$lib/sections/lists/user/useListItemCount.ts";
  import UserListPaginatedList from "$lib/sections/lists/user/UserListPaginatedList.svelte";
  import ResponsiveNavbarStateSetter from "$lib/sections/navbar/ResponsiveNavbarStateSetter.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets";
  import { DEFAULT_DRILL_SIZE } from "$lib/utils/constants.ts";
  import type { PageProps } from "../[list]/$types";
  import { useListSummary } from "./useListSummary";

  const { params }: PageProps = $props();

  const { mode, current: currentDiscoverMode } = useDiscover();
  const { filterMap } = useFilter();

  const { list, isLoading } = $derived(
    useListSummary({
      listId: params.list,
    }),
  );

  const listName = $derived($list?.name ?? "");

  const { current, update, options, urlBuilder } = $derived(
    useListSorting({ list: $list, type: "user-list" }),
  );

  const { itemCount } = $derived(
    useListItemCount({
      list: $list,
      type: $mode,
      filter: $filterMap,
      sortBy: $current.sorting.value,
      sortHow: $current.sortHow,
      limit: DEFAULT_DRILL_SIZE,
    }),
  );

</script>

{#snippet actions()}
  {#if $list}
    <ListPopupMenu list={$list} />
  {/if}
{/snippet}

{#snippet listMetaInfo()}
  {#if $list}
    <ListMeta
      list={$list}
      itemCount={$itemCount?.count ?? $list.count}
      isPartialCount={$itemCount?.isPartial ?? false}
      metaText={$currentDiscoverMode.text()}
      showOwner={false}
    />
  {/if}
{/snippet}

<TraktPage
  audience="all"
  image={DEFAULT_SHARE_COVER}
  title={listName}
  hasDynamicContent={true}
>
  <TraktPageCoverSetter />

  <ResponsiveNavbarStateSetter
    hasFilters
    header={{
      title: listName,
      metaInfo: $list ? listMetaInfo : $currentDiscoverMode.text(),
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
  </ResponsiveNavbarStateSetter>

  {#if !$isLoading && $list}
    <UserListPaginatedList
      list={$list}
      type={$mode}
      sortBy={$current.sorting.value}
      sortHow={$current.sortHow}
    />
  {/if}
</TraktPage>
