<script lang="ts">
  import type { DiscoverMode } from "$lib/features/discover/models/DiscoverMode";
  import { useFilter } from "$lib/features/filters/useFilter";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary.ts";
  import { useListItems } from "$lib/sections/lists/user/useListItems";
  import { getListUrl } from "../components/list-summary/_internal/getListUrl";
  import DrillableMediaList from "../drilldown/DrillableMediaList.svelte";
  import UserListItem from "./_internal/UserListItem.svelte";
  import ListActions from "./ListActions.svelte";
  import type { Snippet } from "svelte";

  const {
    list,
    type,
    titleAction,
  }: { list: MediaListSummary; type?: DiscoverMode; titleAction?: Snippet } =
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
  --height-override-card="var(--height-portrait-card-sm)"
  --height-override-list="var(--height-poster-list-sm)"
  {type}
  source={{ id: "user-list", type }}
  id={`user-list-${type}-${list.id}`}
  drilldownLabel={m.button_text_view_all()}
  filter={$filterMap}
  useList={(params) => useListItems({ list, ...params })}
  urlBuilder={() => getListUrl({ type: "user-list", list, mode: type })}
  title={list.name}
  {titleAction}
>
  {#snippet item(media)}
    <UserListItem listedItem={media} style="cover" {list} />
  {/snippet}

  {#snippet actions()}
    <ListActions {list} />
  {/snippet}

  {#snippet empty()}
    {placeholderText}
  {/snippet}
</DrillableMediaList>
