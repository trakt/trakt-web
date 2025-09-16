<script lang="ts">
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import { DEFAULT_ACTIVITY_PAGE_SIZE } from "$lib/utils/constants";
  import DrilledMediaList from "../drilldown/DrilledMediaList.svelte";
  import SocialActivityItem from "./_internal/SocialActivityItem.svelte";
  import { useSocialActivityList } from "./_internal/useSocialActivityList";

  type RecommendedListProps = {
    title: string;
  };

  const { title }: RecommendedListProps = $props();

  const isMobile = useMedia(WellKnownMediaQuery.mobile);
  const style = $derived($isMobile ? "summary" : "cover");
</script>

<DrilledMediaList
  id="view-all-social-activity"
  {title}
  type="episode"
  useList={(params) =>
    useSocialActivityList({
      ...params,
      limit: DEFAULT_ACTIVITY_PAGE_SIZE,
    })}
>
  {#snippet item(media)}
    <SocialActivityItem activity={media} {style} />
  {/snippet}
</DrilledMediaList>
