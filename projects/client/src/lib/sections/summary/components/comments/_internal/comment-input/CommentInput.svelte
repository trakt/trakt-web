<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import DismissibleError from "$lib/components/errors/DismissibleError.svelte";
  import PostMessageIcon from "$lib/components/icons/PostMessageIcon.svelte";
  import GifButton from "$lib/features/gif-picker/GifButton.svelte";
  import { klipyCustomerId } from "$lib/features/gif-picker/klipyCustomerId.ts";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia.ts";
  import { NOOP_FN } from "$lib/utils/constants";
  import { toTranslatedErrorComment } from "$lib/utils/formatting/string/toTranslatedErrorComment";
  import { onMount } from "svelte";
  import { slide } from "svelte/transition";
  import type { ActiveComment } from "../models/ActiveComment";
  import type { CommentDraftGif } from "../models/CommentDraftGif.ts";
  import { reportGifShare } from "../reportGifShare.ts";
  import { usePostComment, type UseAddCommentProps } from "../usePostComment";
  import { autoResizeArea as autoResizeAreaFn } from "./autoResizeArea";
  import SelectedGif from "./SelectedGif.svelte";
  import SpoilerSwitch from "./SpoilerSwitch.svelte";
  import { toCommentDraftGif } from "./toCommentDraftGif.ts";
  import { useContentObserver } from "./useContentObserver";

  type CommentInputProps = {
    label: string;
    placeholder: string;
    onCommentPost: (comment: ActiveComment) => void;
    sizing?: "normal" | "auto";
    gifSuggestedQuery?: string;
  } & UseAddCommentProps;

  const {
    label,
    placeholder,
    onCommentPost,
    sizing = "auto",
    gifSuggestedQuery,
    ...props
  }: CommentInputProps = $props();

  let textAreaElement: HTMLTextAreaElement;
  let isSpoiler = $state(false);
  let gif = $state<CommentDraftGif | null>(null);

  const customerId = klipyCustomerId();

  const isReducedMotion = useMedia(WellKnownMediaQuery.reducedMotion);

  const { contentObserver, hasContent } = $derived(useContentObserver());
  const { postComment, isCommenting, error } = usePostComment();

  const autoResizeArea = $derived(
    sizing === "auto" ? autoResizeAreaFn : NOOP_FN,
  );

  const hasSomethingToSay = $derived($hasContent || gif != null);

  const postCommentHandler = async () => {
    const response = await postComment({
      comment: textAreaElement.value.trim(),
      gif: gif ? { url: gif.url, width: gif.width, height: gif.height } : null,
      isSpoiler,
      ...props,
    });

    if (!response) {
      return;
    }

    reportGifShare({ gif, customerId });

    textAreaElement.value = "";
    gif = null;
    onCommentPost({
      id: response.id,
      isReplying: false,
    });
  };

  onMount(() => {
    textAreaElement.focus();
  });

  // FIXME: merge with the component in the drawer
</script>

<trakt-comment-input>
  <div class="trakt-comment-reply-box" transition:slide={{ duration: 150 }}>
    <textarea
      bind:this={textAreaElement}
      use:contentObserver
      use:autoResizeArea
      disabled={$isCommenting}
      {placeholder}
    ></textarea>

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

    textarea {
      all: unset;
      width: 100%;

      &::-webkit-scrollbar-corner {
        background-color: transparent;
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
    justify-content: space-between;
    gap: var(--gap-s);
  }

  .comment-send-actions {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
  }
</style>
