<script lang="ts">
  import Card from "$lib/components/card/Card.svelte";
  import type { ExtendedMediaType } from "$lib/requests/models/ExtendedMediaType";
  import type { MediaComment } from "$lib/requests/models/MediaComment";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import type { ActiveComment } from "./models/ActiveComment";
  import UserComment from "./UserComment.svelte";

  type CommentProps = {
    media: MediaEntry;
    comment: MediaComment;
    onDrilldown: (comment: ActiveComment) => void;
    type: ExtendedMediaType;
  };

  const { comment, media, onDrilldown, type }: CommentProps = $props();
</script>

<Card
  --width-card="var(--width-comment-card)"
  --height-card="var(--height-comment-card)"
>
  <div class="trakt-comment-container">
    <UserComment {comment} {media} {onDrilldown} {type} />
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
