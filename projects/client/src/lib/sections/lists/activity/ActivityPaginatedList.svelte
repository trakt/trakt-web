<script lang="ts">
  import { useDiscover } from "$lib/features/discover/useDiscover";
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
  import { type MediaType } from "$lib/requests/models/MediaType";
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

  const { mode } = useDiscover();
</script>

{#snippet content(type?: MediaType)}
  <DrilledMediaList
    id="view-all-activity"
    {title}
    {type}
    cardOrientation="landscape"
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
{/snippet}

<RenderForFeature flag={FeatureFlag.Discover}>
  {#snippet enabled()}
    {@render content($mode)}
  {/snippet}

  {@render content()}
</RenderForFeature>
