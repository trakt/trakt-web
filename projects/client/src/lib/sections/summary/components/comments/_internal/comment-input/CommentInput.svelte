<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import PostMessageIcon from "$lib/components/icons/PostMessageIcon.svelte";
  import { NOOP_FN } from "$lib/utils/constants";
  import { toTranslatedErrorComment } from "$lib/utils/formatting/string/toTranslatedErrorComment";
  import { onMount } from "svelte";
  import { slide } from "svelte/transition";
  import type { ActiveComment } from "../models/ActiveComment";
  import { autoResizeArea as autoResizeAreaFn } from "./autoResizeArea";
  import CommentError from "./CommentError.svelte";
  import SpoilerSwitch from "./SpoilerSwitch.svelte";
  import { useContentObserver } from "./useContentObserver";
  import { usePostComment, type UseAddCommentProps } from "./usePostComment";

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

  const { contentObserver, hasContent } = $derived(useContentObserver());
  const { postComment, isCommenting, isSpoiler, error } = usePostComment({
    ...props,
  });

  const autoResizeArea = $derived(
    sizing === "auto" ? autoResizeAreaFn : NOOP_FN,
  );

  const postCommentHandler = async () => {
    const response = await postComment(textAreaElement.value);
    if (!response) {
      return;
    }

    textAreaElement.value = "";
    onCommentPost({
      id: response.id,
      isReplying: false,
    });
  };

  onMount(() => {
    textAreaElement.focus();
  });
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
        isReplying={$isCommenting}
        enabled={$isSpoiler}
        onclick={() => isSpoiler.next(!isSpoiler.value)}
      />

      <ActionButton
        onclick={postCommentHandler}
        {label}
        style="ghost"
        color="purple"
        size="small"
        variant="secondary"
        disabled={$isCommenting || !$hasContent}
      >
        <PostMessageIcon style={$hasContent ? "filled" : "open"} />
      </ActionButton>
    </div>
  </div>
  {#if $error}
    <CommentError
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
    padding-left: var(--ni-16);
    box-sizing: border-box;

    border-radius: var(--border-radius-s);
    border: var(--ni-2) var(--purple-50) solid;

    color: var(--color-text-primary);

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

    gap: var(--gap-s);
  }
</style>
