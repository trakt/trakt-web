<script lang="ts">
  import { lineClamp } from "$lib/components/text/lineClamp";
  import Spoiler from "$lib/features/spoilers/components/Spoiler.svelte";
  import { spoilMeAnyway } from "$lib/features/spoilers/components/spoilMeAnyway";
  import type { MediaComment } from "$lib/requests/models/MediaComment";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import { NOOP_FN } from "$lib/utils/constants";
  import { Marked } from "marked";
  import { createHeadingRenderer } from "./marked/createHeadingRenderer";
  import { createParagraphRenderer } from "./marked/createParagraphRenderer";
  import { spoilerExtension } from "./marked/spoilerExtension";

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
        paragraph: createParagraphRenderer(comment.isSpoiler),
        heading: createHeadingRenderer(),
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

{#if type === "full"}
  <Spoiler {media} type={media.type}>
    <div
      class="trakt-comment"
      class:trakt-spoiler={comment.isSpoiler}
      use:spoilAction
    >
      {@render commentText()}
    </div>
  </Spoiler>
{:else}
  <button class="trakt-comment-preview" onclick={onClick}>
    <Spoiler {media} type={media.type} variant="persistent">
      <div
        class="trakt-comment trakt-comment-preview-content"
        use:lineClamp={{ lines: MAX_PREVIEW_LINES }}
        style="--max-lines: {MAX_PREVIEW_LINES}"
        class:trakt-spoiler={comment.isSpoiler}
        use:spoilAction
      >
        {@render commentText()}
      </div>
    </Spoiler>
  </button>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-comment {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);

    font-size: var(--font-size-text);

    :global(a) {
      @include default-link-style;
    }

    :global(p),
    :global(li) {
      font-size: inherit;
    }

    :global(.trakt-comment-heading) {
      text-transform: none;
      text-decoration: underline;
    }

    &,
    :global(p) {
      transition: var(--transition-increment) ease-in-out;
      transition-property: filter, padding;
    }

    &:global(.trakt-spoiler),
    :global(p.trakt-spoiler span) {
      @include spoiler-blur();
    }

    :global(p.trakt-spoiler span) {
      pointer-events: none;
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
