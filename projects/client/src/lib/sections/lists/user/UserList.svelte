<script lang="ts">
  import { useFilter } from "$lib/features/filters/useFilter";
  import * as m from "$lib/features/i18n/messages.ts";

  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary.ts";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import { useListItems } from "$lib/sections/lists/user/useListItems";
  import type { Snippet } from "svelte";
  import { getListUrl } from "../components/list-summary/_internal/getListUrl";
  import DrillableMediaList from "../drilldown/DrillableMediaList.svelte";
  import PopularListItem from "../popular/PopularListItem.svelte";
  import PopupActions from "./_internal/PopupActions.svelte";
  import ListActions from "./ListActions.svelte";

  const {
    list,
    type,
    empty,
  }: { list: MediaListSummary; type?: MediaType; empty?: Snippet } = $props();
  const { filterMap } = useFilter();

  const sourceId = $derived(`user-list-${type ?? "media"}`);
</script>

<DrillableMediaList
  {type}
  {empty}
  {sourceId}
  id={`${sourceId}-${list.id}`}
  drilldownLabel={m.button_text_view_all()}
  filter={$filterMap}
  useList={(params) => useListItems({ list, ...params })}
  urlBuilder={() => getListUrl(list, type)}
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
</DrillableMediaList>
