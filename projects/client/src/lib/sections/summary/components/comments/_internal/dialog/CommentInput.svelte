<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import PostMessageIcon from "$lib/components/icons/PostMessageIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaComment } from "$lib/requests/models/MediaComment";
  import { onMount } from "svelte";
  import { slide } from "svelte/transition";
  import CommentError from "./CommentError.svelte";
  import SpoilerSwitch from "./SpoilerSwitch.svelte";
  import { toTranslatedError } from "./toTranslatedError";
  import { MIN_ROWS, useDynamicTextArea } from "./useDynamicTextArea";
  import { useReplyToComment } from "./useReplyToComment";

  type CommentInputProps = {
    comment: MediaComment;
    onCommentPost: () => void;
  };

  let textAreaElement: HTMLTextAreaElement;

  const { comment, onCommentPost }: CommentInputProps = $props();

  const { autoResizeArea, hasContent } = $derived(useDynamicTextArea());
  const { isPostingReply, replyToComment, isSpoiler, error } =
    useReplyToComment({
      id: comment.id,
    });

  const onReply = async () => {
    const response = await replyToComment(textAreaElement.value);
    response.success && onCommentPost();
  };

  onMount(() => {
    textAreaElement.focus();
  });
</script>

<trakt-comment-input>
  <div class="trakt-comment-reply-box" transition:slide={{ duration: 150 }}>
    <textarea
      bind:this={textAreaElement}
      use:autoResizeArea
      disabled={$isPostingReply}
      rows={MIN_ROWS}
      placeholder={m.comment_reply_placeholder()}
    ></textarea>

    <div class="trakt-comment-actions">
      <SpoilerSwitch
        isReplying={$isPostingReply}
        enabled={$isSpoiler}
        onclick={() => isSpoiler.update((value) => !value)}
      />

      <ActionButton
        onclick={onReply}
        label={m.comment_post_reply_label()}
        style="ghost"
        color="purple"
        size="small"
        variant="secondary"
        disabled={$isPostingReply || !$hasContent}
      >
        <PostMessageIcon style={$hasContent ? "filled" : "open"} />
      </ActionButton>
    </div>
  </div>
  {#if $error}
    <CommentError
      message={toTranslatedError($error)}
      onDismiss={() => error.set(null)}
    />
  {/if}
</trakt-comment-input>

<style lang="scss">
  @use "$style/scss/mixins/index.scss" as *;

  trakt-comment-input {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xxs);
  }

  .trakt-comment-reply-box {
    width: 100%;

    display: flex;
    align-items: center;
    gap: var(--gap-s);

    padding: var(--ni-8);
    padding-left: var(--ni-16);
    box-sizing: border-box;

    border-radius: var(--border-radius-s);
    border: var(--ni-2) var(--purple-50) solid;

    color: var(--color-text-primary);

    transition: border-color var(--transition-increment) ease-in-out;

    @include backdrop-filter-blur(var(--ni-4));

    textarea {
      all: unset;
      flex-grow: 1;

      &::-webkit-scrollbar-corner {
        background-color: transparent;
      }
    }

    &:has(textarea:not([rows="1"])) {
      flex-direction: column;

      textarea {
        width: 100%;
      }
    }

    &:has(textarea:focus-within) {
      border-color: var(--purple-500);
    }

    &:has(textarea[disabled]) {
      border-color: var(--color-surface-button-disabled);
    }
  }

  .trakt-comment-actions {
    display: flex;
    align-items: center;
    align-self: end;

    gap: var(--gap-s);
  }
</style>
