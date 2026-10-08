<script lang="ts">
  import PlusIcon from "$lib/components/icons/PlusIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useLargeScreenCards } from "$lib/features/large-screen-cards/useLargeScreenCards.ts";
  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary.ts";
  import AddFromListsHost from "./AddFromListsHost.svelte";

  const { list }: { list: MediaListSummary } = $props();

  const isLargeScreenCards = useLargeScreenCards();
</script>

<AddFromListsHost {list} isSharedOnly>
  {#snippet children(open)}
    <button
      type="button"
      class="trakt-add-from-lists-tile"
      data-variant={$isLargeScreenCards ? "cover" : "summary"}
      aria-label={m.button_label_add_from_lists({ name: list.name })}
      onclick={open}
    >
      <PlusIcon />
      <span class="small">{m.button_text_add_from_lists()}</span>
    </button>
  {/snippet}
</AddFromListsHost>

<style lang="scss">
  .trakt-add-from-lists-tile {
    all: unset;
    box-sizing: border-box;
    width: var(--width-override-card, var(--width-item));
    aspect-ratio: 2 / 3;
    padding: var(--gap-m);
    border-radius: var(--border-radius-m);
    border: var(--ni-2) dashed var(--color-option-list-border);

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--gap-s);
    text-align: center;

    color: var(--color-text-secondary);
    cursor: pointer;
    transition: var(--transition-increment) ease-in-out;
    transition-property: color, border-color;

    &[data-variant="summary"] {
      aspect-ratio: auto;
      height: var(--height-summary-card);
      flex-direction: row;
    }

    &:hover,
    &:focus-visible {
      color: var(--color-text-primary);
      border-color: var(--color-text-secondary);
    }

    &:focus-visible {
      outline: var(--ni-2) solid var(--purple-500);
      outline-offset: var(--ni-2);
    }
  }
</style>
