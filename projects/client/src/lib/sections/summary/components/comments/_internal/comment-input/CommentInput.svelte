<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import DismissibleError from "$lib/components/errors/DismissibleError.svelte";
  import PostMessageIcon from "$lib/components/icons/PostMessageIcon.svelte";
  import RichTextEditor from "$lib/components/rich-text/RichTextEditor.svelte";
  import GifButton from "$lib/features/gif-picker/GifButton.svelte";
  import { fromRune } from "$lib/utils/store/fromRune.svelte.ts";
  import { klipyCustomerId } from "$lib/features/gif-picker/klipyCustomerId.ts";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia.ts";
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
  import SelectedGif from "./SelectedGif.svelte";
  import SpoilerSwitch from "./SpoilerSwitch.svelte";
  import { toCommentDraftGif } from "./toCommentDraftGif.ts";

  type CommentInputProps = {
    label: string;
    placeholder: string;
    onCommentPost: (comment: ActiveComment) => void;
    gifSuggestedQuery?: string;
    mentionSource: MediaMentionSource;
  } & UseAddCommentProps;

  const {
    label,
    placeholder,
    onCommentPost,
    gifSuggestedQuery,
    mentionSource,
    ...props
  }: CommentInputProps = $props();

  let comment = $state("");
  let isSpoiler = $state(false);
  let gif = $state<CommentDraftGif | null>(null);

  const customerId = klipyCustomerId();

  const isReducedMotion = useMedia(WellKnownMediaQuery.reducedMotion);

  const { postComment, isCommenting, error } = usePostComment();
  const { mentions } = useMediaMentions(fromRune(() => mentionSource));

  const hasSomethingToSay = $derived(comment.trim().length > 0 || gif != null);

  const postCommentHandler = async () => {
    const response = await postComment({
      comment: comment.trim(),
      gif: gif ? { url: gif.url, width: gif.width, height: gif.height } : null,
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

<trakt-comment-input>
  <div
    class="trakt-comment-reply-box"
    class:is-disabled={$isCommenting}
    transition:slide={{ duration: 150 }}
  >
    <RichTextEditor
      value={comment}
      onChange={(markdown) => (comment = markdown)}
      {placeholder}
      label={placeholder}
      disabled={$isCommenting}
      autofocus
      mentions={$mentions}
    />

    <div class="trakt-comment-actions">
      <SpoilerSwitch
        size="small"
        disabled={$isCommenting}
        isChecked={isSpoiler}
        onclick={() => (isSpoiler = !isSpoiler)}
      />

      <div class="comment-send-actions">
        <GifButton
          disabled={$isCommenting}
          suggestedQuery={gifSuggestedQuery}
          onSelect={(selected) => (gif = toCommentDraftGif(selected))}
        />

        <ActionButton
          onclick={postCommentHandler}
          {label}
          style="ghost"
          color="purple"
          size="small"
          variant="secondary"
          disabled={$isCommenting || !hasSomethingToSay}
        >
          <PostMessageIcon style={hasSomethingToSay ? "filled" : "open"} />
        </ActionButton>
      </div>
    </div>
  </div>

  {#if gif}
    <div transition:slide={{ duration: $isReducedMotion ? 0 : 150 }}>
      <SelectedGif
        {gif}
        disabled={$isCommenting}
        onRemove={() => (gif = null)}
      />
    </div>
  {/if}
  {#if $error}
    <DismissibleError
      message={toTranslatedErrorComment($error)}
      onDismiss={() => error.next(null)}
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
    flex-direction: column;
    gap: var(--gap-xs);

    padding: var(--ni-8);
    padding-inline-start: var(--ni-16);
    box-sizing: border-box;

    border-radius: var(--border-radius-s);
    border: var(--ni-2) var(--purple-50) solid;

    color: var(--color-text-primary);
    background-color: var(--color-input-background);

    transition: border-color var(--transition-increment) ease-in-out;

    backdrop-filter: blur(var(--ni-4));

    &:focus-within {
      border-color: var(--purple-500);
    }

    &.is-disabled {
      border-color: var(--color-surface-button-disabled);
    }
  }

  .trakt-comment-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--gap-s);
  }

  .comment-send-actions {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
  }
</style>
