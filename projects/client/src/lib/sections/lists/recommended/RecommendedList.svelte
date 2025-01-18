<script lang="ts">
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import type { MediaType } from "$lib/models/MediaType";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import MediaItem from "../components/MediaItem.svelte";
  import ViewAllButton from "../components/ViewAllButton.svelte";
  import { mediaListHeightResolver } from "../utils/mediaListHeightResolver";
  import { useRecommendedList } from "./useRecommendedList";

  type RecommendationListProps = {
    title: string;
    drilldownLabel: string;
    type: MediaType;
  };

  const { title, drilldownLabel, type }: RecommendationListProps = $props();

  const { list } = $derived(useRecommendedList({ type }));
</script>

<SectionList
  id={`recommended-list-${type}`}
  items={$list}
  {title}
  --height-list={mediaListHeightResolver(type)}
>
  {#snippet item(media)}
    <MediaItem {type} {media} />
  {/snippet}

  {#snippet actions()}
    <ViewAllButton
      href={UrlBuilder.recommended({ type })}
      label={drilldownLabel}
    />
  {/snippet}
</SectionList>
