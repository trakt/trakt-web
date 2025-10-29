<script lang="ts">
  import { lineClamp } from "$lib/components/text/lineClamp";
  import Spoiler from "$lib/features/spoilers/components/Spoiler.svelte";
  import { spoilMeAnyway } from "$lib/features/spoilers/components/spoilMeAnyway";
  import type { MediaComment } from "$lib/requests/models/MediaComment";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import { NOOP_FN } from "$lib/utils/constants";
  import { Marked } from "marked";
  import {
    createParagraphSpoilerRenderer,
    spoilerExtension,
  } from "./spoilerExtension";

  const MAX_PREVIEW_LINES = 3;

  type CommentBodyProps = {
    media: MediaEntry;
    comment: MediaComment;
    type: "full" | "preview";
    onClick?: () => void;
  };

  const { comment, media, type, onClick }: CommentBodyProps = $props();

  const marked = $derived(
    new Marked({
      extensions: [spoilerExtension()],
      renderer: {
        paragraph: createParagraphSpoilerRenderer(comment.isSpoiler),
      },
    }),
  );

  const spoilAction = $derived(type === "preview" ? NOOP_FN : spoilMeAnyway);
</script>

{#snippet commentText()}
  <!--
        -gfm: to enable GitHub Flavored Markdown
        -breaks: to enable gfm line breaks
      -->
  {@html marked.parse(comment.comment, { gfm: true, breaks: true })}
{/snippet}

<Spoiler {media} type={media.type}>
  <div
    class="trakt-comment"
    class:trakt-spoiler={comment.isSpoiler}
    use:spoilAction
  >
    {#if type === "full"}
      {@render commentText()}
    {:else}
      <button class="trakt-comment-preview" onclick={onClick}>
        <div
          class="trakt-comment-preview-content"
          use:lineClamp={{ lines: MAX_PREVIEW_LINES }}
          style="--max-lines: {MAX_PREVIEW_LINES}"
        >
          {@render commentText()}
        </div>
      </button>
    {/if}
  </div>
</Spoiler>

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

  .trakt-comment-preview {
    --preview-height: var(--ni-52);

    all: unset;
    -webkit-tap-highlight-color: transparent;
    cursor: pointer;
    display: flex;
    height: var(--preview-height);

    .trakt-comment-preview-content {
      :global(p) {
        line-height: calc(var(--preview-height) / var(--max-lines));
      }
    }
  }
</style>
