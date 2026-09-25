<script lang="ts">
  import PaginatedList from "$lib/components/lists/PaginatedList.svelte";
  import { useAuth } from "$lib/features/auth/stores/useAuth.ts";
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag.ts";
  import { useFeatureFlag } from "$lib/features/feature-flag/useFeatureFlag.ts";
  import type { CommentSortType } from "$lib/requests/models/CommentSortType.ts";
  import { COMMENTS_DRILL_SIZE } from "$lib/utils/constants";
  import { fromRune } from "$lib/utils/store/fromRune.svelte";
  import type { CommentsProps } from "./CommentsProps.ts";
  import { commentsPlaceholder } from "./_internal/commentsPlaceholder.ts";
  import { useCommentsWithPinnedMine } from "./_internal/useCommentsWithPinnedMine.ts";
  import type { UseMyCommentsProps } from "./_internal/UseMyCommentsProps.ts";
  import { useActiveComment } from "./drawers/useActiveComment.ts";
  import CommentThreadCard from "./drawers/CommentThreadCard.svelte";

  const { media, sort, language, ...props }:
    & CommentsProps
    & { sort: CommentSortType; language?: string } = $props();

  const { reset, setReplying, activeComment } = useActiveComment();

  const { isAuthorized } = useAuth();
  const { isEnabled } = useFeatureFlag();
  const pinMine$ = isEnabled(FeatureFlag.ReviewsPinMine);

  // Built outside the useList factory PaginatedList wraps in $derived, so a
  // re-render updates the query's options instead of recreating it.
  const myCommentsParams$ = fromRune((): UseMyCommentsProps => ({
    ...props,
    slug: media.slug,
    enabled: $isAuthorized ?? false,
  }));

  const isReplying = (id: number) =>
    $activeComment?.id === id && $activeComment?.isReplying;
</script>

<div class="trakt-comment-threads-list">
  <PaginatedList
    type={`inline-comments-${sort}-${language ?? "all"}`}
    target="default"
    useList={() =>
      useCommentsWithPinnedMine({
        slug: media.slug,
        limit: COMMENTS_DRILL_SIZE,
        sort,
        language,
        pinMine$,
        myCommentsParams$,
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
