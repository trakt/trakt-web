<script lang="ts">
  import * as m from "$lib/features/i18n/messages";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import CtaItem from "../components/cta/CtaItem.svelte";

  import DrillableMediaList from "../drilldown/DrillableMediaList.svelte";
  import SocialActivityItem from "./SocialActivityItem.svelte";
  import { useSocialActivityList } from "./useSocialActivityList";

  /** once we have a proper social hub we should encourage people to find other users to follow, aka: empty placeholder */
  const { list, isLoading } = useSocialActivityList({ limit: 1, page: 1 });

  const hasSocialActivity = $derived(!$isLoading && $list.length > 0);
</script>

<!-- TODO replace with empty state message when actionable on Trakt Web -->
{#if hasSocialActivity}
  <DrillableMediaList
    id="social-activity-list"
    type="episode"
    useList={useSocialActivityList}
    urlBuilder={UrlBuilder.social.activity}
    drilldownLabel={m.button_label_view_all_social_activity()}
    title={m.list_title_social_activity()}
  >
    {#snippet item(activity)}
      <SocialActivityItem {activity} />
    {/snippet}

    {#snippet ctaItem()}
      <CtaItem cta="activity" />
    {/snippet}
  </DrillableMediaList>
{/if}
