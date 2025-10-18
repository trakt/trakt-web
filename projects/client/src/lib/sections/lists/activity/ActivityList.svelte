<script lang="ts">
  import * as m from "$lib/features/i18n/messages";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import CtaItem from "../components/cta/CtaItem.svelte";

  import Toggler from "$lib/components/toggles/Toggler.svelte";
  import { useToggler } from "$lib/components/toggles/useToggler.ts";
  import { useDiscover } from "$lib/features/discover/useDiscover.ts";
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag.ts";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
  import { type MediaType } from "$lib/requests/models/MediaType.ts";
  import { DEFAULT_ACTIVITY_PAGE_SIZE } from "$lib/utils/constants.ts";
  import DrillableMediaList from "../drilldown/DrillableMediaList.svelte";
  import RecentlyWatchedItem from "../history/RecentlyWatchedItem.svelte";
  import SocialActivityItem from "./_internal/SocialActivityItem.svelte";
  import { useActivityList } from "./_internal/useActivityList.ts";

  /** once we have a proper social hub we should encourage people to find other users to follow, aka: empty placeholder */

  const { current: activityType, set, options } = useToggler("activity");

  const { mode } = useDiscover();

  const urlBuilder = $derived(
    $activityType.value === "social"
      ? UrlBuilder.social.activity
      : UrlBuilder.history.all,
  );

  const cta = $derived(
    $activityType.value === "social"
      ? { type: "activity" as const }
      : { type: "personal-activity" as const },
  );
</script>

{#snippet content(type?: MediaType)}
  <DrillableMediaList
    id={`activity-list-${$activityType.value}`}
    source={{ id: "activity", type: $activityType.value }}
    type="episode"
    metaInfo={$activityType.text()}
    useList={(params) =>
      useActivityList({
        ...params,
        limit: DEFAULT_ACTIVITY_PAGE_SIZE,
        activityType: $activityType.value,
        type,
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
      <Toggler value={$activityType.value} onChange={set} {options} />
    {/snippet}
  </DrillableMediaList>
{/snippet}

<RenderForFeature flag={FeatureFlag.Discover}>
  {#snippet enabled()}
    {@render content($mode)}
  {/snippet}

  {@render content()}
</RenderForFeature>
