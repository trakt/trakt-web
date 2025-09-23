<script lang="ts">
  import Spoiler from "$lib/features/spoilers/components/Spoiler.svelte";
  import { spoilMeAnyway } from "$lib/features/spoilers/components/spoilMeAnyway";
  import type { MediaComment } from "$lib/requests/models/MediaComment";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import { Marked } from "marked";
  import ShadowScroller from "./ShadowScroller.svelte";
  import {
    createParagraphSpoilerRenderer,
    spoilerExtension,
  } from "./spoilerExtension";

  type CommentBodyProps = {
    media: MediaEntry;
    comment: MediaComment;
  };

  const { comment, media }: CommentBodyProps = $props();

  const marked = $derived(
    new Marked({
      extensions: [spoilerExtension()],
      renderer: {
        paragraph: createParagraphSpoilerRenderer(comment.isSpoiler),
      },
    }),
  );
</script>

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

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

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
