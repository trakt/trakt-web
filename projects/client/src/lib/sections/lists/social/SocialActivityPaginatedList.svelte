<script lang="ts">
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import DrilledMediaList from "../drilldown/DrilledMediaList.svelte";
  import SocialActivityItem from "./SocialActivityItem.svelte";
  import { useSocialActivityList } from "./useSocialActivityList";

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
  useList={useSocialActivityList}
  urlBuilder={UrlBuilder.recommended}
>
  {#snippet item(media)}
    <SocialActivityItem activity={media} {style} />
  {/snippet}
</DrilledMediaList>
