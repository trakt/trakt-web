<script lang="ts">
  import Card from "$lib/components/card/Card.svelte";
  import type { MediaComment } from "$lib/requests/models/MediaComment";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import type { ActiveComment } from "./models/ActiveComment";
  import UserComment from "./UserComment.svelte";

  type CommentProps = {
    media: MediaEntry;
    comment: MediaComment;
    onDrilldown: (comment: ActiveComment) => void;
  };

  const { comment, media, onDrilldown }: CommentProps = $props();
</script>

<Card
  --width-card="min(var(--width-comment-card), 85vw)"
  --height-card="var(--height-comment-card)"
>
  <div class="trakt-comment-container">
    <UserComment {comment} {media} {onDrilldown} />
  </div>
</Card>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-comment-container {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);
    justify-content: space-between;

    padding: var(--ni-16) var(--ni-20);

    height: 100%;
    box-sizing: border-box;

    :global(.trakt-spoiler) {
      cursor: pointer;
    }
  }
</style>
