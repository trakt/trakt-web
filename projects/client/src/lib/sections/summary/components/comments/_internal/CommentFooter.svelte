<script lang="ts">
  import type { MediaComment } from "$lib/requests/models/MediaComment";
  import LikeCommentAction from "./comment-actions/LikeCommentAction.svelte";
  import ViewRepliesAction from "./comment-actions/ViewRepliesAction.svelte";

  type CommentFooterProps = {
    comment: MediaComment;
    onDrilldown?: (id: number) => void;
  };

  const { comment, onDrilldown }: CommentFooterProps = $props();

  const isRootComment = $derived(comment.parentId === 0);
</script>

<div class="trakt-comment-footer">
  <LikeCommentAction {comment} />

  {#if isRootComment}
    <ViewRepliesAction {comment} {onDrilldown} />
  {/if}
</div>

<style>
  .trakt-comment-footer {
    height: var(--ni-40);

    display: flex;
    align-items: center;
    justify-content: space-between;

    :global(.trakt-button) {
      display: flex;
      flex-direction: row-reverse;
    }

    /* To align icons of the first and last ghost buttons */
    margin-left: var(--ni-neg-18);
    margin-right: var(--ni-neg-18);
  }
</style>
