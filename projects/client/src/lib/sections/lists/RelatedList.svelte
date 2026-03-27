<script lang="ts">
  import MediaList from "$lib/sections/lists/drilldown/MediaList.svelte";

  import type { MediaType } from "$lib/requests/models/MediaType";
  import DefaultMediaItem from "./components/DefaultMediaItem.svelte";
  import ViewAllButton from "./components/ViewAllButton.svelte";
  import { useRelatedList } from "./stores/useRelatedList";

  type RelatedListProps = {
    title: string;
    type: MediaType;
    slug: string;
    drilldownLink?: string;
  };

  const { title, type, slug, drilldownLink }: RelatedListProps = $props();
</script>

<MediaList
  id={`related-list-${type}-${slug}`}
  useList={(params) => useRelatedList({ ...params, slug })}
  {type}
  {title}
  {drilldownLink}
  noscroll={drilldownLink != null}
  --height-override-card="var(--height-portrait-card-sm)"
  --height-override-list="var(--height-poster-list-sm)"
>
  {#snippet item(media)}
    <DefaultMediaItem {type} {media} source="related" canDeemphasize />
  {/snippet}

  {#snippet actions(items)}
    {#if drilldownLink}
      <ViewAllButton
        href={drilldownLink}
        label="TODO"
        noscroll
        disabled={items.length === 0}
        source={{ id: "related" }}
      />
    {/if}
  {/snippet}
</MediaList>
