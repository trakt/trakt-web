<script lang="ts">
  import LikeCommentButton from "$lib/components/buttons/like-comment/LikeCommentButton.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import type { MediaComment } from "$lib/requests/models/MediaComment";
  import { useCommentLikes } from "./useCommentLikes";

  type LikeCommentButtonProps = {
    comment: MediaComment;
  };

  const { comment }: LikeCommentButtonProps = $props();

  const { likes } = useUser();
  const { like, unlike, isLiking } = $derived(
    useCommentLikes({ id: comment.id }),
  );

  const isLiked = $derived(
    !!$likes?.some((like) => like.type === "comment" && like.id === comment.id),
  );
</script>

<LikeCommentButton
  style="normal"
  size="normal"
  onLike={like}
  onUnlike={unlike}
  {isLiked}
  isLiking={$isLiking}
  likeCount={comment.likeCount}
/>
