<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import PopupMenu from "$lib/components/buttons/popup/PopupMenu.svelte";
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import ArrowDownToLineIcon from "$lib/components/icons/ArrowDownToLineIcon.svelte";
  import ArrowUpToLineIcon from "$lib/components/icons/ArrowUpToLineIcon.svelte";
  import ReorderIcon from "$lib/components/icons/ReorderIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { clamp } from "$lib/utils/number/clamp.ts";

  type RankEditorProps = {
    rank: number;
    total: number;
    title: string;
    onMove: (targetRank: number) => void;
  };

  const { rank, total, title, onMove }: RankEditorProps = $props();

  const label = $derived(m.button_label_reorder_item({ title }));
  const menuTitle = $derived(`#${rank} • ${title}`);

  let open = $state(false);
  let sheetInput = $state<HTMLInputElement | null>(null);
  let draft = $state("");

  function resolveTargetRank(raw: string): number {
    const parsed = Number.parseInt(raw, 10);

    return Number.isFinite(parsed)
      ? clamp({ value: parsed, min: 1, max: total })
      : rank;
  }

  function openSheet() {
    draft = `${rank}`;
    open = true;
  }

  function selectAll(input: HTMLInputElement | null) {
    requestAnimationFrame(() => input?.select());
  }

  function submitSheet() {
    const targetRank = resolveTargetRank(draft);

    if (targetRank !== rank) {
      onMove(targetRank);
    }

    open = false;
  }

  function handleSheetKeydown(event: KeyboardEvent) {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();
    submitSheet();
  }
</script>

<div class="trakt-rank-editor">
  <PopupMenu mode="standalone" {label} title={menuTitle}>
    {#snippet icon()}
      <span class="bold">#{rank}</span>
    {/snippet}

    {#snippet items()}
      <DropdownItem
        style="flat"
        color="default"
        variant="secondary"
        disabled={rank === 1}
        onclick={() => onMove(1)}
      >
        {m.button_text_move_to_top()}

        {#snippet icon()}
          <ArrowUpToLineIcon />
        {/snippet}
      </DropdownItem>

      <DropdownItem
        style="flat"
        color="default"
        variant="secondary"
        onclick={openSheet}
      >
        {m.button_text_move_to_position()}

        {#snippet icon()}
          <ReorderIcon />
        {/snippet}
      </DropdownItem>

      <DropdownItem
        style="flat"
        color="default"
        variant="secondary"
        disabled={rank === total}
        onclick={() => onMove(total)}
      >
        {m.button_text_move_to_bottom()}

        {#snippet icon()}
          <ArrowDownToLineIcon />
        {/snippet}
      </DropdownItem>
    {/snippet}
  </PopupMenu>
</div>

{#if open}
  <Drawer
    onClose={() => (open = false)}
    onOpened={() => selectAll(sheetInput)}
    title={m.button_text_move_to_position()}
    size="auto"
    elevated
  >
    <div class="rank-edit-sheet">
      <p class="secondary small">
        {m.dialog_prompt_move_to_position({ title })}
      </p>
      <input
        bind:this={sheetInput}
        bind:value={draft}
        class="rank-input"
        type="text"
        inputmode="numeric"
        autocomplete="off"
        aria-label={m.input_placeholder_reorder_position({ count: total })}
        placeholder={m.input_placeholder_reorder_position({ count: total })}
        onkeydown={handleSheetKeydown}
      />
      <div class="rank-edit-actions">
        <Button
          size="small"
          color="default"
          label={m.button_label_cancel()}
          onclick={() => (open = false)}
        >
          {m.button_text_cancel()}
        </Button>
        <Button
          size="small"
          variant="primary"
          color="purple"
          label={m.button_text_apply()}
          onclick={submitSheet}
        >
          {m.button_text_apply()}
        </Button>
      </div>
    </div>
  </Drawer>
{/if}

<style lang="scss">
  .trakt-rank-editor {
    display: inline-flex;

    :global(.trakt-popup-menu-button) {
      width: auto;
      min-width: var(--ni-40);
      height: var(--ni-28);
      padding-inline: var(--ni-8);

      color: var(--color-text-primary);
      font-variant-numeric: tabular-nums;
      outline: var(--border-thickness-xxs) solid var(--color-border);
      outline-offset: calc(-1 * var(--border-thickness-xxs));
    }
  }

  .rank-edit-sheet {
    display: flex;
    flex-direction: column;
    gap: var(--ni-12);
  }

  .rank-input {
    all: unset;
    box-sizing: border-box;
    width: 100%;
    height: var(--ni-40);
    padding-block: var(--ni-8);
    padding-inline: var(--ni-16);
    text-align: start;
    font-variant-numeric: tabular-nums;
    background: var(--color-input-background);
    border-radius: var(--border-radius-m);
    outline: var(--border-thickness-xxs) solid var(--color-border);
    outline-offset: calc(-1 * var(--border-thickness-xxs));
    transition: outline-color var(--transition-increment) ease-in-out;

    &:focus-visible {
      outline-color: var(--color-input-focus);
    }
  }

  .rank-edit-actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--ni-8);
  }
</style>
