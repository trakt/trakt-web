<script lang="ts">
  import CheckboxIcon from "$lib/components/icons/CheckboxIcon.svelte";
  import { useListSelection } from "$lib/features/list-selection/useListSelection.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { ListItem } from "$lib/requests/models/ListItem.ts";
  import { triggerWithKeyboard } from "$lib/utils/actions/triggerWithKeyboard.ts";
  import { onMount, type Snippet } from "svelte";

  const LONG_PRESS_MS = 500;

  const {
    item,
    title,
    children,
  }: {
    item: ListItem;
    title: string;
    children: Snippet;
  } = $props();

  const itemKey = $derived(item.key);
  const selection = useListSelection();
  const isEditing = $derived(selection.isEditing);
  const isSelected = $derived(selection.isSelected(itemKey));

  onMount(() => {
    selection.register(item);
    return () => selection.unregister(itemKey);
  });

  // Capture phase, not bubble: the card's own link (and any nested gesture
  // handlers) must never see this click while editing. A bubble-phase
  // `onclick` here would also race Svelte's own delegated click dispatch -
  // anything upstream calling stopPropagation() first (e.g. disableNavigation)
  // sets `event.cancelBubble`, which Svelte checks before invoking a
  // bubble-phase handler at all, silently dropping it.
  function handleClick(event: MouseEvent) {
    if (!isEditing) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    selection.click(itemKey, {
      shiftKey: event.shiftKey,
      ctrlKey: event.ctrlKey,
      metaKey: event.metaKey,
    });
  }

  let longPressTimer: ReturnType<typeof setTimeout> | null = null;

  function clearLongPress() {
    if (longPressTimer != null) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    }
  }

  function handlePointerDown(event: PointerEvent) {
    if (isEditing || event.pointerType === "mouse") {
      return;
    }

    clearLongPress();
    longPressTimer = setTimeout(() => {
      longPressTimer = null;
      selection.enterEdit(itemKey);
    }, LONG_PRESS_MS);
  }
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
  class="trakt-selectable-list-item"
  class:is-editing={isEditing}
  role={isEditing ? "button" : undefined}
  tabindex={isEditing ? 0 : undefined}
  aria-pressed={isEditing ? isSelected : undefined}
  aria-label={isEditing
    ? (isSelected
      ? m.button_label_deselect_list_item({ title })
      : m.button_label_select_list_item({ title }))
    : undefined}
  use:triggerWithKeyboard
  onclickcapture={handleClick}
  onpointerdown={handlePointerDown}
  onpointerup={clearLongPress}
  onpointermove={clearLongPress}
  onpointercancel={clearLongPress}
>
  {#if isEditing}
    <span class="selection-checkbox" aria-hidden="true">
      <CheckboxIcon state={isSelected ? "checked" : "unchecked"} />
    </span>
  {/if}

  {@render children()}
</div>

<style lang="scss">
  .trakt-selectable-list-item {
    position: relative;

    &.is-editing {
      cursor: pointer;

      :global(.trakt-card) {
        pointer-events: none;
      }
    }

    &[aria-pressed="true"] .selection-checkbox {
      color: var(--color-accent-purple);
    }
  }

  .selection-checkbox {
    position: absolute;
    inset-block-start: var(--ni-8);
    inset-inline-start: var(--ni-8);
    z-index: var(--layer-floating);

    display: flex;

    color: var(--color-text-secondary);
    filter: drop-shadow(0 0 var(--ni-4) var(--color-shadow));
  }
</style>
