<script lang="ts">
  import type { DiscoverMode } from "$lib/features/filters/models/DiscoverMode";
  import { useFilter } from "$lib/features/filters/useFilter";
  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary";
  import SelectableListItem from "$lib/sections/lists/components/SelectableListItem.svelte";
  import DrilledMediaList from "../drilldown/DrilledMediaList.svelte";
  import AddFromListsEmptyState from "./_internal/bulk-add/AddFromListsEmptyState.svelte";
  import AddFromListsTile from "./_internal/bulk-add/AddFromListsTile.svelte";
  import { listItemTitle } from "./_internal/listItemTitle.ts";
  import SortValue from "./_internal/SortValue.svelte";
  import UserListItem from "./_internal/UserListItem.svelte";
  import type { ListSortProps } from "./models/ListSortProps";
  import { useListItems } from "./useListItems";
  import { useSort } from "./useSort";

  type UserListProps = {
    type?: DiscoverMode;
    list: MediaListSummary;
    isEditable?: boolean;
  } & ListSortProps;

  const { type, list, sortBy, sortHow, isEditable = false }: UserListProps =
    $props();

  const { filterMap } = useFilter();
  const sort = $derived(useSort(sortBy));

  const listCacheId = $derived.by(() => {
    const sortKey = `${sortBy}-${sortHow}`;

    if (list.user?.slug) {
      return `${list.user.slug}-${list.slug}-${sortKey}`;
    }

    return `${list.id}-${sortKey}`;
  });
</script>

<DrilledMediaList
  id={`user-paginated-list-${listCacheId}`}
  {type}
  filter={$filterMap}
  useList={(params) =>
    useListItems({
      list,
      sortBy,
      sortHow,
      ...params,
    })}
  groupBy={sort.groupBy}
>
  {#snippet ctaItem()}
    <AddFromListsTile {list} />
  {/snippet}

  {#snippet empty()}
    <AddFromListsEmptyState {list} />
  {/snippet}

  {#snippet item(media)}
    {#snippet sortTag()}
      <SortValue item={media} {sortBy} />
    {/snippet}

    {#snippet listItem()}
      <UserListItem
        listedItem={media}
        style="summary"
        {list}
        sortTag={sort.toTag(sortTag)}
      />
    {/snippet}

    {#if isEditable}
      <SelectableListItem item={media} title={listItemTitle(media)}>
        {@render listItem()}
      </SelectableListItem>
    {:else}
      {@render listItem()}
    {/if}
  {/snippet}
</DrilledMediaList>
