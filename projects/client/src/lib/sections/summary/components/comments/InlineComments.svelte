<script lang="ts">
  import PaginatedList from "$lib/components/lists/PaginatedList.svelte";
  import Toggler from "$lib/components/toggles/Toggler.svelte";
  import { useToggler } from "$lib/components/toggles/useToggler";
  import { COMMENTS_DRILL_SIZE } from "$lib/utils/constants";
  import { writable } from "$lib/utils/store/WritableSubject.ts";
  import type { CommentsProps } from "./CommentsProps.ts";
  import AddCommentAction from "./_internal/comment-actions/AddCommentAction.svelte";
  import { useComments } from "./_internal/useComments.ts";
  import AddReviewDrawerHost from "./drawers/AddReviewDrawerHost.svelte";
  import { useActiveComment } from "./drawers/useActiveComment.ts";
  import CommentThreadCard from "./drawers/CommentThreadCard.svelte";

  const { media, ...props }: CommentsProps = $props();

  const { current: sortType, set, options } = useToggler("comment");

  const { reset, setReplying, activeComment } = useActiveComment();

  const isReplying = (id: number) =>
    $activeComment?.id === id && $activeComment?.isReplying;

  const isPostReviewOpen = writable(false);
</script>

<div class="inline-comments">
  <div class="inline-comments-header">
    <Toggler value={$sortType.value} onChange={set} {options} />
    <AddCommentAction onclick={() => isPostReviewOpen.set(true)} />
  </div>

  <div class="trakt-comment-threads-list">
    <PaginatedList
      type={`inline-comments-${$sortType.value}`}
      target="default"
      useList={() =>
        useComments({
          slug: media.slug,
          limit: COMMENTS_DRILL_SIZE,
          sort: $sortType.value,
          ...props,
        })}
    >
      {#snippet items(items)}
        {#each items as comment (comment.id)}
          <CommentThreadCard
            {comment}
            {media}
            {reset}
            {setReplying}
            {...props}
            isReplying={isReplying(comment.id)}
            shouldScrollIntoView={false}
          />
        {/each}
      {/snippet}
    </PaginatedList>
  </div>
</div>

{#if $isPostReviewOpen}
  <AddReviewDrawerHost
    onClose={() => isPostReviewOpen.set(false)}
    onCommentPost={() => isPostReviewOpen.set(false)}
    mode="post"
    {media}
    {...props}
  />
{/if}

<style>
  .inline-comments {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);
  }

  .inline-comments-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--gap-s);
  }

  .trakt-comment-threads-list {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);

    :global(.trakt-paginated-list) {
      display: flex;
      flex-direction: column;
      gap: var(--gap-s);
    }
  }
</style>
