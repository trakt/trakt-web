<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import { useConfirm } from "$lib/features/confirmation/useConfirm.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { CommentsProps } from "../CommentsProps.ts";
  import ReviewsDrawerShell from "./_internal/ReviewsDrawerShell.svelte";
  import { useActiveComment } from "./useActiveComment.ts";
  import { useSingleReview } from "./useSingleReview.ts";

  type ReviewDrawerProps = {
    commentId: number;
    showReplies?: boolean;
    onClose: () => void;
    elevated?: boolean;
  } & CommentsProps;

  const {
    commentId,
    showReplies = false,
    onClose,
    elevated = false,
    media,
    ...props
  }: ReviewDrawerProps = $props();

  const useList = $derived(useSingleReview({ commentId }));

  let isOpened = $state(false);

  const { confirm } = useConfirm();
  const activeCommentState = useActiveComment({ confirm });
</script>

<Drawer
  onClose={() => activeCommentState.discardDraftThen(onClose)}
  title={m.dialog_title_comment()}
  size="large"
  metaInfo={media.title}
  {elevated}
  onOpened={() => (isOpened = true)}
>
  {#if isOpened}
    <ReviewsDrawerShell
      source={{ id: commentId, isReplying: false, showReplies }}
      {useList}
      {activeCommentState}
      {media}
      {...props}
    />
  {/if}
</Drawer>
