<script lang="ts">
  import CollapseIcon from "$lib/components/lists/section-list/CollapseIcon.svelte";
  import ExpandIcon from "$lib/components/lists/section-list/ExpandIcon.svelte";
  import type { ExtendedMediaType } from "$lib/requests/models/ExtendedMediaType";
  import type { MediaComment } from "$lib/requests/models/MediaComment";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import LoadingIndicator from "$lib/sections/lists/drilldown/_internal/LoadingIndicator.svelte";
  import { BehaviorSubject } from "rxjs";
  import { slide } from "svelte/transition";
  import UserComment from "../UserComment.svelte";
  import { useCommentReplies } from "./useCommentReplies";

  const {
    comment,
    media,
    type,
  }: { comment: MediaComment; media: MediaEntry; type: ExtendedMediaType } =
    $props();

  const showReplies = new BehaviorSubject(false);

  const { list, isLoading } = $derived(useCommentReplies({ id: comment.id }));
</script>

{#if comment.replyCount > 0}
  <button
    class="toggle-replies-button"
    onclick={() => showReplies.next(!$showReplies)}
  >
    {#if $showReplies}
      {#if $isLoading}
        <LoadingIndicator />
      {:else}
        <CollapseIcon />
      {/if}
    {:else}
      <ExpandIcon />
    {/if}
    <span class="bold">
      {comment.replyCount} replies
    </span>
  </button>
{/if}

{#if $showReplies && !$isLoading}
  <div
    class="trakt-comment-replies"
    transition:slide={{ duration: 150, axis: "y" }}
  >
    {#each $list as reply}
      <div class="trakt-comment-container">
        <UserComment comment={reply} {media} {type} />
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

    padding-left: var(--ni-32);
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
