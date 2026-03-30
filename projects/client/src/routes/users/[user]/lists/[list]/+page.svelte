<script lang="ts">
  import { page } from "$app/state";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import { useListSorting } from "$lib/sections/lists/user/_internal/useListSorting";
  import ListActions from "$lib/sections/lists/user/ListActions.svelte";
  import ListSortActions from "$lib/sections/lists/user/ListSortActions.svelte";
  import UserListPaginatedList from "$lib/sections/lists/user/UserListPaginatedList.svelte";
  import { useUserListSummary } from "$lib/sections/lists/user/useUserListSummary.ts";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets";
  import type { PageProps } from "./$types";
  import { mapToMediaType } from "./_internal/mapToMediaType";

  const { params }: PageProps = $props();

  const { list, isLoading } = $derived(
    useUserListSummary({
      userId: params.user,
      listId: params.list,
    }),
  );

  const { type, text } = $derived(mapToMediaType(page.url.searchParams));
  const listName = $derived($list?.name ?? "");

  const { current, update, options, urlBuilder } = $derived(
    useListSorting({ list: $list, type }),
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
  <NavbarStateSetter
    hasFilters
    header={{
      title: listName,
      metaInfo: text,
      actions,
    }}
  >
    {#snippet sortActions()}
      <ListSortActions
        {options}
        {urlBuilder}
        current={$current}
        onUpdate={update}
        disabled={$isLoading}
      />
    {/snippet}
  </NavbarStateSetter>

  <TraktPageCoverSetter />

  {#if $list}
    <UserListPaginatedList
      list={$list}
      {type}
      sortBy={$current.sorting.value}
      sortHow={$current.sortHow}
    />
  {/if}
</TraktPage>
