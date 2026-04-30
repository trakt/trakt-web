<script lang="ts">
  import Card from "$lib/components/card/Card.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaComment } from "$lib/requests/models/MediaComment";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import type { Snippet } from "svelte";
  import ReactAction from "../_internal/comment-actions/ReactAction.svelte";
  import ReplyButton from "../_internal/comment-actions/ReplyButton.svelte";
  import CommentInput from "../_internal/comment-input/CommentInput.svelte";
  import CommentBody from "../_internal/CommentBody.svelte";
  import CommentFooter from "../_internal/CommentFooter.svelte";
  import CommentHeader from "../_internal/CommentHeader.svelte";
  import type {
    EpisodeCommentProps,
    MediaCommentProps,
  } from "../CommentsProps";
  import CommentReplies from "./CommentReplies.svelte";
  import { THREAD_LIST_CLASS } from "./constants";
  import { scrollActiveCommentIntoView } from "./scrollActiveCommentIntoView";

  type CommentThreadCardProps = {
    comment: MediaComment;
    media: MediaEntry;
    reset: () => void;
    isReplying: boolean;
    setReplying: (comment: MediaComment, isReplying: boolean) => void;
    shouldScrollIntoView: boolean;
    header?: Snippet;
    scrollContainerClass?: string;
  } & (MediaCommentProps | EpisodeCommentProps);

  const {
    comment,
    media,
    isReplying,
    setReplying,
    reset,
    shouldScrollIntoView,
    header,
    scrollContainerClass = THREAD_LIST_CLASS,
    ...typeProps
  }: CommentThreadCardProps = $props();

  const scrollIntoView = (node: HTMLElement) => {
    if (!shouldScrollIntoView) {
      return;
    }

    return scrollActiveCommentIntoView(node, scrollContainerClass);
  };
</script>

<Card
  --width-card="100%"
  --height-card="fit-content"
  classList="trakt-comment-thread-card"
  action={scrollIntoView}
>
  <div class="trakt-comment-thread-container">
    {#if header}
      {@render header()}
    {:else}
      <CommentHeader {comment} {media} {...typeProps} />
    {/if}

    <div class="trakt-comment-thread">
      <CommentBody {comment} {media} type="full" />
      <CommentReplies {comment} {media} {...typeProps} />
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
        type={typeProps.type}
      />
    {/if}
  </div>
</Card>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  :global(.trakt-card.trakt-comment-thread-card .trakt-card-content),
  .trakt-comment-thread-container {
    --vertical-padding: var(--ni-16);
    min-height: calc(var(--height-comment-card) - 2 * var(--vertical-padding));
  }

  .trakt-comment-thread-container {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);
    justify-content: flex-start;

    padding: var(--vertical-padding) var(--ni-20);

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
