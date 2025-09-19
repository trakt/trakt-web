<script lang="ts">
  import * as m from "$lib/features/i18n/messages";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import CtaItem from "../components/cta/CtaItem.svelte";

  import Toggler from "$lib/components/toggles/Toggler.svelte";
  import { useToggler } from "$lib/components/toggles/useToggler.ts";
  import { DEFAULT_ACTIVITY_PAGE_SIZE } from "$lib/utils/constants.ts";
  import DrillableMediaList from "../drilldown/DrillableMediaList.svelte";
  import RecentlyWatchedItem from "../history/RecentlyWatchedItem.svelte";
  import SocialActivityItem from "./_internal/SocialActivityItem.svelte";
  import { useActivityList } from "./_internal/useActivityList.ts";

  /** once we have a proper social hub we should encourage people to find other users to follow, aka: empty placeholder */

  const { current: activityType, set, options } = useToggler("activity");

  const urlBuilder = $derived(
    $activityType === "social"
      ? UrlBuilder.social.activity
      : UrlBuilder.history.all,
  );

  const cta = $derived(
    $activityType === "social"
      ? { type: "activity" as const }
      : { type: "personal-activity" as const },
  );
  // FIXME: coalesce on list level & combine drilled down versions
</script>

<!-- TODO replace with empty state message when actionable on Trakt Web -->
<DrillableMediaList
  id={`activity-list-${$activityType}`}
  type="episode"
  useList={(params) =>
    useActivityList({
      ...params,
      limit: DEFAULT_ACTIVITY_PAGE_SIZE,
      activityType: $activityType,
    })}
  {urlBuilder}
  drilldownLabel={m.button_label_view_all_social_activity()}
  title={m.list_title_activity()}
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

  {#snippet badge()}
    <Toggler value={$activityType} onChange={set} {options} />
  {/snippet}
</DrillableMediaList>
