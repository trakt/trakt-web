<script lang="ts">
  import DismissibleError from "$lib/components/errors/DismissibleError.svelte";
  import Form from "$lib/components/form/Form.svelte";
  import FormRichTextArea from "$lib/components/form/FormRichTextArea.svelte";
  import GifButton from "$lib/features/gif-picker/GifButton.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { fromRune } from "$lib/utils/store/fromRune.svelte.ts";
  import { klipyCustomerId } from "$lib/features/gif-picker/klipyCustomerId.ts";
  import { useMotionDuration } from "$lib/stores/css/useMotionDuration.ts";
  import { toTranslatedErrorComment } from "$lib/utils/formatting/string/toTranslatedErrorComment";
  import { slide } from "svelte/transition";
  import type { ActiveComment } from "../models/ActiveComment";
  import type { CommentDraftGif } from "../models/CommentDraftGif.ts";
  import { reportGifShare } from "../reportGifShare.ts";
  import { usePostComment, type UseAddCommentProps } from "../usePostComment";
  import {
    useMediaMentions,
    type MediaMentionSource,
  } from "../useMediaMentions.ts";
  import ComposerGif from "./ComposerGif.svelte";
  import SpoilerSwitch from "./SpoilerSwitch.svelte";
  import { toCommentDraftGif } from "./toCommentDraftGif.ts";

  type CommentInputProps = {
    label: string;
    placeholder: string;
    onCommentPost: (comment: ActiveComment) => void;
    onCancel: () => void;
    gifSuggestedQuery?: string;
    mentionSource: MediaMentionSource;
  } & UseAddCommentProps;

  const {
    label,
    placeholder,
    onCommentPost,
    onCancel,
    gifSuggestedQuery,
    mentionSource,
    ...props
  }: CommentInputProps = $props();

  let comment = $state("");
  let isSpoiler = $state(false);
  let gif = $state<CommentDraftGif | null>(null);

  const customerId = klipyCustomerId();

  const duration = useMotionDuration();

  const { postComment, isCommenting, error } = usePostComment();
  const { mentions } = useMediaMentions(fromRune(() => mentionSource));

  const hasSomethingToSay = $derived(comment.trim().length > 0 || gif != null);

  const postCommentHandler = async () => {
    const response = await postComment({
      comment: comment.trim(),
      gif: gif ? { url: gif.url } : null,
      isSpoiler,
      ...props,
    });

    if (!response) {
      return;
    }

    reportGifShare({ gif, customerId });

    comment = "";
    gif = null;
    onCommentPost({
      id: response.id,
      isReplying: false,
    });
  };

  // FIXME: merge with the component in the drawer
</script>

{#snippet actions()}
  <GifButton
    disabled={$isCommenting}
    suggestedQuery={gifSuggestedQuery}
    onSelect={(selected) => (gif = toCommentDraftGif(selected))}
  />
{/snippet}

{#snippet selectedGif()}
  <ComposerGif {gif} disabled={$isCommenting} onRemove={() => (gif = null)} />
{/snippet}

<trakt-comment-input
  transition:slide={{ duration: $duration(150) }}
>
  <div class="comment-input-header">
    <SpoilerSwitch
      size="small"
      disabled={$isCommenting}
      isChecked={isSpoiler}
      onclick={() => (isSpoiler = !isSpoiler)}
    />
  </div>

  <Form
    onSubmit={postCommentHandler}
    {onCancel}
    disabled={$isCommenting}
    isCancelDisabled={$isCommenting}
    isValid={hasSomethingToSay}
    inlineActions
    confirmButtonFill="solid"
    confirmButtonText={m.button_text_add_reply()}
    confirmButtonLabel={label}
  >
    <div class="comment-input-body">
      <FormRichTextArea
        value={comment}
        onChange={(markdown) => (comment = markdown)}
        {placeholder}
        disabled={$isCommenting}
        autofocus
        mentions={$mentions}
        {actions}
        attachment={selectedGif}
        --rich-textarea-min-height="var(--ni-96)"
      />

      {#if $error}
        <DismissibleError
          message={toTranslatedErrorComment($error)}
          onDismiss={() => error.next(null)}
        />
      {/if}
    </div>
  </Form>
</trakt-comment-input>

<style>
  trakt-comment-input {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
  }

  .comment-input-body {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
  }

  .comment-input-header {
    display: flex;
    justify-content: flex-end;
  }
</style>
