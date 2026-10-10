<script lang="ts">
  import { useUser } from "$lib/features/auth/stores/useUser.ts";
  import { useDiscover } from "$lib/features/filters/useDiscover";
  import { useListSelection } from "$lib/features/list-selection/useListSelection.ts";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import ListMeta from "$lib/sections/lists/components/ListMeta.svelte";
  import BulkListEditBar from "$lib/sections/lists/user/BulkListEditBar.svelte";
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
  const { user } = useUser();
  const selection = useListSelection();

  const listName = $derived($list?.name ?? "");
  const isMissing = $derived(!$isLoading && $list == null);
  const isOwner = $derived(
    Boolean($user?.slug) && $user.slug === $list?.user?.slug,
  );

  const { current, options, urlBuilder } = $derived(
    useListSorting({ list: $list, type: "user-list" }),
  );

  // Bulk-selection state is a shared singleton (see listSelectionStore.svelte.ts),
  // not scoped to this page's component tree - clear it whenever the viewed
  // list changes, and when navigating away entirely, so an edit session never
  // leaks from one list onto the next.
  $effect(() => {
    void params.user;
    void params.list;

    return () => selection.reset();
  });
</script>

{#snippet listActions()}
  {#if $list}
    <ListActions list={$list} editable={isOwner} />
  {/if}
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
    hasFilters
    header={{
      title: listName,
      metaInfo: $list ? listMetaInfo : $currentDiscoverMode.text(),
      actions: listActions,
    }}
  >
    {#snippet headerActions()}
      <ListSortActions
        {options}
        {urlBuilder}
        current={$current}
        disabled={$isLoading}
      />
    {/snippet}
  </ResponsiveNavbarStateSetter>

  <TraktPageCoverSetter />

  {#if $list}
    {#if isOwner}
      <BulkListEditBar list={$list} />
    {/if}

    <UserListPaginatedList
      list={$list}
      type={$mode}
      sortBy={$current.sorting.value}
      sortHow={$current.sortHow}
      isEditable={isOwner}
    />
  {/if}
</TraktPage>
