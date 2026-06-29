<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import PaginatedList from "$lib/components/lists/PaginatedList.svelte";
  import Toggler from "$lib/components/toggles/Toggler.svelte";
  import { useToggler } from "$lib/components/toggles/useToggler";
  import { useDiscover } from "$lib/features/filters/useDiscover.ts";
  import { m } from "$lib/features/i18n/messages.ts";
  import { useActiveComment } from "$lib/sections/summary/components/comments/drawers/useActiveComment.ts";
  import {
    COMMENTS_DRILL_SIZE,
    DEFAULT_DRILL_SIZE,
  } from "$lib/utils/constants.ts";
  import ActivityCommentItem from "../ActivityCommentItem.svelte";
  import ActivityRatingItem from "../ActivityRatingItem.svelte";
  import { useMyActivityList } from "../useMyActivityList.ts";
  import { ACTIVITY_LIST_CLASS } from "./constants.ts";

  type ActivityDrawerProps = {
    sourceCommentId?: number;
    onClose: () => void;
  };

  const { onClose, sourceCommentId }: ActivityDrawerProps = $props();

  const { mode } = useDiscover();

  const { reset, setReplying, activeComment } = useActiveComment();
  const isReplying = (id: number) =>
    $activeComment?.id === id && $activeComment?.isReplying;

  const { current: activityType, set, options } = useToggler("activity");

  let isOpened = $state(false);

  const drillSize = $derived(
    $activityType.value === "reviews"
      ? COMMENTS_DRILL_SIZE
      : DEFAULT_DRILL_SIZE,
  );
</script>

{#snippet badge()}
  <Toggler value={$activityType.value} onChange={set} {options} />
{/snippet}

<Drawer
  {onClose}
  title={m.list_title_activity()}
  size="large"
  metaInfo={$activityType.text()}
  {badge}
  onOpened={() => (isOpened = true)}
>
  {#if isOpened}
    <div class={ACTIVITY_LIST_CLASS}>
      <PaginatedList
        type="activity"
        target="parent"
        useList={() =>
          useMyActivityList({
            type: $activityType.value,
            limit: drillSize,
            mode: $mode,
          })}
      >
        {#snippet items(entries)}
          {#each entries as entry (entry.key)}
            {#if entry.activityType === "ratings"}
              <ActivityRatingItem {entry} style="compact" />
            {:else if entry.activityType === "reviews"}
              <ActivityCommentItem
                {entry}
                variant="summary"
                shouldScrollIntoView={entry.comment.id === sourceCommentId}
                isReplying={isReplying(entry.comment.id)}
                {setReplying}
                {reset}
              />
            {/if}
          {/each}
        {/snippet}
      </PaginatedList>
    </div>
  {/if}
</Drawer>

<style>
  .trakt-activity-drawer-list {
    overflow-y: auto;
    overscroll-behavior: contain;
    position: relative;

    padding: var(--ni-4);

    :global(.trakt-paginated-list) {
      display: flex;
      flex-direction: column;
      gap: var(--gap-s);
    }
  }
</style>
