<script lang="ts">
  import { useIsMe } from "$lib/features/auth/stores/useIsMe";
  import type { DiscoverMode } from "$lib/features/discover/models/DiscoverMode";
  import DrilledMediaList from "../drilldown/DrilledMediaList.svelte";
  import { useFavoritesList } from "../stores/useFavoritesList";
  import SortValue from "../user/_internal/SortValue.svelte";
  import { useListSorting } from "../user/_internal/useListSorting";
  import ListSortActions from "../user/ListSortActions.svelte";
  import FavoriteMediaItem from "./_internal/FavoriteMediaItem.svelte";

  const {
    title,
    slug,
    mode,
  }: { title: string; slug: string; mode: DiscoverMode } = $props();

  const { isMe } = $derived(useIsMe(slug));

  const { current, update, options, urlBuilder } = $derived(
    useListSorting({ type: "favorites", slug }),
  );
</script>

<DrilledMediaList
  id="favorites-list-paginated-{mode}-{slug}"
  {title}
  type={mode}
  useList={(params) =>
    useFavoritesList({
      ...params,
      slug,
      sortBy: $current.sorting.value,
      sortHow: $current.sortHow,
    })}
>
  {#snippet listActions()}
    <ListSortActions
      {options}
      {urlBuilder}
      current={$current}
      onUpdate={update}
    />
  {/snippet}

  {#snippet item(media)}
    {#snippet sortTag()}
      <SortValue item={media} sortBy={$current.sorting.value} />
    {/snippet}

    <FavoriteMediaItem
      {media}
      {mode}
      isActionable={$isMe}
      style="summary"
      sortTag={$current.sorting.value ? sortTag : undefined}
    />
  {/snippet}
</DrilledMediaList>
