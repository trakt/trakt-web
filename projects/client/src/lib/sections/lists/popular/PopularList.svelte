<script lang="ts">
  import { useFilter } from "$lib/features/filters/useFilter";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import DrillableMediaList from "../drilldown/DrillableMediaList.svelte";
  import PopularListItem from "./PopularListItem.svelte";
  import { usePopularList } from "./usePopularList";

  type PopularListProps = {
    title: string;
    drilldownLabel: string;
    type: MediaType;
    search?: Record<string, string>;
  };

  const { title, drilldownLabel, type, search }: PopularListProps = $props();
  const { filterMap } = useFilter();
</script>

<DrillableMediaList
  id="popular-list-{type}"
  source={{ id: "popular", type }}
  {title}
  {drilldownLabel}
  {type}
  filter={$filterMap}
  useList={(params) =>
    usePopularList({
      ...params,
      search,
    })}
  urlBuilder={(params) =>
    UrlBuilder.popular({
      ...params,
      search,
    })}
>
  {#snippet item(media)}
    <PopularListItem {type} {media} />
  {/snippet}
</DrillableMediaList>
