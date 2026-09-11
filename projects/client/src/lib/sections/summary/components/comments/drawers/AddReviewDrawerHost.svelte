<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import DismissibleError from "$lib/components/errors/DismissibleError.svelte";
  import Form from "$lib/components/form/Form.svelte";
  import FormTextArea from "$lib/components/form/FormTextArea.svelte";
  import GifButton from "$lib/features/gif-picker/GifButton.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaComment } from "$lib/requests/models/MediaComment.ts";
  import { toTranslatedErrorComment } from "$lib/utils/formatting/string/toTranslatedErrorComment.ts";
  import { iffy } from "$lib/utils/function/iffy.ts";
  import SelectedGif from "../_internal/comment-input/SelectedGif.svelte";
  import SpoilerSwitch from "../_internal/comment-input/SpoilerSwitch.svelte";
  import { toCommentBody } from "../_internal/comment-input/toCommentBody.ts";
  import { toCommentDraftGif } from "../_internal/comment-input/toCommentDraftGif.ts";
  import type { ActiveComment } from "../_internal/models/ActiveComment.ts";
  import type { CommentDraftGif } from "../_internal/models/CommentDraftGif.ts";
  import {
    type UseAddCommentProps,
    usePostComment,
  } from "../_internal/usePostComment.ts";
  import type { CommentsProps } from "../CommentsProps.ts";

  import { isReviewValid } from "./isReviewValid.ts";

  type PostMode = {
    mode: "post";
  };

  type EditMode = {
    mode: "edit";
    comment: MediaComment;
  };

  type AddReviewDrawerProps = {
    onClose: () => void;
    onCommentPost: (comment: ActiveComment) => void;
  } & CommentsProps &
    (PostMode | EditMode);

  const { onClose, onCommentPost, media, ...rest }: AddReviewDrawerProps =
    $props();

  const isEditing = $derived(rest.mode === "edit");

  const initialComment = iffy(() =>
    rest.mode === "edit" ? rest.comment.comment : "",
  );
  const initialIsSpoiler = iffy(() =>
    rest.mode === "edit" ? rest.comment.isSpoiler : false,
  );
  // A stored gif is its own preview - the picker's lighter variant is only
  // known while the comment is being written.
  const initialGif = iffy((): CommentDraftGif | null => {
    const url = rest.mode === "edit" ? rest.comment.gif : null;
    return url ? { url, previewUrl: url } : null;
  });

  let isOpen = $state(true);
  let comment = $state(initialComment);
  let isSpoiler = $state(initialIsSpoiler);
  let gif = $state(initialGif);

  // A gif is a comment on its own, so it waives the word minimum. Native
  // validity only re-reads the textarea on input and picking a gif is a click,
  // so the submit gate is spelled out here instead.
  const isSubmittable = $derived(gif != null || isReviewValid(comment));

  const { postComment, isCommenting, error } = usePostComment();

  const commentProps = $derived.by((): UseAddCommentProps => {
    if (rest.mode === "edit") {
      return {
        commentType: "edit",
        id: rest.comment.id,
        type: rest.type,
      };
    }

    return {
      commentType: "post",
      media,
      ...rest,
    };
  });

  async function handleSubmit() {
    const response = await postComment({
      comment: toCommentBody({ text: comment, gif }),
      isSpoiler,
      ...commentProps,
    });

    if ($error || !response) {
      return;
    }

    onCommentPost({
      id: response.id,
      isReplying: false,
    });

    if (isOpen) {
      onClose();
    }
  }
</script>

{#snippet badge()}
  <div class="trakt-review-badge">
    <GifButton
      disabled={$isCommenting}
      onSelect={(selected) => (gif = toCommentDraftGif(selected))}
    />

    <SpoilerSwitch
      disabled={$isCommenting}
      isChecked={isSpoiler}
      onclick={() => (isSpoiler = !isSpoiler)}
    />
  </div>
{/snippet}

<Drawer
  onClose={() => {
    isOpen = false;
    onClose();
  }}
  size="auto"
  title={m.dialog_title_comment()}
  classList="trakt-add-review-drawer"
  {badge}
>
  <Form
    onSubmit={handleSubmit}
    onCancel={onClose}
    disabled={$isCommenting}
    isValid={isSubmittable}
    confirmButtonText={isEditing
      ? m.button_text_edit_comment()
      : m.button_text_add_review()}
    confirmButtonLabel={isEditing
      ? m.button_label_edit_comment()
      : m.button_label_add_comment()}
  >
    <div class="trakt-review-properties">
      <!--
        Re-mounted when a gif comes or goes so the textarea repaints its own
        error state: the word minimum does not apply once a gif carries the
        comment, and it applies again the moment the gif is taken off.
      -->
      {#key gif != null}
        <FormTextArea
          placeholder={m.textarea_placeholder_comment()}
          onChange={(value) => (comment = value)}
          disabled={$isCommenting}
          autofocus
          value={comment}
          validation={{
            isValid: (review) => gif != null || isReviewValid(review),
            errorText: m.translated_value_error_comment_invalid_content(),
          }}
        />
      {/key}

      {#if gif}
        <SelectedGif
          {gif}
          disabled={$isCommenting}
          onRemove={() => (gif = null)}
        />
      {/if}

      {#if $error}
        <DismissibleError
          message={toTranslatedErrorComment($error)}
          onDismiss={() => error.next(null)}
        />
      {/if}
    </div>
  </Form>
</Drawer>

<style>
  :global(.trakt-add-review-drawer) {
    :global(.trakt-drawer-title-container) {
      flex-grow: 1;
      justify-content: space-between;
    }
  }

  .trakt-review-properties {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
  }

  .trakt-review-badge {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
  }
</style>
