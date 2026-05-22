<script lang="ts">
  import Tooltip from "$lib/components/tooltip/Tooltip.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import type { DiscoverMode } from "$lib/features/discover/models/DiscoverMode";
  import { useFilter } from "$lib/features/filters/useFilter";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary";
  import {
    getListProgress,
    type ListProgress,
  } from "../_internal/getListProgress.ts";
  import ListProgressCardMinimal from "../components/ListProgressCardMinimal.svelte";
  import DrilledMediaList from "../drilldown/DrilledMediaList.svelte";
  import ListProgressBridge from "./_internal/ListProgressBridge.svelte";
  import SortValue from "./_internal/SortValue.svelte";
  import UserListItem from "./_internal/UserListItem.svelte";
  import type { ListSortProps } from "./models/ListSortProps";
  import { useListItems } from "./useListItems";
  import { useSort } from "./useSort";

  type UserListProps = {
    type?: DiscoverMode;
    list: MediaListSummary;
    onProgressChange?: (progress: ListProgress) => void;
  } & ListSortProps;

  const {
    type,
    list,
    sortBy,
    sortHow,
    onProgressChange,
  }: UserListProps = $props();

  const { filterMap } = useFilter();
  const { history } = useUser();
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
  {#snippet listActions()}
    <div class="trakt-list-actions">
      {#if list.description}
        <Tooltip content={list.description}>
          <span class="secondary ellipsis">{list.description}</span>
        </Tooltip>
      {/if}
    </div>
  {/snippet}

  {#snippet beforeItems(items)}
    {@const progress = getListProgress(items, $history)}
    <RenderFor audience="all" device={["mobile", "tablet-sm"]}>
      <ListProgressCardMinimal {progress} />
    </RenderFor>
    {#if onProgressChange}
      <ListProgressBridge {progress} {onProgressChange} />
    {/if}
  {/snippet}

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

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-list-actions {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
  }
</style>
