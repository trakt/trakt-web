<script lang="ts">
  import PaginatedList from "$lib/components/lists/PaginatedList.svelte";
  import type { MediaComment } from "$lib/requests/models/MediaComment";
  import type { PaginatableStore } from "$lib/sections/lists/drilldown/PaginatableStore";
  import type { ActiveComment } from "../../_internal/models/ActiveComment";
  import type { CommentsProps } from "../../CommentsProps";
  import CommentThreadCard from "../CommentThreadCard.svelte";
  import { THREAD_LIST_CLASS } from "../constants";
  import { useActiveComment } from "../useActiveComment";

  type ReviewsDrawerShellProps = {
    source?: ActiveComment;
    useList: PaginatableStore<MediaComment, string>;
  } & CommentsProps;

  const { source, useList, media, ...props }: ReviewsDrawerShellProps =
    $props();

  const { reset, setReplying, activeComment } = $derived(
    useActiveComment(source),
  );

  const isReplying = (id: number) =>
    $activeComment?.id === id && $activeComment?.isReplying;
</script>

<div class={THREAD_LIST_CLASS}>
  <PaginatedList type="reviews" target="parent" {useList}>
    {#snippet items(items)}
      {#each items as comment (comment.id)}
        <CommentThreadCard
          {comment}
          {media}
          {reset}
          {setReplying}
          {...props}
          isReplying={isReplying(comment.id)}
          shouldScrollIntoView={comment.id === source?.id}
        />
      {/each}
    {/snippet}
  </PaginatedList>
</div>

<style>
  .trakt-comment-threads-list {
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
