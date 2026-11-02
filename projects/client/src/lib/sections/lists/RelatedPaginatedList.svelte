<script lang="ts">
  import { useRelatedMode } from "$lib/features/recommendations/useRelatedMode";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import DefaultMediaItem from "./components/DefaultMediaItem.svelte";
  import DrilledMediaList from "./drilldown/DrilledMediaList.svelte";
  import { useRelatedList } from "./stores/useRelatedList";

  type RelatedPaginatedListProps = {
    type: MediaType;
    slug: string;
  };

  const { type, slug }: RelatedPaginatedListProps = $props();
  const { isPersonalized } = useRelatedMode();
</script>

<DrilledMediaList
  id={`related-list-${type}-${slug}`}
  {type}
  useList={(params) =>
    useRelatedList({ ...params, slug, personalized: $isPersonalized })}
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
