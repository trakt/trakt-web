<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import Form from "$lib/components/form/Form.svelte";
  import FormTextArea from "$lib/components/form/FormTextArea.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { toTranslatedErrorComment } from "$lib/utils/formatting/string/toTranslatedErrorComment";
  import type { CommentsProps } from "../../CommentsProps";
  import SpoilerSwitch from "../comment-input/SpoilerSwitch.svelte";
  import CommentError from "../CommentError.svelte";
  import type { ActiveComment } from "../models/ActiveComment";
  import { usePostComment } from "../usePostComment";
  import { isReviewValid } from "./isReviewValid";

  const {
    onClose,
    onCommentPost,
    ...props
  }: {
    onClose: () => void;
    onCommentPost: (comment: ActiveComment) => void;
  } & CommentsProps = $props();

  let isOpen = $state(true);
  let comment = $state("");
  let isSpoiler = $state(false);

  const { postComment, isCommenting, error } = usePostComment();

  async function handleSubmit() {
    const response = await postComment({
      commentType: "post",
      comment,
      isSpoiler,
      ...props,
    });

    if ($error || !response) {
      return;
    }

    onCommentPost({
      id: response.id,
      isReplying: false,
    });

    isOpen && onClose();
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
    confirmButtonText={m.button_text_add_review()}
    confirmButtonLabel={m.button_label_add_comment()}
  >
    <div class="trakt-review-properties">
      <FormTextArea
        placeholder={m.textarea_placeholder_comment()}
        onChange={(value) => (comment = value)}
        disabled={$isCommenting}
        autofocus
        validation={{
          isValid: isReviewValid,
          errorText: m.translated_value_error_comment_invalid_content(),
        }}
      />

      {#if $error}
        <CommentError
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
