<script lang="ts">
  import MediaList from "$lib/sections/lists/drilldown/MediaList.svelte";

  import type { MediaType } from "$lib/requests/models/MediaType";
  import MediaCard from "./components/MediaCard.svelte";
  import { useRelatedList } from "./stores/useRelatedList";

  type RelatedListProps = {
    title: string;
    type: MediaType;
    slug: string;
  };

  const { title, type, slug }: RelatedListProps = $props();
</script>

<MediaList
  id={`related-list-${type}-${slug}`}
  useList={(params) => useRelatedList({ ...params, slug })}
  {type}
  {title}
>
  {#snippet item(media)}
    <MediaCard {type} {media} />
  {/snippet}
</MediaList>
