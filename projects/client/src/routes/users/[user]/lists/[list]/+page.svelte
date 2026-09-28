<script lang="ts">
  import { useDiscover } from "$lib/features/filters/useDiscover";
  import * as m from "$lib/features/i18n/messages.ts";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import ListMeta from "$lib/sections/lists/components/ListMeta.svelte";
  import { useListSorting } from "$lib/sections/lists/user/_internal/useListSorting.ts";
  import ListActions from "$lib/sections/lists/user/ListActions.svelte";
  import ListSearchButton from "$lib/sections/lists/user/ListSearchButton.svelte";
  import ListSearchInput from "$lib/sections/lists/user/ListSearchInput.svelte";
  import ListSearchLayout from "$lib/sections/lists/user/ListSearchLayout.svelte";
  import ListSortActions from "$lib/sections/lists/user/ListSortActions.svelte";
  import type { ListSearchCopy } from "$lib/sections/lists/user/models/ListSearchCopy.ts";
  import UserListPaginatedList from "$lib/sections/lists/user/UserListPaginatedList.svelte";
  import { useListSearch } from "$lib/sections/lists/user/useListSearch.svelte.ts";
  import { useUserListSummary } from "$lib/sections/lists/user/useUserListSummary.ts";
  import ResponsiveNavbarStateSetter from "$lib/sections/navbar/ResponsiveNavbarStateSetter.svelte";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
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
  const isMissing = $derived(!$isLoading && $list == null);

  const { current, options, urlBuilder } = $derived(
    useListSorting({ list: $list, type: "user-list" }),
  );

  const search = useListSearch();
  const searchCopy: ListSearchCopy = {
    toggle: m.button_label_search_list_items(),
    label: m.input_label_search_list_items(),
    placeholder: m.input_placeholder_search_list_items(),
  };

  // Desktop hosts the search field inside the navbar's content toggle, the
  // same panel the search page uses. Smaller screens hide that toggle, so
  // they get the standalone field above the items instead.
  const isDesktop = useMedia(WellKnownMediaQuery.desktop);
  const hasSearchExtension = $derived(search.isOpen && $isDesktop);
</script>

{#snippet listActions()}
  {#if $list}
    <ListActions list={$list} />
  {/if}
{/snippet}

{#snippet listSearchExtension()}
  <ListSearchInput {search} copy={searchCopy} variant="embedded" />
{/snippet}

{#snippet listMetaInfo()}
  {#if $list}
    <ListMeta
      list={$list}
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
  isIndexable={!isMissing}
>
  <ResponsiveNavbarStateSetter contentToggle="discover"
    contentToggleExtension={hasSearchExtension ? listSearchExtension : null}
    hasFilters
    header={{
      title: listName,
      metaInfo: $list ? listMetaInfo : $currentDiscoverMode.text(),
      actions: listActions,
    }}
  >
    {#snippet headerActions()}
      <ListSearchButton
        copy={searchCopy}
        isActive={search.isOpen}
        onclick={search.toggle}
      />
      <ListSortActions
        {options}
        urlBuilder={(sortParams) =>
          urlBuilder({ ...sortParams, terms: search.filter })}
        current={$current}
        disabled={$isLoading}
      />
    {/snippet}
  </ResponsiveNavbarStateSetter>

  <TraktPageCoverSetter />

  {#if $list}
    <ListSearchLayout {search} copy={searchCopy} isEmbedded={$isDesktop}>
      <UserListPaginatedList
        list={$list}
        type={$mode}
        sortBy={$current.sorting.value}
        sortHow={$current.sortHow}
        searchTerm={search.filter}
      />
    </ListSearchLayout>
  {/if}
</TraktPage>

