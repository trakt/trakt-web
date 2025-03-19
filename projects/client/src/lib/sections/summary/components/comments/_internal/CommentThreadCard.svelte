<script lang="ts">
  import Card from "$lib/components/card/Card.svelte";
  import type { MediaComment } from "$lib/requests/models/MediaComment";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import CommentBody from "./CommentBody.svelte";
  import CommentFooter from "./CommentFooter.svelte";
  import CommentHeader from "./CommentHeader.svelte";
  import ShadowScroller from "./ShadowScroller.svelte";
  import { useCommentReplies } from "./useCommentReplies";

  type CommentThreadCardProps = {
    comment: MediaComment;
    media: MediaEntry;
  };

  const { comment, media }: CommentThreadCardProps = $props();
  const { list } = $derived(useCommentReplies({ id: comment.id }));
</script>

<Card
  --width-card="min(var(--width-comment-thread-card), 85vw)"
  --height-card="min(var(--height-comment-thread-card), 65vh)"
>
  <div class="trakt-comment-thread-container">
    <CommentHeader {comment} />

    <ShadowScroller>
      <div class="trakt-comment-thread">
        <CommentBody {comment} {media} />

        {#if $list}
          {#each $list as reply}
            <div class="trakt-comment-container">
              <CommentHeader comment={reply} />
              <CommentBody comment={reply} {media} />
              <CommentFooter comment={reply} />
            </div>
          {/each}
        {/if}
      </div>
    </ShadowScroller>

    <CommentFooter {comment} />
  </div>
</Card>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-comment-thread-container {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);
    justify-content: flex-start;

    padding: var(--ni-16) var(--ni-20);

    height: 100%;
    box-sizing: border-box;

    :global(.trakt-spoiler) {
      cursor: pointer;
    }
  }

  .trakt-comment-thread {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xl);
  }

  .trakt-comment-container {
    :global(.trakt-shadow-wrapper),
    :global(.trakt-comment-footer) {
      margin-left: calc(var(--ni-32) + var(--gap-s));
    }

    display: flex;
    flex-direction: column;
    gap: var(--gap-s);
  }
</style>
