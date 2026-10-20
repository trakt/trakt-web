<script lang="ts">
  import PaginatedList from "$lib/components/lists/PaginatedList.svelte";
  import { useConfirm } from "$lib/features/confirmation/useConfirm.ts";
  import type { CommentSortType } from "$lib/requests/models/CommentSortType.ts";
  import { COMMENTS_DRILL_SIZE } from "$lib/utils/constants";
  import type { CommentsProps } from "./CommentsProps.ts";
  import { commentsPlaceholder } from "./_internal/commentsPlaceholder.ts";
  import { useComments } from "./_internal/useComments.ts";
  import { useActiveComment } from "./drawers/useActiveComment.ts";
  import CommentThreadCard from "./drawers/CommentThreadCard.svelte";

  const { media, sort, language, ...props }:
    & CommentsProps
    & { sort: CommentSortType; language?: string } = $props();

  const { confirm } = useConfirm();
  const { reset, setReplying, registerDraft, activeComment } = useActiveComment(
    { confirm },
  );

  const isReplying = (id: number) =>
    $activeComment?.id === id && $activeComment?.isReplying;
</script>

<div class="trakt-comment-threads-list">
  <PaginatedList
    type={`inline-comments-${sort}-${language ?? "all"}`}
    target="default"
    useList={() =>
      useComments({
        slug: media.slug,
        limit: COMMENTS_DRILL_SIZE,
        sort,
        language,
        ...props,
      })}
  >
    {#snippet items(items, isLoading)}
      {#if items.length === 0 && !isLoading}
        <p class="inline-comments-empty">
          {commentsPlaceholder(language)}
        </p>
      {:else}
        {#each items as comment (comment.id)}
          <CommentThreadCard
            {comment}
            {media}
            {reset}
            {setReplying}
            {registerDraft}
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
