<script lang="ts">
  import Card from "$lib/components/card/Card.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { ExtendedMediaType } from "$lib/requests/models/ExtendedMediaType";
  import type { MediaComment } from "$lib/requests/models/MediaComment";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import ReactAction from "../comment-actions/ReactAction.svelte";
  import ReplyButton from "../comment-actions/ReplyButton.svelte";
  import ViewRepliesAction from "../comment-actions/ViewRepliesAction.svelte";
  import CommentBody from "../CommentBody.svelte";
  import CommentFooter from "../CommentFooter.svelte";
  import CommentHeader from "../CommentHeader.svelte";
  import ShadowScroller from "../ShadowScroller.svelte";
  import UserComment from "../UserComment.svelte";
  import CommentInput from "./CommentInput.svelte";
  import { useCommentReplies } from "./useCommentReplies";

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
  const { list } = $derived(useCommentReplies({ id: comment.id }));
</script>

{#snippet userThread(userComment: MediaComment)}
  <CommentHeader comment={userComment} {type} />

  <ShadowScroller>
    <div class="trakt-comment-thread">
      <CommentBody comment={userComment} {media} />

      {#if $list}
        {#each $list as reply}
          <div class="trakt-comment-container">
            <UserComment comment={reply} {media} {type} />
          </div>
        {/each}
      {/if}
    </div>
  </ShadowScroller>

  <CommentFooter>
    <ReactAction comment={userComment} />
    <ViewRepliesAction comment={userComment} />
    <ReplyButton
      comment={userComment}
      onClick={() => setReplying(userComment, !isReplying)}
    />
  </CommentFooter>

  {#if isReplying}
    <CommentInput
      id={userComment.id}
      commentType="reply"
      onCommentPost={reset}
      placeholder={m.textarea_placeholder_reply()}
      label={m.button_label_post_reply()}
    />
  {/if}
{/snippet}

<!-- FIXME: further reduce duplication, merge with regular CommentCard -->
<Card
  --width-card="var(--width-comment-thread-card)"
  --height-card="min(var(--height-comment-thread-card), calc(0.65 * var(--dialog-height)))"
>
  <div class="trakt-comment-thread-container">
    {@render userThread(comment)}
  </div>
</Card>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-comment-thread-container {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);
    justify-content: flex-start;

    padding: var(--ni-16) var(--ni-20);

    height: 100%;
    box-sizing: border-box;

    :global(.trakt-spoiler) {
      cursor: pointer;
    }
  }

  .trakt-comment-thread {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xl);
  }

  .trakt-comment-container {
    --comment-reply-offset: calc(var(--ni-32) + var(--gap-s));

    :global(.trakt-shadow-wrapper) {
      margin-left: var(--comment-reply-offset);
    }

    :global(.trakt-comment-footer) {
      margin-left: calc(var(--comment-reply-offset) + var(--ni-neg-18));
    }

    display: flex;
    flex-direction: column;
    gap: var(--gap-s);
  }
</style>
