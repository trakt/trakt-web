<script lang="ts">
  import * as m from "$lib/features/i18n/messages";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  import DrillableMediaList from "../drilldown/DrillableMediaList.svelte";
  import SocialActivityItem from "./SocialActivityItem.svelte";
  import { useSocialActivityList } from "./useSocialActivityList";

  const { list, isLoading } = useSocialActivityList({});

  const hasSocialActivity = $derived(!$isLoading && $list.length > 0);
</script>

<!-- TODO replace with empty state message when actionable on Trakt Lite -->
{#if hasSocialActivity}
  <DrillableMediaList
    id="social-activity-list"
    type="episode"
    useList={useSocialActivityList}
    urlBuilder={UrlBuilder.social.activity}
    drilldownLabel={m.view_all_social_activity()}
    title={m.social_activity_title()}
  >
    {#snippet item(activity)}
      <SocialActivityItem {activity} />
    {/snippet}
  </DrillableMediaList>
{/if}
