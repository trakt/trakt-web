<script lang="ts">
  import { goto } from "$app/navigation";
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import Toggler from "$lib/components/toggles/Toggler.svelte";
  import { useToggler } from "$lib/components/toggles/useToggler";
  import type { DiscoverMode } from "$lib/features/discover/models/DiscoverMode.ts";
  import { m } from "$lib/features/i18n/messages.ts";
  import type { UserRatingEntry } from "$lib/requests/queries/users/userRatingsQuery.ts";
  import ListMetaInfo from "$lib/sections/components/ListMetaInfo.svelte";
  import { DEFAULT_PAGE_SIZE } from "$lib/utils/constants.ts";
  import { profileDrawerNavigation } from "../_internal/profileDrawerNavigation.ts";
  import ActivityCommentItem from "./_internal/ActivityCommentItem.svelte";
  import ActivityRatingItem from "./_internal/ActivityRatingItem.svelte";
  import {
    useMyActivityList,
    type ActivityEntry,
  } from "./_internal/useMyActivityList.ts";

  const { mode }: { mode: DiscoverMode } = $props();

  const { current: activityType, set, options } = useToggler("activity");

  const { buildDrawerLink } = profileDrawerNavigation();

  const navigateToActivityDrawer = (commentId?: number) => {
    const link = buildDrawerLink(commentId);
    goto(link.href, { noScroll: true, replaceState: true });
  };

  const isRatings = $derived($activityType.value === "ratings");

  const { list, isLoading } = $derived(
    useMyActivityList({
      limit: DEFAULT_PAGE_SIZE,
      mode,
      type: $activityType.value,
    }),
  );

  const drilldown = $derived.by(() => {
    const label = isRatings
      ? m.button_label_view_all_ratings()
      : m.button_label_view_all_activity();

    return {
      ...buildDrawerLink(),
      label,
      source: { id: "activity" as const },
    };
  });

  const heightList = $derived(
    isRatings ? "var(--height-landscape-list)" : "var(--height-comments-list)",
  );
</script>

{#snippet metaInfo()}
  <ListMetaInfo text={$activityType.text()} />
{/snippet}

<SectionList
  id="activity-list"
  items={$list}
  title={m.list_title_activity()}
  {metaInfo}
  --height-list={heightList}
  {drilldown}
>
  {#snippet item(entry: UserRatingEntry | ActivityEntry)}
    {#if entry.activityType === "ratings"}
      <ActivityRatingItem {entry} />
    {:else}
      <ActivityCommentItem
        {entry}
        onDrilldown={(id) => navigateToActivityDrawer(id)}
      />
    {/if}
  {/snippet}

  {#snippet empty()}
    {#if !$isLoading}
      <p class="secondary">
        {isRatings
          ? m.list_placeholder_ratings()
          : m.list_placeholder_reviews()}
      </p>
    {/if}
  {/snippet}

  {#snippet actions()}
    <Toggler value={$activityType.value} onChange={set} {options} />
  {/snippet}
</SectionList>
