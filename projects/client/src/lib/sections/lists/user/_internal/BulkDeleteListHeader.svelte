<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import { useDangerButton } from "$lib/components/buttons/_internal/useDangerButton";
  import CheckboxIcon from "$lib/components/icons/CheckboxIcon.svelte";
  import CloseIcon from "$lib/components/icons/CloseIcon.svelte";
  import DeleteIcon from "$lib/components/icons/DeleteIcon.svelte";
  import { ConfirmationType } from "$lib/features/confirmation/models/ConfirmationType";
  import { useConfirm } from "$lib/features/confirmation/useConfirm";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useListSelection } from "$lib/features/list-selection/useListSelection.ts";
  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary";
  import { trackWindowScroll } from "$lib/utils/actions/trackWindowScroll.ts";
  import { useBulkDeleteFromList } from "./useBulkDeleteFromList.ts";

  const { list }: { list: MediaListSummary } = $props();

  const selection = useListSelection();
  const { isDeleting, deleteItems } = $derived(useBulkDeleteFromList(list));

  const { confirm } = useConfirm();

  async function handleDeleted() {
    await deleteItems(selection.selectedItems);
    selection.exitEdit();
  }

  const confirmDelete = $derived(
    confirm({
      type: ConfirmationType.BulkRemoveFromList,
      count: selection.selectedCount,
      name: list.name,
      onConfirm: handleDeleted,
    }),
  );

  const { color, variant: _variant, ...dangerEvents } = $derived(
    useDangerButton({ isActive: true, color: "default" }),
  );

  const hasSelection = $derived(selection.selectedCount > 0);
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
  class="trakt-bulk-delete-list-header"
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
        ? m.button_label_unselect_all_list_items()
        : m.button_label_select_all_list_items()}
    >
      <CheckboxIcon state={isAllSelected ? "checked" : "unchecked"} />
      {isAllSelected
        ? m.button_text_unselect_all()
        : m.button_text_select_all()}
    </button>

    <Button
      size="small"
      color={$color}
      disabled={!hasSelection || $isDeleting}
      label={m.button_label_delete_selected_list_items({
        count: selection.selectedCount,
        name: list.name,
      })}
      onclick={confirmDelete}
      {...dangerEvents}
    >
      {m.button_text_delete_selected()}
      {#snippet icon()}
        <DeleteIcon />
      {/snippet}
    </Button>

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

  .trakt-bulk-delete-list-header {
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
