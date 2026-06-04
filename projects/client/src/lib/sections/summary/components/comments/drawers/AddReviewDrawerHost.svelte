<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import DismissibleError from "$lib/components/errors/DismissibleError.svelte";
  import Form from "$lib/components/form/Form.svelte";
  import FormTextArea from "$lib/components/form/FormTextArea.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaComment } from "$lib/requests/models/MediaComment.ts";
  import { toTranslatedErrorComment } from "$lib/utils/formatting/string/toTranslatedErrorComment.ts";
  import { iffy } from "$lib/utils/function/iffy.ts";
  import SpoilerSwitch from "../_internal/comment-input/SpoilerSwitch.svelte";
  import type { ActiveComment } from "../_internal/models/ActiveComment.ts";
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

  let isOpen = $state(true);
  let comment = $state(initialComment);
  let isSpoiler = $state(initialIsSpoiler);

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
      comment,
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
  <SpoilerSwitch
    disabled={$isCommenting}
    isChecked={isSpoiler}
    onclick={() => (isSpoiler = !isSpoiler)}
  />
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
    confirmButtonText={isEditing
      ? m.button_text_edit_comment()
      : m.button_text_add_review()}
    confirmButtonLabel={isEditing
      ? m.button_label_edit_comment()
      : m.button_label_add_comment()}
  >
    <div class="trakt-review-properties">
      <FormTextArea
        placeholder={m.textarea_placeholder_comment()}
        onChange={(value) => (comment = value)}
        disabled={$isCommenting}
        autofocus
        value={comment}
        validation={{
          isValid: isReviewValid,
          errorText: m.translated_value_error_comment_invalid_content(),
        }}
      />

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
</style>
