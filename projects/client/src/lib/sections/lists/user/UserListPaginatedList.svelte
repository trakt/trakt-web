<script lang="ts">
  import ShareButton from "$lib/components/buttons/share/ShareButton.svelte";
  import { useFilter } from "$lib/features/filters/useFilter";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import DrilledMediaList from "../drilldown/DrilledMediaList.svelte";
  import PopularListItem from "../popular/PopularListItem.svelte";
  import PopupActions from "./_internal/PopupActions.svelte";
  import ListActions from "./ListActions.svelte";
  import { useListItems } from "./useListItems";

  type UserListProps = {
    title: string;
    type?: MediaType;
    list: MediaListSummary;
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
    <ListActions {list} />
  {/snippet}

  {#snippet actions()}
    <ShareButton
      {title}
      textFactory={({ title: name }) => m.text_share_list({ name })}
      source={{ id: "user-list", type }}
    />
  {/snippet}
</DrilledMediaList>
