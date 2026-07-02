<script lang="ts">
  import PaginatedList from "$lib/components/lists/PaginatedList.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { CommentSortType } from "$lib/requests/models/CommentSortType.ts";
  import { COMMENTS_DRILL_SIZE } from "$lib/utils/constants";
  import type { CommentsProps } from "./CommentsProps.ts";
  import { useComments } from "./_internal/useComments.ts";
  import { useActiveComment } from "./drawers/useActiveComment.ts";
  import CommentThreadCard from "./drawers/CommentThreadCard.svelte";

  const { media, sort, ...props }: CommentsProps & { sort: CommentSortType } =
    $props();

  const { reset, setReplying, activeComment } = useActiveComment();

  const isReplying = (id: number) =>
    $activeComment?.id === id && $activeComment?.isReplying;
</script>

<div class="trakt-comment-threads-list">
  <PaginatedList
    type={`inline-comments-${sort}`}
    target="default"
    useList={() =>
      useComments({
        slug: media.slug,
        limit: COMMENTS_DRILL_SIZE,
        sort,
        ...props,
      })}
  >
    {#snippet items(items, isLoading)}
      {#if items.length === 0 && !isLoading}
        <p class="inline-comments-empty">
          {m.list_placeholder_comments()}
        </p>
      {:else}
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
      {/if}
    {/snippet}
  </PaginatedList>
</div>

<style>
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

  .inline-comments-empty {
    color: var(--color-text-secondary);
  }
</style>
