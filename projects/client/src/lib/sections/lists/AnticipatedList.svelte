<script lang="ts">
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import type { MediaType } from "$lib/models/MediaType";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import AnticipatedMediaItem from "./components/AnticipatedMediaItem.svelte";
  import ViewAllButton from "./components/ViewAllButton.svelte";
  import { useAnticipatedList } from "./stores/useAnticipatedList";
  import { mediaListHeightResolver } from "./utils/mediaListHeightResolver";

  type TrendingListProps = {
    title: string;
    drilldownLabel: string;
    type: MediaType;
  };

  const { title, drilldownLabel, type }: TrendingListProps = $props();

  const { list } = useAnticipatedList({ type });
</script>

<SectionList
  id={`anticipated-list-${type}`}
  items={$list}
  {title}
  --height-list={mediaListHeightResolver(type)}
>
  {#snippet item(media)}
    <AnticipatedMediaItem {type} {media} />
  {/snippet}

  {#snippet actions()}
    <ViewAllButton
      href={UrlBuilder.anticipated({ type })}
      label={drilldownLabel}
    />
  {/snippet}
</SectionList>
