<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { CommentsProps } from "../CommentsProps.ts";
  import ReviewsDrawerShell from "./_internal/ReviewsDrawerShell.svelte";
  import { useSingleReview } from "./useSingleReview.ts";

  type ReviewDrawerProps = {
    commentId: number;
    onClose: () => void;
  } & CommentsProps;

  const { commentId, onClose, media, ...props }: ReviewDrawerProps = $props();

  const useList = $derived(useSingleReview({ commentId }));

  let isOpened = $state(false);
</script>

<Drawer
  {onClose}
  title={m.dialog_title_comment()}
  size="large"
  metaInfo={media.title}
  onOpened={() => (isOpened = true)}
>
  {#if isOpened}
    <ReviewsDrawerShell {useList} {media} {...props} />
  {/if}
</Drawer>
