<script lang="ts">
  import { spoilMeAnyway } from "$lib/features/spoilers/components/spoilMeAnyway";
  import { createSafeMarked } from "$lib/utils/markdown/createSafeMarked.ts";
  import { createHeadingRenderer } from "./_internal/createHeadingRenderer.ts";
  import { spoilerExtension } from "./_internal/spoilerExtension.ts";

  const { text, isSpoiler = false }: { text: string; isSpoiler?: boolean } =
    $props();

  const marked = $derived(
    createSafeMarked({
      extensions: [spoilerExtension(isSpoiler)],
      renderer: {
        heading: createHeadingRenderer(),
      },
    }),
  );
</script>

<div class="trakt-markdown-text" use:spoilMeAnyway>
  <!--
    -gfm: to enable GitHub Flavored Markdown
    -breaks: to enable gfm line breaks
  -->
  {@html marked.parse(text, { gfm: true, breaks: true })}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-markdown-text {
    display: contents;
    font-size: var(--font-size-text);

    :global(a) {
      @include default-link-style;
    }

    :global(p),
    :global(li) {
      font-size: inherit;
    }

    :global(blockquote) {
      margin-inline: 0;
      padding-inline-start: var(--gap-xs);
      border-inline-start: var(--border-thickness-xs) solid var(--purple-50);
    }

    :global(.trakt-markdown-heading) {
      text-transform: none;
      text-decoration: underline;
    }

    :global(span) {
      transition: var(--transition-increment) ease-in-out;
      transition-property: filter;
    }

    :global(span.trakt-spoiler) {
      @include spoiler-blur();

      cursor: pointer;
    }

    :global(span.trakt-spoiler *) {
      pointer-events: none;
    }
  }
</style>
