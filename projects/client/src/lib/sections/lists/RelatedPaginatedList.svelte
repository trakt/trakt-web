<script lang="ts">
  import type { MediaType } from "$lib/requests/models/MediaType";
  import DefaultMediaItem from "./components/DefaultMediaItem.svelte";
  import DrilledMediaList from "./drilldown/DrilledMediaList.svelte";
  import { useRelatedList } from "./stores/useRelatedList";

  type RelatedPaginatedListProps = {
    title: string;
    type: MediaType;
    slug: string;
  };

  const { title, type, slug }: RelatedPaginatedListProps = $props();
</script>

<DrilledMediaList
  id={`related-list-${type}-${slug}`}
  {title}
  {type}
  useList={(params) => useRelatedList({ ...params, slug })}
>
  {#snippet item(media)}
    <DefaultMediaItem
      {type}
      {media}
      source="related"
      canDeemphasize
      style="summary"
    />
  {/snippet}
</DrilledMediaList>
