<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import CloseIcon from "$lib/components/icons/CloseIcon.svelte";
  import MentionIcon from "$lib/components/icons/MentionIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { RichTextMention } from "../RichTextMention.ts";
  import { insertMention } from "./insertMention.ts";
  import MentionList from "./MentionList.svelte";
  import type { RichTextToolbarProps } from "./RichTextToolbarProps.ts";
  import { toMentionMatches } from "./toMentionMatches.ts";
  import { toolbarActions } from "./toolbarActions.ts";

  const maxMentionMatches = 20;

  const { editor, toolbarState, disabled, mentions }: RichTextToolbarProps =
    $props();

  let isPickerOpen = $state(false);
  let query = $state("");

  const actions = toolbarActions();
  const isInert = $derived(disabled || editor == null);
  const matches = $derived(
    toMentionMatches({ mentions, query, limit: maxMentionMatches }),
  );

  const keepEditorFocus = (e: MouseEvent) => {
    if (e.target instanceof HTMLInputElement) return;

    e.preventDefault();
  };

  const closePicker = () => {
    isPickerOpen = false;
    editor?.commands.focus();
  };

  const toggleMention = () => {
    if (!editor) return;

    if (toolbarState.link) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    query = "";
    isPickerOpen = true;
  };

  const pick = (mention: RichTextMention) => {
    if (!editor) return;

    isPickerOpen = false;
    insertMention({ editor, mention });
  };

  const onSearchKeydown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      closePicker();
      return;
    }

    if (e.key !== "Enter") return;

    e.preventDefault();
    const first = matches.at(0);
    if (first) pick(first);
  };

  const focusOnMount = (element: HTMLElement) => element.focus();
</script>

<div
  class="trakt-rich-text-toolbar"
  role="toolbar"
  aria-label={m.toolbar_label_text_formatting()}
  tabindex="-1"
  onmousedown={keepEditorFocus}
>
  <div class="toolbar-row">
    {#if isPickerOpen}
      <input
        class="mention-search"
        type="text"
        autocomplete="off"
        autocapitalize="off"
        spellcheck="false"
        aria-label={m.input_label_mention_search()}
        placeholder={m.input_placeholder_mention_search()}
        bind:value={query}
        onkeydown={onSearchKeydown}
        {@attach focusOnMount}
      />
      <ActionButton
        type="button"
        label={m.button_label_cancel()}
        style="ghost"
        size="small"
        variant="primary"
        onclick={closePicker}
      >
        <CloseIcon />
      </ActionButton>
    {:else}
      {#each actions as action (action.key)}
        <ActionButton
          type="button"
          label={action.label}
          style="ghost"
          size="small"
          color={toolbarState[action.key] ? "purple" : "default"}
          variant={toolbarState[action.key] ? "secondary" : "primary"}
          disabled={isInert}
          aria-pressed={toolbarState[action.key] ? "true" : "false"}
          onclick={() => editor && action.run(editor)}
        >
          <action.icon />
        </ActionButton>
      {/each}

      {#if mentions.length > 0}
        <ActionButton
          type="button"
          label={toolbarState.link
            ? m.button_label_format_remove_mention()
            : m.button_label_format_mention()}
          style="ghost"
          size="small"
          color={toolbarState.link ? "purple" : "default"}
          variant={toolbarState.link ? "secondary" : "primary"}
          disabled={isInert}
          aria-pressed={toolbarState.link ? "true" : "false"}
          onclick={toggleMention}
        >
          <MentionIcon />
        </ActionButton>
      {/if}
    {/if}
  </div>

  {#if isPickerOpen}
    {#if matches.length > 0}
      <MentionList mentions={matches} onPick={pick} />
    {:else}
      <p class="mention-empty secondary tag">{m.text_no_matching_cast()}</p>
    {/if}
  {/if}
</div>

<style>
  .trakt-rich-text-toolbar {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xxs);

    .toolbar-row {
      display: flex;
      align-items: center;
      gap: var(--gap-xxs);
    }

    .mention-search {
      all: unset;
      flex: 1;
      min-width: 0;

      padding: var(--ni-4) var(--ni-8);
      box-sizing: border-box;

      border-radius: var(--border-radius-s);
      border: var(--border-thickness-xxs) var(--color-border) solid;

      color: var(--color-text-primary);
      background-color: var(--color-input-background);

      &:focus-visible {
        border-color: var(--color-input-focus);
      }
    }

    .mention-empty {
      margin: 0;
      padding: var(--ni-6) var(--ni-8);
    }
  }
</style>
