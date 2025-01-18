<script lang="ts">
  import type { MediaType } from "$lib/models/MediaType";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import AnticipatedMediaItem from "./components/AnticipatedMediaItem.svelte";
  import DrilledMediaList from "./drilldown/DrilledMediaList.svelte";
  import { useAnticipatedList } from "./stores/useAnticipatedList";

  type AnticipatedListProps = {
    title: string;
    type: MediaType;
  };

  const { title, type }: AnticipatedListProps = $props();
</script>

<DrilledMediaList
  {title}
  {type}
  useList={useAnticipatedList}
  urlBuilder={UrlBuilder.anticipated}
>
  {#snippet item(media)}
    <AnticipatedMediaItem {type} {media} />
  {/snippet}
</DrilledMediaList>
