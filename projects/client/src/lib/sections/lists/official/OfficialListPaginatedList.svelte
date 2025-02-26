<script lang="ts">
  import Preview from "$lib/components/badge/Preview.svelte";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import MediaCard from "../components/MediaCard.svelte";
  import DrilledMediaList from "../drilldown/DrilledMediaList.svelte";
  import { useOfficialList } from "./useOfficialList";

  type OfficialListProps = {
    title: string;
    listId: string;
    type?: MediaType;
  };

  const { title, listId, type }: OfficialListProps = $props();

  const isMobile = useMedia(WellKnownMediaQuery.mobile);
  const style = $derived($isMobile ? "summary" : "cover");
</script>

<DrilledMediaList
  id={`official-list-${listId}`}
  {title}
  {type}
  useList={(params) => useOfficialList({ listId, ...params })}
>
  {#snippet item(media)}
    <MediaCard type={media.type} {media} {style} />
  {/snippet}

  {#snippet badge()}
    <Preview />
  {/snippet}
</DrilledMediaList>
