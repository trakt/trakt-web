<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";

  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary.ts";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import { useListItems } from "$lib/sections/lists/components/list-summary/_internal/useListItems.ts";
  import DrillableMediaList from "../../drilldown/DrillableMediaList.svelte";
  import { mediaListHeightResolver } from "../../utils/mediaListHeightResolver";
  import MediaCard from "../MediaCard.svelte";
  import { getListUrl } from "./_internal/getListUrl";

  const { list, type }: { list: MediaListSummary; type?: MediaType } = $props();
  $inspect(type);
</script>

<DrillableMediaList
  {type}
  id={`top-list-${type}-${list.id}`}
  drilldownLabel={m.view_all()}
  useList={(params) => useListItems({ list, ...params })}
  urlBuilder={() => getListUrl(list, type)}
  title={list.name}
  --height-list={mediaListHeightResolver(type)}
>
  {#snippet item(media)}
    <MediaCard type={media.entry.type} media={media.entry} />
  {/snippet}
</DrillableMediaList>
