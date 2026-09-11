<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import DismissibleError from "$lib/components/errors/DismissibleError.svelte";
  import PostMessageIcon from "$lib/components/icons/PostMessageIcon.svelte";
  import GifButton from "$lib/features/gif-picker/GifButton.svelte";
  import { NOOP_FN } from "$lib/utils/constants";
  import { toTranslatedErrorComment } from "$lib/utils/formatting/string/toTranslatedErrorComment";
  import { onMount } from "svelte";
  import { slide } from "svelte/transition";
  import type { ActiveComment } from "../models/ActiveComment";
  import type { CommentDraftGif } from "../models/CommentDraftGif";
  import { usePostComment, type UseAddCommentProps } from "../usePostComment";
  import { autoResizeArea as autoResizeAreaFn } from "./autoResizeArea";
  import SelectedGif from "./SelectedGif.svelte";
  import SpoilerSwitch from "./SpoilerSwitch.svelte";
  import { toCommentBody } from "./toCommentBody";
  import { toCommentDraftGif } from "./toCommentDraftGif";
  import { useContentObserver } from "./useContentObserver";

  type CommentInputProps = {
    label: string;
    placeholder: string;
    onCommentPost: (comment: ActiveComment) => void;
    sizing?: "normal" | "auto";
  } & UseAddCommentProps;

  const {
    label,
    placeholder,
    onCommentPost,
    sizing = "auto",
    ...props
  }: CommentInputProps = $props();

  let textAreaElement: HTMLTextAreaElement;
  let isSpoiler = $state(false);
  let gif = $state<CommentDraftGif | null>(null);

  const { contentObserver, hasContent } = $derived(useContentObserver());
  const { postComment, isCommenting, error } = usePostComment();

  const autoResizeArea = $derived(
    sizing === "auto" ? autoResizeAreaFn : NOOP_FN,
  );

  // A gif on its own is a comment, so it counts as content by itself.
  const hasSomethingToSay = $derived($hasContent || gif != null);

  const postCommentHandler = async () => {
    const response = await postComment({
      comment: toCommentBody({ text: textAreaElement.value, gif }),
      isSpoiler,
      ...props,
    });

    if (!response) {
      return;
    }

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
  {#if gif}
    <SelectedGif
      {gif}
      disabled={$isCommenting}
      onRemove={() => (gif = null)}
    />
  {/if}

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
        disabled={$isCommenting}
        isChecked={isSpoiler}
        onclick={() => (isSpoiler = !isSpoiler)}
      />

      <GifButton
        disabled={$isCommenting}
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
    align-items: center;
    gap: var(--gap-s);

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

    // The gif button makes this row dense enough to overflow a narrow reply
    // box, so it wraps rather than pushing the send button off the edge.
    flex-wrap: wrap;
    justify-content: flex-end;

    gap: var(--gap-s);
  }
</style>
