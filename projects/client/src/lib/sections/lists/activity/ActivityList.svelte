<script lang="ts">
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag";
  import * as m from "$lib/features/i18n/messages";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import { writable } from "svelte/store";
  import CtaItem from "../components/cta/CtaItem.svelte";

  import { assertDefined } from "$lib/utils/assert/assertDefined.ts";
  import DrillableMediaList from "../drilldown/DrillableMediaList.svelte";
  import RecentlyWatchedItem from "../history/RecentlyWatchedItem.svelte";
  import ActivityToggle from "./_internal/ActivityToggle.svelte";
  import SocialActivityItem from "./_internal/SocialActivityItem.svelte";
  import { useActivityList } from "./_internal/useActivityList.ts";
  import type { ActivityType } from "./models/ActivityType.ts";

  /** once we have a proper social hub we should encourage people to find other users to follow, aka: empty placeholder */

  const selectedType = writable<ActivityType[]>(["social"]);
  const handleTypeChange = (value: ActivityType[]) => selectedType.set(value);

  const activityType = $derived(assertDefined($selectedType.at(0)));

  const urlBuilder = $derived(
    activityType === "social"
      ? UrlBuilder.social.activity
      : UrlBuilder.history.all,
  );

  const cta = $derived(
    activityType === "social" ? "activity" : "personal-activity",
  );
  // FIXME: coalesce on list level & combine drilled down versions
</script>

<!-- TODO replace with empty state message when actionable on Trakt Web -->
<DrillableMediaList
  id={`${$selectedType}-activity-list`}
  type="episode"
  useList={(params) => useActivityList({ ...params, activityType })}
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
    <RenderForFeature flag={FeatureFlag.Cta}>
      {#snippet enabled()}
        <CtaItem {cta} variant="placeholder" />
      {/snippet}

      {#if activityType === "social"}
        {m.list_placeholder_activity_social_empty()}
      {:else}
        {m.list_placeholder_activity_personal_empty()}
      {/if}
    </RenderForFeature>
  {/snippet}

  {#snippet badge()}
    <ActivityToggle value={$selectedType} onChange={handleTypeChange} />
  {/snippet}
</DrillableMediaList>
