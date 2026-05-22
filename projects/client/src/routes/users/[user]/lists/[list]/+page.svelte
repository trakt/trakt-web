<script lang="ts">
  import { useDiscover } from "$lib/features/discover/useDiscover";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import type { ListProgress } from "$lib/sections/lists/_internal/getListProgress.ts";
  import ListProgressCardMinimal from "$lib/sections/lists/components/ListProgressCardMinimal.svelte";
  import { useListSorting } from "$lib/sections/lists/user/_internal/useListSorting";
  import ListActions from "$lib/sections/lists/user/ListActions.svelte";
  import ListSortActions from "$lib/sections/lists/user/ListSortActions.svelte";
  import UserListPaginatedList from "$lib/sections/lists/user/UserListPaginatedList.svelte";
  import { useUserListSummary } from "$lib/sections/lists/user/useUserListSummary.ts";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
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

  let progress = $state<ListProgress | null>(null);
</script>

{#snippet navbarProgress()}
  <RenderFor audience="all" device={["tablet-lg", "desktop"]}>
    {#if progress}
      <div class="trakt-list-navbar-progress">
        <ListProgressCardMinimal {progress} />
      </div>
    {/if}
  </RenderFor>
{/snippet}

{#snippet actions()}
  {#if $list}
    <ListActions list={$list} between={navbarProgress} />
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

  <TraktPageCoverSetter />

  {#if $list}
    <UserListPaginatedList
      list={$list}
      type={$mode}
      sortBy={$current.sorting.value}
      sortHow={$current.sortHow}
      onProgressChange={(next) => (progress = next)}
    />
  {/if}
</TraktPage>

<style lang="scss">
  .trakt-list-navbar-progress {
    display: flex;
    align-items: center;
    width: var(--ni-480);
    max-width: 50vw;
    min-width: var(--ni-280);
    margin: 0 var(--gap-s);
  }
</style>
