<script lang="ts">
  import PaginatedList from "$lib/components/lists/PaginatedList.svelte";
  import { useAuth } from "$lib/features/auth/stores/useAuth.ts";
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag.ts";
  import { useFeatureFlag } from "$lib/features/feature-flag/useFeatureFlag.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { CommentSortType } from "$lib/requests/models/CommentSortType.ts";
  import { COMMENTS_DRILL_SIZE } from "$lib/utils/constants";
  import { fromRune } from "$lib/utils/store/fromRune.svelte";
  import type { CommentsProps } from "./CommentsProps.ts";
  import { commentsPlaceholder } from "./_internal/commentsPlaceholder.ts";
  import { useCommentsWithPinnedMine } from "./_internal/useCommentsWithPinnedMine.ts";
  import { useMyComments } from "./_internal/useMyComments.ts";
  import type { UseMyCommentsProps } from "./_internal/UseMyCommentsProps.ts";
  import { useActiveComment } from "./drawers/useActiveComment.ts";
  import CommentThreadCard from "./drawers/CommentThreadCard.svelte";

  const { media, sort, language, mineActive = false, ...props }:
    & CommentsProps
    & { sort: CommentSortType; language?: string; mineActive?: boolean } =
      $props();

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

  const emptyText = $derived(
    mineActive
      ? m.list_placeholder_reviews_mine()
      : commentsPlaceholder(language),
  );
</script>

<div class="trakt-comment-threads-list">
  <PaginatedList
    type={`inline-comments-${mineActive ? "mine" : sort}-${language ?? "all"}`}
    target="default"
    useList={() =>
      mineActive
        ? useMyComments(myCommentsParams$)
        : useCommentsWithPinnedMine({
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
          {emptyText}
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
