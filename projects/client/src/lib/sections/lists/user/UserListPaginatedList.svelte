<script lang="ts">
  import type { DiscoverMode } from "$lib/features/filters/models/DiscoverMode";
  import { useFilter } from "$lib/features/filters/useFilter";
  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary";
  import DrilledMediaList from "../drilldown/DrilledMediaList.svelte";
  import SortValue from "./_internal/SortValue.svelte";
  import UserListItem from "./_internal/UserListItem.svelte";
  import type { ListSortProps } from "./models/ListSortProps";
  import { useListItems } from "./useListItems";
  import { useSort } from "./useSort";

  type UserListProps = {
    type?: DiscoverMode;
    list: MediaListSummary;
  } & ListSortProps;

  const { type, list, sortBy, sortHow }: UserListProps = $props();

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
  {#snippet item(media)}
    {#snippet sortTag()}
      <SortValue item={media} {sortBy} />
    {/snippet}

    <UserListItem
      listedItem={media}
      style="summary"
      {list}
      sortTag={sort.toTag(sortTag)}
    />
  {/snippet}
</DrilledMediaList>
