<script lang="ts">
  import Card from "$lib/components/card/Card.svelte";
  import Spoiler from "$lib/features/spoilers/components/Spoiler.svelte";
  import type { MediaComment } from "$lib/requests/models/MediaComment";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import { Marked } from "marked";
  import CommentHeader from "./CommentHeader.svelte";
  import ShadowScroller from "./ShadowScroller.svelte";
  import { spoilerExtension } from "./spoilerExtension";
  import { spoilMeAnyway } from "./spoilMeAnyway";

  type CommentProps = {
    comment: MediaComment;
    media: MediaEntry;
  };

  const { comment, media }: CommentProps = $props();

  const marked = $derived(
    new Marked({ extensions: [spoilerExtension(comment.isSpoiler)] }),
  );
</script>

<Card
  --width-card="min(var(--width-comment-card), 85vw)"
  --height-card="var(--height-comment-card)"
>
  <div class="trakt-comment-container">
    <CommentHeader {comment} />
    <ShadowScroller>
      <Spoiler {media} type={media.type}>
        <div
          class="trakt-comment"
          class:trakt-spoiler={comment.isSpoiler}
          use:spoilMeAnyway
        >
          <!--
            -gfm: to enable GitHub Flavored Markdown
            -breaks: to enable gfm line breaks
          -->
          {@html marked.parse(comment.comment, { gfm: true, breaks: true })}
        </div>
      </Spoiler>
    </ShadowScroller>
  </div>
</Card>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-comment-container {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);

    padding: var(--ni-16) var(--ni-20);

    height: 100%;
    box-sizing: border-box;

    :global(.trakt-spoiler) {
      cursor: pointer;
    }
  }

  .trakt-comment {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);

    color: var(--color-text-secondary);
    font-size: var(--ni-14);

    :global(a) {
      @include default-link-style;
    }

    :global(p),
    :global(li) {
      font-size: inherit;
    }
  }
</style>
