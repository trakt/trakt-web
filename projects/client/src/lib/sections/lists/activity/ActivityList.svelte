<script lang="ts">
  import * as m from "$lib/features/i18n/messages";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import CtaItem from "../components/cta/CtaItem.svelte";

  import { useDiscover } from "$lib/features/discover/useDiscover.ts";
  import { DEFAULT_ACTIVITY_PAGE_SIZE } from "$lib/utils/constants.ts";
  import DrillableMediaList from "../drilldown/DrillableMediaList.svelte";
  import RecentlyWatchedItem from "../history/RecentlyWatchedItem.svelte";
  import SocialActivityItem from "./_internal/SocialActivityItem.svelte";
  import { useActivityList } from "./_internal/useActivityList.ts";

  /** once we have a proper social hub we should encourage people to find other users to follow, aka: empty placeholder */

  const { activityType }: { activityType: "social" | "personal" } = $props();

  const { mode } = useDiscover();

  const urlBuilder = $derived(
    activityType === "social"
      ? UrlBuilder.social.activity
      : UrlBuilder.history.all,
  );

  const cta = $derived(
    activityType === "social"
      ? { type: "activity" as const }
      : {
          type: "personal-activity" as const,
          mediaType: $mode === "media" ? undefined : $mode,
        },
  );

  const title = $derived(
    activityType === "social"
      ? m.list_title_social_activity()
      : m.list_title_history(),
  );

  const drilldownLabel = $derived(
    activityType === "social"
      ? m.button_label_view_all_social_activity()
      : m.button_label_view_all_history(),
  );
</script>

<DrillableMediaList
  id={`activity-list-${activityType}`}
  source={{ id: "activity", type: activityType }}
  type={$mode}
  variant="landscape"
  useList={(params) =>
    useActivityList({
      ...params,
      limit: DEFAULT_ACTIVITY_PAGE_SIZE,
      activityType,
    })}
  {urlBuilder}
  {drilldownLabel}
  {title}
>
  {#snippet item(activity)}
    {#if "activityAt" in activity}
      <SocialActivityItem {activity} />
    {:else}
      <RecentlyWatchedItem media={activity} isActionable />
    {/if}
  {/snippet}

  {#snippet ctaItem()}
    <CtaItem {cta} variant="card" />
  {/snippet}

  {#snippet empty()}
    <CtaItem {cta} variant="placeholder" />
  {/snippet}
</DrillableMediaList>
