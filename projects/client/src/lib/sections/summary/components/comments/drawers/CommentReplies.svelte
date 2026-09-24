<script lang="ts">
  import LoadingIndicator from "$lib/components/icons/LoadingIndicator.svelte";
  import CollapseIcon from "$lib/components/lists/section-list/CollapseIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaComment } from "$lib/requests/models/MediaComment";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import { slide } from "svelte/transition";
  import CommentReply from "../_internal/CommentReply.svelte";
  import type { CommentTypeProps } from "../CommentsProps";
  import { useCommentReplies } from "./useCommentReplies";

  type CommentRepliesProps = {
    comment: MediaComment;
    media: MediaEntry;
    isExpanded: boolean;
    onToggle: () => void;
  } & CommentTypeProps;

  const {
    comment,
    media,
    isExpanded,
    onToggle,
    ...typeProps
  }: CommentRepliesProps = $props();

  const { list, isLoading } = $derived(useCommentReplies({ id: comment.id }));

  const isAwaitingReplies = $derived($isLoading && $list.length === 0);
</script>

{#if comment.replyCount > 0}
  <button
    class="toggle-replies-button"
    onclick={onToggle}
  >
    {#if isExpanded}
      {#if $isLoading}
        <LoadingIndicator />
      {:else}
        <CollapseIcon state="collapsed" />
      {/if}
    {:else}
      <CollapseIcon state="expanded" />
    {/if}
    <span class="bold">
      {m.button_text_comment_replies({ count: comment.replyCount })}
    </span>
  </button>
{/if}

{#if isExpanded && !isAwaitingReplies}
  <div
    class="trakt-comment-replies"
    transition:slide={{ duration: 150, axis: "y" }}
  >
    {#each $list as reply (reply.id)}
      <div class="trakt-comment-container">
        <CommentReply comment={reply} {media} {...typeProps} />
      </div>
    {/each}
  </div>
{/if}

<style>
  .trakt-comment-container {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);
  }

  .trakt-comment-replies {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xl);

    padding-inline-start: var(--ni-32);
  }

  .toggle-replies-button {
    all: unset;
    -webkit-tap-highlight-color: transparent;

    display: flex;
    gap: var(--gap-xs);
    align-items: center;

    color: var(--color-text-secondary);

    transition: color var(--transition-increment) ease-in-out;

    color: var(--purple-400);
    cursor: pointer;

    &:hover {
      color: var(--purple-500);
    }

    :global(svg) {
      width: var(--ni-12);
      height: var(--ni-12);
      flex-shrink: 0;
    }
  }
</style>
