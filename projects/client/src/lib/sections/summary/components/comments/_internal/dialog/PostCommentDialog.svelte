<script lang="ts">
  import Dialog from "$lib/components/dialogs/Dialog.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { CommentsProps } from "$lib/sections/summary/components/comments/CommentsProps";
  import { writable, type Writable } from "svelte/store";
  import type { ActiveComment } from "../models/ActiveComment";
  import CommentInput from "./CommentInput.svelte";

  type PostCommentDialogProps = {
    dialog: Writable<HTMLDialogElement>;
    onCommentPost: (comment: ActiveComment) => void;
  } & CommentsProps;

  const {
    dialog = writable(),
    onCommentPost,
    media,
    ...props
  }: PostCommentDialogProps = $props();
</script>

<Dialog title={m.dialog_title_comment()} {dialog}>
  <div class="trakt-comment-container">
    <CommentInput
      {media}
      {...props}
      commentType="post"
      sizing="normal"
      label={m.button_label_add_new_comment()}
      placeholder={m.textarea_placeholder_comment()}
      onCommentPost={(comment) => {
        onCommentPost(comment);
        $dialog.close();
      }}
    />
  </div>
</Dialog>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-comment-container {
    height: 100%;

    display: flex;
    align-items: center;
    justify-content: center;

    :global(trakt-comment-input) {
      width: var(--width-comment-thread-card);
      height: min(
        var(--height-comment-thread-list),
        calc(0.7 * var(--dialog-height))
      );
    }

    :global(.trakt-comment-reply-box) {
      padding: var(--ni-16);
      height: 100%;
    }
  }
</style>
