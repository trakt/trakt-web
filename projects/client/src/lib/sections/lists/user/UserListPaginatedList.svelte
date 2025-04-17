<script lang="ts">
  import Preview from "$lib/components/badge/Preview.svelte";
  import { useFilter } from "$lib/features/filters/useFilter";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import DrilledMediaList from "../drilldown/DrilledMediaList.svelte";
  import PopularListItem from "../popular/PopularListItem.svelte";
  import PopupActions from "./_internal/PopupActions.svelte";
  import { useListItems, type ListParams } from "./useListItems";

  type UserListProps = {
    title: string;
    type?: MediaType;
    list: ListParams;
  };

  const { title, type, list }: UserListProps = $props();

  const isMobile = useMedia(WellKnownMediaQuery.mobile);
  const style = $derived($isMobile ? "summary" : "cover");
  const { filterMap } = useFilter();

  const listCacheId = $derived.by(() => {
    if (list.user?.slug) {
      return `${list.user.slug}-${list.slug}`;
    }

    return `${list.id}`;
  });
</script>

<DrilledMediaList
  id={`user-paginated-list-${listCacheId}`}
  {title}
  {type}
  filter={$filterMap}
  useList={(params) => useListItems({ list, ...params })}
>
  {#snippet item(media)}
    <PopularListItem type={media.type} media={media.entry} {style}>
      {#snippet popupActions()}
        <PopupActions {list} media={media.entry} />
      {/snippet}
    </PopularListItem>
  {/snippet}

  {#snippet badge()}
    <Preview />
  {/snippet}
</DrilledMediaList>
