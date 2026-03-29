<script lang="ts">
  import { useIsMe } from "$lib/features/auth/stores/useIsMe";
  import type { DiscoverMode } from "$lib/features/discover/models/DiscoverMode";
  import DrilledMediaList from "../drilldown/DrilledMediaList.svelte";
  import { useFavoritesList } from "../stores/useFavoritesList";
  import SortValue from "../user/_internal/SortValue.svelte";
  import type { SortBy } from "../user/models/SortBy";
  import type { SortDirection } from "../user/models/SortDirection";
  import FavoriteMediaItem from "./_internal/FavoriteMediaItem.svelte";

  type FavoritesProps = {
    title: string;
    slug: string;
    mode: DiscoverMode;
    sortBy?: SortBy;
    sortHow?: SortDirection;
  };

  const { title, slug, mode, sortBy, sortHow }: FavoritesProps = $props();

  const { isMe } = $derived(useIsMe(slug));
</script>

<DrilledMediaList
  id="favorites-list-paginated-{mode}-{slug}"
  {title}
  type={mode}
  useList={(params) =>
    useFavoritesList({
      ...params,
      slug,
      sortBy,
      sortHow,
    })}
>
  {#snippet item(media)}
    {#snippet sortTag()}
      <SortValue item={media} {sortBy} />
    {/snippet}

    <FavoriteMediaItem
      {media}
      {mode}
      isActionable={$isMe}
      style="summary"
      sortTag={sortBy ? sortTag : undefined}
    />
  {/snippet}
</DrilledMediaList>
