<script lang="ts">
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag";
  import * as m from "$lib/features/i18n/messages";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import { writable } from "svelte/store";
  import CtaItem from "../components/cta/CtaItem.svelte";

  import DrillableMediaList from "../drilldown/DrillableMediaList.svelte";
  import RecentlyWatchedItem from "../history/RecentlyWatchedItem.svelte";
  import ActivityToggle from "./_internal/ActivityToggle.svelte";
  import SocialActivityItem from "./_internal/SocialActivityItem.svelte";
  import { useActivityList } from "./_internal/useActivityList.ts";
  import type { ActivityType } from "./models/ActivityType.ts";

  /** once we have a proper social hub we should encourage people to find other users to follow, aka: empty placeholder */

  const selectedType = writable<ActivityType>("social");

  const urlBuilder = $derived(
    $selectedType === "social"
      ? UrlBuilder.social.activity
      : UrlBuilder.history.all,
  );
  // FIXME: coalesce on list level & combine drilled down versions
</script>

<!-- TODO replace with empty state message when actionable on Trakt Web -->
<DrillableMediaList
  id={`${$selectedType}-activity-list`}
  type="episode"
  useList={(params) =>
    useActivityList({ ...params, activityType: $selectedType })}
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
    {#if $selectedType === "social"}
      <CtaItem cta="activity" variant="card" />
    {/if}
  {/snippet}

  {#snippet empty()}
    {#if $selectedType === "personal"}
      {m.list_placeholder_activity_personal_empty()}
    {/if}

    {#if $selectedType === "social"}
      <RenderForFeature flag={FeatureFlag.Cta}>
        {#snippet enabled()}
          {#if $selectedType === "social"}
            <CtaItem cta="activity" variant="placeholder" />
          {/if}
        {/snippet}

        {#if $selectedType === "social"}
          {m.list_placeholder_activity_social_empty()}
        {/if}
      </RenderForFeature>
    {/if}
  {/snippet}

  {#snippet badge()}
    <ActivityToggle type={selectedType} />
  {/snippet}
</DrillableMediaList>
