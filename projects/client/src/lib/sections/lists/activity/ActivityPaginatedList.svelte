<script lang="ts">
  import { useDiscover } from "$lib/features/discover/useDiscover";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import { DEFAULT_ACTIVITY_PAGE_SIZE } from "$lib/utils/constants";
  import DrilledMediaList from "../drilldown/DrilledMediaList.svelte";
  import SocialActivityItem from "./_internal/SocialActivityItem.svelte";
  import { useActivityList } from "./_internal/useActivityList";

  type RecommendedListProps = { title: string };

  const { title }: RecommendedListProps = $props();

  const isMobile = useMedia(WellKnownMediaQuery.mobile);
  const style = $derived($isMobile ? "summary" : "cover");

  const { mode } = useDiscover();
</script>

<DrilledMediaList
  id="view-all-activity"
  {title}
  type={$mode}
  cardOrientation="landscape"
  useList={(params) =>
    useActivityList({
      ...params,
      limit: DEFAULT_ACTIVITY_PAGE_SIZE,
    })}
>
  {#snippet item(activity)}
    <SocialActivityItem {activity} {style} />
  {/snippet}
</DrilledMediaList>
