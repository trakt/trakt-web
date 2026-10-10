<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import CheckboxIcon from "$lib/components/icons/CheckboxIcon.svelte";
  import CloseIcon from "$lib/components/icons/CloseIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useListSelection } from "$lib/features/list-selection/useListSelection.ts";
  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary";
  import { trackWindowScroll } from "$lib/utils/actions/trackWindowScroll.ts";
  import { bulkEditActions } from "./bulkEditActions.ts";

  const { list }: { list: MediaListSummary } = $props();

  const selection = useListSelection();

  const isAllSelected = $derived(
    selection.totalCount > 0 && selection.selectedCount === selection.totalCount,
  );

  function toggleSelectAll() {
    if (isAllSelected) {
      selection.clearSelection();
      return;
    }

    selection.selectAll();
  }
</script>

<div
  class="trakt-bulk-edit-list-header"
  use:trackWindowScroll={"is-scrolled"}
>
  <p class="secondary selected-count">
    {m.text_list_items_selected({ count: selection.selectedCount })}
  </p>

  <div class="header-actions">
    <button
      type="button"
      class="select-all"
      onclick={toggleSelectAll}
      aria-pressed={isAllSelected}
      aria-label={isAllSelected
        ? m.button_label_deselect_all_list_items()
        : m.button_label_select_all_list_items()}
    >
      <CheckboxIcon state={isAllSelected ? "checked" : "unchecked"} />
      {isAllSelected
        ? m.button_text_deselect_all()
        : m.button_text_select_all()}
    </button>

    {#each bulkEditActions as action (action.key)}
      <action.component
        {list}
        items={selection.selectedItems}
        onDone={selection.exitEdit}
      />
    {/each}

    <Button
      size="small"
      color="default"
      label={m.button_label_exit_list_edit_mode()}
      onclick={selection.exitEdit}
    >
      {m.button_text_cancel()}
      {#snippet icon()}
        <CloseIcon />
      {/snippet}
    </Button>
  </div>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-bulk-edit-list-header {
    position: sticky;
    inset-block-start: 0;
    z-index: var(--layer-floating);

    display: flex;
    align-items: center;
    gap: var(--gap-s);

    padding: var(--ni-12) var(--layout-distance-side);

    // Transparent at rest - this sits flush above the grid with nothing to
    // show through yet. Once cards scroll underneath (`.is-scrolled`, set by
    // `trackWindowScroll`), it gets the same frosted backdrop as the app
    // navbar, so content never shows through a see-through sticky bar.
    transition: calc(2 * var(--transition-increment)) ease-in-out;
    transition-property: background-color, box-shadow;

    &:global(.is-scrolled) {
      background-color: var(--color-background-navbar);
      box-shadow: var(--shadow-navbar);
      backdrop-filter: blur(var(--ni-8));
    }
  }

  .select-all {
    all: unset;
    display: flex;
    align-items: center;
    gap: var(--gap-xxs);
    cursor: pointer;
    color: var(--color-text-secondary);

    &:focus-visible {
      outline: var(--border-thickness-xxs) solid var(--color-input-focus);
    }
  }

  .selected-count {
    flex-grow: 1;
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
  }
</style>
