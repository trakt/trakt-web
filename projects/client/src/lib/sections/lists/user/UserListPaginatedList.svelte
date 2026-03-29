<script lang="ts">
  import Tooltip from "$lib/components/tooltip/Tooltip.svelte";
  import { useFilter } from "$lib/features/filters/useFilter";
  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import DrilledMediaList from "../drilldown/DrilledMediaList.svelte";
  import SortValue from "./_internal/SortValue.svelte";
  import UserListItem from "./_internal/UserListItem.svelte";
  import ListActions from "./ListActions.svelte";
  import type { SortBy } from "./models/SortBy";
  import type { SortDirection } from "./models/SortDirection";
  import { useListItems } from "./useListItems";

  type UserListProps = {
    title: string;
    type?: MediaType;
    list: MediaListSummary;
    sortBy?: SortBy;
    sortHow?: SortDirection;
  };

  const { title, type, list, sortBy, sortHow }: UserListProps = $props();

  const { filterMap } = useFilter();

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

  {#snippet item(media)}
    {#snippet sortTag()}
      <SortValue item={media} {sortBy} />
    {/snippet}

    <UserListItem
      listedItem={media}
      style="summary"
      {list}
      sortTag={sortBy ? sortTag : undefined}
    />
  {/snippet}
</DrilledMediaList>

<style>
  .trakt-list-actions {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
  }
</style>
