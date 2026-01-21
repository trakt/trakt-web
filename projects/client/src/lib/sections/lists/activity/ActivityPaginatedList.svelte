<script lang="ts">
  import { useDiscover } from "$lib/features/discover/useDiscover";
  import { useFilter } from "$lib/features/filters/useFilter";
  import { DEFAULT_ACTIVITY_PAGE_SIZE } from "$lib/utils/constants";
  import DrilledMediaList from "../drilldown/DrilledMediaList.svelte";
  import SocialActivityItem from "./_internal/SocialActivityItem.svelte";
  import { useActivityList } from "./_internal/useActivityList";

  type RecommendedListProps = { title: string };

  const { title }: RecommendedListProps = $props();

  const { mode } = useDiscover();
  const { filterMap } = useFilter();
</script>

<DrilledMediaList
  id="view-all-activity-${$mode}"
  {title}
  type={$mode}
  cardOrientation="landscape"
  filter={$filterMap}
  useList={(params) =>
    useActivityList({
      ...params,
      limit: DEFAULT_ACTIVITY_PAGE_SIZE,
    })}
>
  {#snippet item(activity)}
    <SocialActivityItem {activity} style="summary" />
  {/snippet}
</DrilledMediaList>
