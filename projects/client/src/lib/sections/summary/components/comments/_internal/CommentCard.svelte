<script lang="ts">
  import Card from "$lib/components/card/Card.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { MediaComment } from "$lib/requests/models/MediaComment";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import LikeCommentAction from "./comment-actions/LikeCommentAction.svelte";
  import ReplyButton from "./comment-actions/ReplyButton.svelte";
  import ViewRepliesAction from "./comment-actions/ViewRepliesAction.svelte";
  import CommentBody from "./CommentBody.svelte";
  import CommentFooter from "./CommentFooter.svelte";
  import CommentHeader from "./CommentHeader.svelte";
  import type { ActiveComment } from "./models/ActiveComment";

  type CommentProps = {
    media: MediaEntry;
    comment: MediaComment;
    onDrilldown: (comment: ActiveComment) => void;
  };

  const { comment, media, onDrilldown }: CommentProps = $props();
</script>

<Card
  --width-card="min(var(--width-comment-card), 85vw)"
  --height-card="var(--height-comment-card)"
>
  <div class="trakt-comment-container">
    <CommentHeader {comment} />
    <CommentBody {comment} {media} />
    <CommentFooter>
      <LikeCommentAction {comment} />
      <ViewRepliesAction {comment} {onDrilldown} />
      <RenderFor audience="authenticated">
        <ReplyButton {comment} onClick={onDrilldown} />
      </RenderFor>
    </CommentFooter>
  </div>
</Card>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-comment-container {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);
    justify-content: space-between;

    padding: var(--ni-16) var(--ni-20);

    height: 100%;
    box-sizing: border-box;

    :global(.trakt-spoiler) {
      cursor: pointer;
    }
  }
</style>
