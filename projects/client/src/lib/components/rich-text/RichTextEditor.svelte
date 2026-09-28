<script lang="ts">
  import type { Editor } from "@tiptap/core";
  import { iffy } from "$lib/utils/function/iffy.ts";
  import { untrack } from "svelte";
  import { createRichTextEditor } from "./_internal/createRichTextEditor.ts";
  import { insertMention } from "./_internal/insertMention.ts";
  import MentionList from "./_internal/MentionList.svelte";
  import type { MentionSuggestionState } from "./_internal/MentionSuggestionState.ts";
  import RichTextToolbar from "./_internal/RichTextToolbar.svelte";
  import { toMentionMatches } from "./_internal/toMentionMatches.ts";
  import type { ToolbarState } from "./_internal/ToolbarState.ts";
  import { toToolbarState } from "./_internal/toToolbarState.ts";
  import { trimBlankLines } from "./_internal/trimBlankLines.ts";
  import type { RichTextEditorProps } from "./RichTextEditorProps.ts";
  import type { RichTextMention } from "./RichTextMention.ts";

  const {
    value,
    onChange,
    placeholder,
    label,
    disabled = false,
    autofocus = false,
    mentions = [],
  }: RichTextEditorProps = $props();

  const maxSuggestions = 8;

  const emptyToolbarState: ToolbarState = {
    bold: false,
    italic: false,
    spoiler: false,
    link: false,
    bulletList: false,
    blockquote: false,
  };

  let editor = $state.raw<Editor | null>(null);
  let toolbarState = $state(emptyToolbarState);
  const initialMarkdown = iffy(() => value);

  let lastMarkdown = initialMarkdown;
  let suggestion = $state<MentionSuggestionState | null>(null);
  let activeIndex = $state(0);

  const suggestions = $derived(
    suggestion
      ? toMentionMatches({
          mentions,
          query: suggestion.query,
          limit: maxSuggestions,
        })
      : [],
  );

  const pickSuggestion = (mention: RichTextMention) => {
    if (!editor || !suggestion) return;

    insertMention({ editor, mention, range: suggestion.range });
  };

  const onMentionChange = (next: MentionSuggestionState | null) => {
    if (next?.query !== suggestion?.query) activeIndex = 0;

    suggestion = next;
  };

  const onMentionKeyDown = (event: KeyboardEvent) => {
    if (suggestions.length === 0) return false;

    if (event.key === "Escape") {
      event.stopPropagation();
      return false;
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      const step = event.key === "ArrowDown" ? 1 : -1;
      activeIndex = (activeIndex + step + suggestions.length) % suggestions.length;
      return true;
    }

    if (event.key !== "Enter" && event.key !== "Tab") return false;

    const active = suggestions.at(activeIndex);
    if (!active) return false;

    pickSuggestion(active);
    return true;
  };

  const mountEditor = (element: HTMLElement) => {
    let isCancelled = false;

    untrack(() =>
      createRichTextEditor({
        element,
        markdown: initialMarkdown,
        placeholder,
        label,
        autofocus,
        onUpdate: (updated) => {
          lastMarkdown = trimBlankLines(updated.getMarkdown());
          onChange(lastMarkdown);
        },
        onTransaction: (updated) => {
          toolbarState = toToolbarState(updated);
        },
        onMentionChange,
        onMentionKeyDown,
      }),
    ).then((created) => {
      if (isCancelled) {
        created.destroy();
        return;
      }

      editor = created;
    });

    return () => {
      isCancelled = true;
      editor?.destroy();
      editor = null;
    };
  };

  $effect(() => {
    if (!editor || value === lastMarkdown) return;

    lastMarkdown = value;
    editor.commands.setContent(value, {
      contentType: "markdown",
      emitUpdate: false,
    });
  });

</script>

<div class="trakt-rich-text-editor" class:is-disabled={disabled}>
  <RichTextToolbar {editor} {toolbarState} {disabled} {mentions} />
  <div class="editor-surface" inert={disabled} {@attach mountEditor}></div>
  {#if suggestions.length > 0}
    <MentionList
      mentions={suggestions}
      onPick={pickSuggestion}
      {activeIndex}
    />
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-rich-text-editor {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);

    width: 100%;
    min-width: 0;

    &.is-disabled .editor-surface {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .editor-surface {
      font-size: var(--font-size-text);
      color: var(--color-text-primary);

      :global(.ProseMirror) {
        outline: none;
        min-height: 3lh;
        overflow-wrap: anywhere;

        > :global(*:first-child) {
          margin-block-start: 0;
        }

        > :global(*:last-child) {
          margin-block-end: 0;
        }
      }

      :global(p),
      :global(li) {
        font-size: inherit;
      }

      :global(p.is-editor-empty:first-child::before) {
        content: attr(data-placeholder);
        float: inline-start;
        height: 0;
        pointer-events: none;
        color: var(--color-text-secondary);
      }

      :global(a) {
        @include default-link-style;
      }

      :global(blockquote) {
        margin-inline: 0;
        padding-inline-start: var(--gap-xs);
        border-inline-start: var(--border-thickness-xs) solid var(--purple-50);
      }

      :global([data-spoiler]) {
        border-radius: var(--border-radius-xs);
        background-color: color-mix(in srgb, var(--red-500) 18%, transparent);
        transition: filter var(--transition-increment) ease-in-out;
      }
    }

    &:not(:focus-within) .editor-surface :global([data-spoiler]) {
      @include spoiler-blur();
    }
  }
</style>
