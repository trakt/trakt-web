<script lang="ts">
  import { lineClamp } from "$lib/components/text/lineClamp";
  import Spoiler from "$lib/features/spoilers/components/Spoiler.svelte";
  import { spoilMeAnyway } from "$lib/features/spoilers/components/spoilMeAnyway";
  import type { MediaComment } from "$lib/requests/models/MediaComment";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import { Marked } from "marked";
  import CommentGif from "./CommentGif.svelte";
  import { createHeadingRenderer } from "./marked/createHeadingRenderer";
  import { createParagraphRenderer } from "./marked/createParagraphRenderer";
  import { spoilerExtension } from "./marked/spoilerExtension";

  const maxPreviewLines = 3;

  type CommentBodyProps = {
    media: MediaEntry;
    comment: MediaComment;
    type: "full" | "preview";
    onClick?: () => void;
  };

  const { comment, media, type, onClick }: CommentBodyProps = $props();

  // A gif is a comment on its own, so the body can be empty.
  const hasText = $derived(comment.comment.trim().length > 0);

  const marked = $derived(
    new Marked({
      extensions: [spoilerExtension()],
      renderer: {
        paragraph: createParagraphRenderer(comment.isSpoiler),
        heading: createHeadingRenderer(),
      },
    }),
  );
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
      use:spoilMeAnyway
    >
      {@render commentText()}
      {#if comment.gif}
        <CommentGif url={comment.gif} variant="full" />
      {/if}
    </div>
  </Spoiler>
{:else}
  <button class="trakt-comment-preview" onclick={onClick}>
    <Spoiler {media} type={media.type} variant="persistent">
      <!--
        The gif is part of what a spoiler hides, so the blur sits on the row
        that holds both it and the text rather than on the text alone.
      -->
      <div
        class="trakt-comment-preview-row"
        class:trakt-spoiler={comment.isSpoiler}
      >
        {#if hasText}
          <div
            class="trakt-comment trakt-comment-preview-content"
            use:lineClamp={{ lines: maxPreviewLines }}
            style="--max-lines: {maxPreviewLines}"
          >
            {@render commentText()}
          </div>
        {/if}
        {#if comment.gif}
          <CommentGif url={comment.gif} variant="preview" />
        {/if}
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

    &:global(.trakt-spoiler),
    :global(p.trakt-spoiler) {
      cursor: pointer;
    }
  }

  .trakt-comment-preview {
    --preview-height: var(--ni-52);

    all: unset;
    -webkit-tap-highlight-color: transparent;
    cursor: pointer;
    // Grid rather than flex so the spoiler wrapper in between fills the card
    // on both axes, which is what the row below measures itself against.
    display: grid;
    height: var(--preview-height);

    .trakt-comment-preview-row {
      display: flex;
      align-items: flex-start;
      gap: var(--gap-xs);

      width: 100%;
      height: var(--preview-height);
      box-sizing: border-box;

      &:global(.trakt-spoiler) {
        @include spoiler-blur();
      }
    }

    .trakt-comment-preview-content {
      flex-grow: 1;
      min-width: 0;

      :global(p) {
        line-height: calc(var(--preview-height) / var(--max-lines));
      }
    }
  }
</style>
