<script lang="ts">
  import type { DiscoverMode } from "$lib/features/discover/models/DiscoverMode";
  import { useFilter } from "$lib/features/filters/useFilter";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary.ts";
  import { useListItems } from "$lib/sections/lists/user/useListItems";
  import { getListUrl } from "../components/list-summary/_internal/getListUrl";
  import DrillableMediaList from "../drilldown/DrillableMediaList.svelte";
  import PopularListItem from "../popular/PopularListItem.svelte";
  import PopupActions from "./_internal/PopupActions.svelte";
  import ListActions from "./ListActions.svelte";

  const { list, type }: { list: MediaListSummary; type?: DiscoverMode } =
    $props();
  const { filterMap } = useFilter();

  const placeholderText = $derived.by(() => {
    switch (type) {
      case "movie":
        return m.list_placeholder_personal_list_empty_movies();
      case "show":
        return m.list_placeholder_personal_list_empty_shows();
      default:
        return m.list_placeholder_personal_list_empty();
    }
  });
</script>

<DrillableMediaList
  {type}
  source={{ id: "user-list", type }}
  id={`user-list-${type}-${list.id}`}
  drilldownLabel={m.button_text_view_all()}
  filter={$filterMap}
  useList={(params) => useListItems({ list, ...params })}
  urlBuilder={() => getListUrl(list, { mode: type })}
  title={list.name}
>
  {#snippet item(media)}
    <PopularListItem type={media.entry.type} media={media.entry}>
      {#snippet popupActions()}
        <PopupActions {list} media={media.entry} />
      {/snippet}
    </PopularListItem>
  {/snippet}

  {#snippet badge()}
    <ListActions {list} />
  {/snippet}

  {#snippet empty()}
    {placeholderText}
  {/snippet}
</DrillableMediaList>
