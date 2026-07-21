<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";

  type RankEditorProps = {
    rank: number;
    total: number;
    title: string;
    onMove: (targetRank: number) => void;
  };

  const { rank, total, title, onMove }: RankEditorProps = $props();

  const isMobile = useMedia(WellKnownMediaQuery.mobile);
  const label = $derived(m.dialog_prompt_move_to_position({ title }));

  function resolveTargetRank(raw: string): number {
    const parsed = Number.parseInt(raw, 10);

    return Number.isFinite(parsed)
      ? Math.min(Math.max(parsed, 1), total)
      : rank;
  }

  // Desktop: inline editable field, commits on blur / Enter.
  function selectAll(input: HTMLInputElement) {
    // Deferred to the next frame so the pointer's own caret placement (on
    // mouseup) doesn't collapse the selection.
    requestAnimationFrame(() => input.select());
  }

  function commitInline(input: HTMLInputElement) {
    const targetRank = resolveTargetRank(input.value);

    if (targetRank === rank) {
      // No change: snap the field back to the current rank.
      input.value = `${rank}`;
      return;
    }

    onMove(targetRank);
  }

  function handleInlineKeydown(
    event: KeyboardEvent & { currentTarget: HTMLInputElement },
  ) {
    if (event.key === "Enter") {
      event.preventDefault();
      event.currentTarget.blur();
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      event.currentTarget.value = `${rank}`;
      event.currentTarget.blur();
    }
  }

  // Mobile: bottom-sheet with confirm / cancel.
  let open = $state(false);
  let draft = $state(`${rank}`);
  let sheetInput = $state<HTMLInputElement | null>(null);

  function openSheet() {
    draft = `${rank}`;
    open = true;
  }

  function focusSheetInput() {
    requestAnimationFrame(() => sheetInput?.select());
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

{#if $isMobile}
  <button
    type="button"
    class="rank-trigger-button"
    aria-label={label}
    onclick={openSheet}
  >
    <span class="rank-trigger bold">#{rank}</span>
  </button>

  {#if open}
    <Drawer
      onClose={() => (open = false)}
      onOpened={focusSheetInput}
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
          class="rank-edit-input"
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
{:else}
  <div class="rank-field">
    <span class="rank-hash" aria-hidden="true">#</span>
    <input
      class="rank-inline-input"
      type="text"
      inputmode="numeric"
      autocomplete="off"
      value={rank}
      aria-label={label}
      onfocus={(event) => selectAll(event.currentTarget)}
      onkeydown={handleInlineKeydown}
      onblur={(event) => commitInline(event.currentTarget)}
    />
  </div>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  /* Mobile trigger */
  .rank-trigger-button {
    all: unset;
    display: inline-flex;
    cursor: pointer;
  }

  .rank-trigger {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: var(--ni-40);
    padding-block: var(--ni-4);
    padding-inline: var(--ni-8);
    border-radius: var(--border-radius-s);
    color: var(--color-text-primary);
    font-variant-numeric: tabular-nums;
    cursor: pointer;
  }

  .rank-trigger-button:focus-visible .rank-trigger {
    outline: var(--border-thickness-xxs) solid var(--color-input-focus);
    outline-offset: var(--ni-1);
  }

  /* Desktop inline field */
  .rank-field {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--ni-2);
  }

  .rank-hash {
    font-weight: 600;
    color: var(--color-text-secondary);
  }

  .rank-inline-input {
    all: unset;
    box-sizing: border-box;
    width: var(--ni-40);
    padding-block: var(--ni-4);
    padding-inline: var(--ni-2);
    text-align: center;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    color: var(--color-text-primary);
    background: var(--color-input-background);
    border-radius: var(--border-radius-s);
    outline: var(--border-thickness-xxs) solid var(--color-border);
    outline-offset: calc(-1 * var(--border-thickness-xxs));
    cursor: text;
    user-select: text;
    -webkit-user-select: text;
    transition: outline-color var(--transition-increment) ease-in-out;

    @include for-mouse {
      &:hover {
        outline-color: var(--color-input-focus);
      }
    }

    &:focus-visible {
      outline-color: var(--color-input-focus);
    }
  }

  /* Mobile sheet content */
  .rank-edit-sheet {
    display: flex;
    flex-direction: column;
    gap: var(--ni-12);
  }

  .rank-edit-input {
    all: unset;
    height: var(--ni-40);
    width: 100%;
    box-sizing: border-box;
    padding-block: var(--ni-8);
    padding-inline: var(--ni-16);
    text-align: center;
    font-variant-numeric: tabular-nums;
    border-radius: var(--border-radius-m);
    background: var(--color-input-background);
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
