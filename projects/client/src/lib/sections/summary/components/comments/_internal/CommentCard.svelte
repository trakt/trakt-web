<script lang="ts">
  import Card from "$lib/components/card/Card.svelte";
  import type { ExtendedMediaType } from "$lib/requests/models/ExtendedMediaType";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import type { ActiveComment } from "./models/ActiveComment";
  import type { Comment } from "./models/Comment";
  import SentimentComment from "./SentimentComment.svelte";
  import UserComment from "./UserComment.svelte";

  type CommentProps = {
    media: MediaEntry;
    comment: Comment;
    onDrilldown: (comment: ActiveComment) => void;
    type: ExtendedMediaType;
  };

  const { comment, media, onDrilldown, type }: CommentProps = $props();
</script>

<Card
  --width-card="min(var(--width-comment-card), 85vw)"
  --height-card="var(--height-comment-card)"
>
  <div class="trakt-comment-container">
    {#if comment.type === "comment"}
      <UserComment {comment} {media} {onDrilldown} {type} />
    {/if}
    {#if comment.type === "sentiments"}
      <SentimentComment {comment} />
    {/if}
  </div>
</Card>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-comment-container {
    position: relative;

    display: flex;
    flex-direction: column;
    gap: var(--gap-s);
    justify-content: space-between;

    padding: var(--ni-16) var(--ni-20);

    height: 100%;
    box-sizing: border-box;

    :global(.trakt-spoiler) {
      cursor: pointer;
    }
  }
</style>
