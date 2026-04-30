<script lang="ts">
  import { goto } from "$app/navigation";
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import type { DiscoverMode } from "$lib/features/discover/models/DiscoverMode.ts";
  import { m } from "$lib/features/i18n/messages.ts";
  import ListMetaInfo from "$lib/sections/components/ListMetaInfo.svelte";
  import ViewAllButton from "$lib/sections/lists/components/ViewAllButton.svelte";
  import { profileDrawerNavigation } from "../_internal/profileDrawerNavigation.ts";
  import ActivityCommentItem from "./_internal/ActivityCommentItem.svelte";
  import {
    useMyActivityList,
    type ActivityEntry,
  } from "./_internal/useMyActivityList.ts";

  const { mode: _mode }: { mode: DiscoverMode } = $props();

  const { buildDrawerLink } = profileDrawerNavigation();

  const navigateToActivityDrawer = (commentId?: number) => {
    const link = buildDrawerLink(commentId);
    goto(link.href, { noScroll: true, replaceState: true });
  };

  const { isLoading, list: entries } = $derived(
    useMyActivityList({ type: "reviews" }),
  );
</script>

{#snippet metaInfo()}
  <ListMetaInfo text={m.list_title_comments()} />
{/snippet}

<SectionList
  id="activity-list"
  items={$entries}
  title={m.list_title_activity()}
  {metaInfo}
  --height-list="var(--height-comments-list)"
>
  {#snippet item(entry: ActivityEntry)}
    {#if entry.activityType === "reviews"}
      <ActivityCommentItem
        {entry}
        onDrilldown={(id) => navigateToActivityDrawer(id)}
      />
    {/if}
  {/snippet}

  {#snippet empty()}
    {#if !$isLoading}
      <p class="secondary">
        {m.list_placeholder_reviews()}
      </p>
    {/if}
  {/snippet}

  {#snippet actions()}
    <ViewAllButton
      label={m.button_label_view_all_activity()}
      onclick={() => navigateToActivityDrawer()}
      source={{ id: "activity" }}
    />
  {/snippet}
</SectionList>
