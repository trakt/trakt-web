<script lang="ts">
  import LikeCommentButton from "$lib/components/buttons/like-comment/LikeCommentButton.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import type { MediaComment } from "$lib/requests/models/MediaComment";
  import { useCommentLikes } from "./useCommentLikes";

  const { comment }: { comment: MediaComment } = $props();

  const { likes } = useUser();
  const { like, unlike, isLiking } = $derived(
    useCommentLikes({ id: comment.id }),
  );

  const isLiked = $derived(
    !!$likes?.some((like) => like.type === "comment" && like.id === comment.id),
  );
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
</div>

<style>
  .trakt-comment-footer {
    height: var(--ni-40);
  }

  .trakt-comment-likes {
    display: flex;
    align-items: center;
    gap: var(--ni-2);

    :global(.trakt-button) {
      display: flex;
      flex-direction: row-reverse;

      /* To align the button icon instead of the ghost button border */
      margin-left: var(--ni-neg-28);
    }
  }
</style>
