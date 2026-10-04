<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import CloseIcon from "$lib/components/icons/CloseIcon.svelte";
  import MentionIcon from "$lib/components/icons/MentionIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useMotionDuration } from "$lib/stores/css/useMotionDuration.ts";
  import { cubicOut } from "svelte/easing";
  import { fly, slide } from "svelte/transition";
  import type { RichTextMention } from "../RichTextMention.ts";
  import { insertMention } from "./insertMention.ts";
  import { stepActiveIndex } from "./stepActiveIndex.ts";
  import MentionList from "./MentionList.svelte";
  import type { RichTextToolbarProps } from "./RichTextToolbarProps.ts";
  import { toMentionMatches } from "./toMentionMatches.ts";
  import { toolbarActions } from "./toolbarActions.ts";

  const maxMentionMatches = 20;
  const mentionListId = `trakt-mention-list-${crypto.randomUUID().slice(0, 8)}`;

  const {
    editor,
    toolbarState,
    disabled,
    mentions,
    actions,
  }: RichTextToolbarProps = $props();

  let isPickerOpen = $state(false);
  let query = $state("");
  let activeIndex = $state(0);

  const formatActions = toolbarActions();
  const duration = useMotionDuration();
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
    activeIndex = 0;
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

    const next = stepActiveIndex({
      key: e.key,
      activeIndex,
      count: matches.length,
    });
    if (next != null) {
      e.preventDefault();
      activeIndex = next;
      return;
    }

    if (e.key !== "Enter") return;

    e.preventDefault();
    const active = matches.at(activeIndex);
    if (active) pick(active);
  };

  const focusOnMount = (element: HTMLElement) => element.focus();
</script>

<div
  class="trakt-rich-text-toolbar"
  role="toolbar"
  tabindex="-1"
  onmousedown={keepEditorFocus}
>
  <div class="toolbar-stage">
    {#if isPickerOpen}
      <div
        class="mention-panel"
        transition:slide={{ duration: $duration(280), easing: cubicOut }}
      >
        <MentionList
          mentions={matches}
          onPick={pick}
          {activeIndex}
          id={mentionListId}
          emptyText={m.text_no_matching_cast()}
        >
          {#snippet header()}
            <span class="mention-search-icon" aria-hidden="true">
              <MentionIcon />
            </span>
            <input
              class="mention-search"
              type="text"
              role="combobox"
              aria-autocomplete="list"
              aria-expanded={matches.length > 0}
              aria-controls={mentionListId}
              aria-activedescendant={matches.length > 0
                ? `${mentionListId}-option-${activeIndex}`
                : undefined}
              autocomplete="off"
              autocapitalize="off"
              spellcheck="false"
              aria-label={m.input_label_mention_search()}
              placeholder={m.input_placeholder_mention_search()}
              bind:value={() => query, (next) => {
                query = next;
                activeIndex = 0;
              }}
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
          {/snippet}
        </MentionList>
      </div>
    {:else}
      <div
        class="toolbar-row"
        transition:fly={{ y: 6, duration: $duration(180), easing: cubicOut }}
      >
        <div
          class="format-actions"
          role="group"
          aria-label={m.toolbar_label_text_formatting()}
        >
          {#each formatActions as action (action.key)}
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
        </div>

        {#if actions}
          <span class="toolbar-divider" aria-hidden="true"></span>
          {@render actions()}
        {/if}
      </div>
    {/if}
  </div>
</div>

<style>
  .trakt-rich-text-toolbar {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xxs);

    .toolbar-stage {
      display: grid;

      > * {
        grid-area: 1 / 1;
        align-self: start;
        min-width: 0;
      }
    }

    .mention-panel {
      position: relative;
      z-index: 1;
    }

    .toolbar-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--ni-10);
    }

    .format-actions {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--ni-10);
    }

    .toolbar-divider {
      width: var(--border-thickness-xxs);
      height: var(--ni-20);
      background-color: var(--color-border);
    }

    .mention-search-icon {
      display: flex;
      color: var(--color-text-secondary);

      :global(svg) {
        width: var(--ni-18);
        height: var(--ni-18);
      }
    }

    .mention-search {
      all: unset;
      flex: 1;
      min-width: 0;

      padding-block: var(--ni-8);

      color: var(--color-text-primary);

      &::placeholder {
        color: var(--color-text-secondary);
      }
    }
  }
</style>
