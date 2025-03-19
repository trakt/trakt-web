<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import LikeCommentButton from "$lib/components/buttons/like-comment/LikeCommentButton.svelte";
  import CommentIcon from "$lib/components/icons/CommentIcon.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaComment } from "$lib/requests/models/MediaComment";
  import { useCommentLikes } from "./useCommentLikes";

  type CommentFooterProps = {
    comment: MediaComment;
    onDrilldown?: (id: number) => void;
  };

  const { comment, onDrilldown }: CommentFooterProps = $props();

  const { likes } = useUser();
  const { like, unlike, isLiking } = $derived(
    useCommentLikes({ id: comment.id }),
  );

  const isLiked = $derived(
    !!$likes?.some((like) => like.type === "comment" && like.id === comment.id),
  );

  const isRootComment = $derived(comment.parentId === 0);
  const iconStyle = $derived(comment.replyCount > 0 ? "filled" : "open");
</script>

<div class="trakt-comment-footer">
  <div class="trakt-comment-likes">
    <LikeCommentButton
      style="normal"
      size="normal"
      onLike={like}
      onUnlike={unlike}
      {isLiked}
      isLiking={$isLiking}
      likeCount={comment.likeCount}
    />
  </div>

  {#if isRootComment}
    <div class="trakt-comment-replies">
      <Button
        label={m.comment_replies_label()}
        onclick={() => onDrilldown?.(comment.id)}
        style="ghost"
        color="purple"
        disabled={!onDrilldown}
      >
        {#snippet icon()}
          <CommentIcon style={iconStyle} />
        {/snippet}
        {m.comment_replies_text({ count: comment.replyCount })}
      </Button>
    </div>
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
  }

  .trakt-comment-likes {
    :global(.trakt-button) {
      /* To align the button icon instead of the ghost button border */
      margin-left: var(--ni-neg-28);
    }
  }

  .trakt-comment-replies {
    :global(.trakt-button) {
      /* To align the button text instead of the ghost button border */
      margin-right: var(--ni-neg-28);
    }
  }
</style>
