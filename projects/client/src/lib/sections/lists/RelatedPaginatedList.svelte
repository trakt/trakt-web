<script lang="ts">
  import type { MediaType } from "$lib/requests/models/MediaType";
  import DefaultMediaItem from "./components/DefaultMediaItem.svelte";
  import DrilledMediaList from "./drilldown/DrilledMediaList.svelte";
  import { useRelatedList } from "./stores/useRelatedList";

  type RelatedPaginatedListProps = {
    type: MediaType;
    slug: string;
    isSmart?: boolean;
  };

  const { type, slug, isSmart }: RelatedPaginatedListProps = $props();
</script>

<DrilledMediaList
  id={`related-list-${type}-${slug}`}
  {type}
  useList={(params) => useRelatedList({ ...params, slug, isSmart })}
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
