<script lang="ts">
  import { useDiscover } from "$lib/features/discover/useDiscover.ts";
  import { useFilter } from "$lib/features/filters/useFilter.ts";
  import * as m from "$lib/features/i18n/messages";
  import { DEFAULT_ACTIVITY_PAGE_SIZE } from "$lib/utils/constants.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import CtaItem from "../components/cta/CtaItem.svelte";
  import DrillableMediaList from "../drilldown/DrillableMediaList.svelte";
  import SocialActivityItem from "./_internal/SocialActivityItem.svelte";
  import { useActivityList } from "./_internal/useActivityList.ts";

  /** once we have a proper social hub we should encourage people to find other users to follow, aka: empty placeholder */

  const { mode } = useDiscover();

  const cta = { type: "activity" as const };
  const { filterMap } = useFilter();
</script>

<DrillableMediaList
  id={"activity-list-social"}
  source={{ id: "activity", type: "social" }}
  type={$mode}
  variant="landscape"
  filter={$filterMap}
  useList={(params) =>
    useActivityList({
      ...params,
      limit: DEFAULT_ACTIVITY_PAGE_SIZE,
    })}
  urlBuilder={UrlBuilder.social.activity}
  drilldownLabel={m.button_label_view_all_social_activity()}
  title={m.list_title_social_activity()}
>
  {#snippet item(activity)}
    <SocialActivityItem {activity} />
  {/snippet}

  {#snippet ctaItem()}
    <CtaItem {cta} variant="card" />
  {/snippet}

  {#snippet empty()}
    <CtaItem {cta} variant="placeholder" />
  {/snippet}
</DrillableMediaList>
