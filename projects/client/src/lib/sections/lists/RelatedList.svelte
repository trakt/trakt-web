<script lang="ts">
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import type { MediaType } from "$lib/models/MediaType";
  import MediaItem from "./components/MediaItem.svelte";
  import { useRelatedList } from "./stores/useRelatedList";
  import { mediaListHeightResolver } from "./utils/mediaListHeightResolver";

  type RelatedListProps = {
    title: string;
    type: MediaType;
    slug: string;
  };

  const { title, type, slug }: RelatedListProps = $props();

  const { list } = $derived(useRelatedList({ type, slug }));
</script>

<SectionList
  id={`related-list-${type}-${slug}`}
  items={$list}
  {title}
  --height-list={mediaListHeightResolver(type)}
>
  {#snippet item(media)}
    <MediaItem {type} {media} />
  {/snippet}
</SectionList>
