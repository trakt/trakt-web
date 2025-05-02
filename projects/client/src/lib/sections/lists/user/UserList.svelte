<script lang="ts">
  import { useFilter } from "$lib/features/filters/useFilter";
  import * as m from "$lib/features/i18n/messages.ts";

  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary.ts";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import { useListItems } from "$lib/sections/lists/user/useListItems";
  import { getListUrl } from "../components/list-summary/_internal/getListUrl";
  import DrillableMediaList from "../drilldown/DrillableMediaList.svelte";
  import PopularListItem from "../popular/PopularListItem.svelte";
  import PopupActions from "./_internal/PopupActions.svelte";

  const { list, type }: { list: MediaListSummary; type?: MediaType } = $props();
  const { filterMap } = useFilter();
</script>

<DrillableMediaList
  {type}
  id={`user-list-${type}-${list.id}`}
  drilldownLabel={m.view_all()}
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
</DrillableMediaList>
