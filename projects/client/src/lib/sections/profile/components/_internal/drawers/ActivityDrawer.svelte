<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import PaginatedList from "$lib/components/lists/PaginatedList.svelte";
  import { m } from "$lib/features/i18n/messages.ts";
  import { useActiveComment } from "$lib/sections/summary/components/comments/drawers/useActiveComment.ts";
  import { COMMENTS_DRILL_SIZE } from "$lib/utils/constants.ts";
  import ActivityCommentItem from "../ActivityCommentItem.svelte";
  import {
    useMyActivityList,
    type ActivityEntry,
  } from "../useMyActivityList.ts";
  import { ACTIVITY_LIST_CLASS } from "./constants.ts";

  type ActivityDrawerProps = {
    sourceCommentId?: number;
    onClose: () => void;
  };

  const { onClose, sourceCommentId }: ActivityDrawerProps = $props();

  const { reset, setReplying, activeComment } = useActiveComment();
  const isReplying = (id: number) =>
    $activeComment?.id === id && $activeComment?.isReplying;

  let isOpened = $state(false);
</script>

<Drawer
  {onClose}
  title={m.list_title_activity()}
  size="large"
  metaInfo={m.list_title_comments()}
  onOpened={() => (isOpened = true)}
>
  {#if isOpened}
    <div class={ACTIVITY_LIST_CLASS}>
      <PaginatedList
        type="activity-reviews"
        target="parent"
        useList={() =>
          useMyActivityList({
            type: "reviews",
            limit: COMMENTS_DRILL_SIZE,
          })}
      >
        {#snippet items(entries: ActivityEntry[], _isLoading: boolean)}
          {#each entries as entry (entry.key)}
            {#if entry.activityType === "reviews"}
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
