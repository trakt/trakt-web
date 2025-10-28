<script lang="ts">
  import Card from "$lib/components/card/Card.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { ExtendedMediaType } from "$lib/requests/models/ExtendedMediaType";
  import type { MediaComment } from "$lib/requests/models/MediaComment";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import ReactAction from "../comment-actions/ReactAction.svelte";
  import ReplyButton from "../comment-actions/ReplyButton.svelte";
  import CommentInput from "../comment-input/CommentInput.svelte";
  import CommentBody from "../CommentBody.svelte";
  import CommentFooter from "../CommentFooter.svelte";
  import CommentHeader from "../CommentHeader.svelte";
  import CommentReplies from "./CommentReplies.svelte";

  type CommentThreadCardProps = {
    comment: MediaComment;
    media: MediaEntry;
    reset: () => void;
    isReplying: boolean;
    setReplying: (comment: MediaComment, isReplying: boolean) => void;
    type: ExtendedMediaType;
  };

  const {
    comment,
    media,
    isReplying,
    setReplying,
    reset,
    type,
  }: CommentThreadCardProps = $props();
</script>

<Card --width-card="100%" --height-card="fit-content">
  <div class="trakt-comment-thread-container">
    <CommentHeader {comment} {type} />

    <div class="trakt-comment-thread">
      <CommentBody {comment} {media} type="full" />
      <CommentReplies {comment} {media} {type} />
    </div>

    <CommentFooter>
      <ReactAction {comment} />
      <ReplyButton
        {comment}
        onClick={() => setReplying(comment, !isReplying)}
      />
    </CommentFooter>

    {#if isReplying}
      <CommentInput
        id={comment.id}
        commentType="reply"
        onCommentPost={reset}
        placeholder={m.textarea_placeholder_reply()}
        label={m.button_label_post_reply()}
      />
    {/if}
  </div>
</Card>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-comment-thread-container {
    --vertical-padding: var(--ni-16);

    display: flex;
    flex-direction: column;
    gap: var(--gap-m);
    justify-content: flex-start;

    padding: var(--vertical-padding) var(--ni-20);

    min-height: calc(var(--height-comment-card) - 2 * var(--vertical-padding));
    height: 100%;
    box-sizing: border-box;

    :global(.trakt-spoiler) {
      cursor: pointer;
    }
  }

  .trakt-comment-thread {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);
  }
</style>
