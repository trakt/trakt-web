<script lang="ts">
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import { DEFAULT_ACTIVITY_PAGE_SIZE } from "$lib/utils/constants";
  import DrilledMediaList from "../drilldown/DrilledMediaList.svelte";
  import RecentlyWatchedItem from "../history/RecentlyWatchedItem.svelte";
  import SocialActivityItem from "./_internal/SocialActivityItem.svelte";
  import { useActivityList } from "./_internal/useActivityList";
  import type { ActivityType } from "./models/ActivityType";

  type RecommendedListProps = {
    title: string;
    activityType: ActivityType;
  };

  const { title, activityType }: RecommendedListProps = $props();

  const isMobile = useMedia(WellKnownMediaQuery.mobile);
  const style = $derived($isMobile ? "summary" : "cover");
</script>

<DrilledMediaList
  id="view-all-social-activity"
  {title}
  type="episode"
  useList={(params) =>
    useActivityList({
      ...params,
      limit: DEFAULT_ACTIVITY_PAGE_SIZE,
      activityType,
    })}
>
  {#snippet item(activity)}
    {#if "activityAt" in activity}
      <SocialActivityItem {activity} {style} />
    {:else}
      <RecentlyWatchedItem media={activity} {style} isActionable />
    {/if}
  {/snippet}
</DrilledMediaList>
