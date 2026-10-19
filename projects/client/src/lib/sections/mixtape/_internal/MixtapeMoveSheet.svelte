<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { iffy } from "$lib/utils/function/iffy";
  import type { MixtapeMoveSheetProps } from "./MixtapeMoveSheetProps.ts";

  const NEW_LIST = "new";

  const {
    current,
    currentName,
    lists,
    suggestedName,
    isMoving,
    onClose,
    onConfirm,
  }: MixtapeMoveSheetProps = $props();

  const watchlistName = m.page_title_watchlist();
  const options = $derived([
    { key: "watchlist", target: null, name: watchlistName },
    ...lists.map(({ id, name }) => ({ key: String(id), target: id, name })),
  ]);

  let selected = $state(
    iffy(() => (current == null ? "watchlist" : String(current))),
  );
  let newName = $state(iffy(() => suggestedName));

  const chosen = $derived(options.find(({ key }) => key === selected));
  const isNewList = $derived(selected === NEW_LIST);
  const isUnchanged = $derived(chosen?.target === current && !isNewList);
  const targetName = $derived(
    isNewList ? newName.trim() : (chosen?.name ?? currentName),
  );

  const confirm = () => {
    if (isUnchanged) return onClose();
    if (isNewList) {
      if (targetName) onConfirm({ newName: targetName });
      return;
    }
    if (chosen) onConfirm({ target: chosen.target, name: chosen.name });
  };
</script>

<Drawer {onClose} title={m.header_mixtape_move()} size="auto">
  <fieldset class="trakt-mixtape-move">
    <legend class="visually-hidden">{m.header_mixtape_move()}</legend>
    {#each options as option (option.key)}
      <label class="move-option" class:is-selected={selected === option.key}>
        <input
          type="radio"
          name="mixtape-target"
          value={option.key}
          bind:group={selected}
        />
        <span class="move-text">
          <span class="bold">{option.name}</span>
          {#if option.target === current}
            <span class="small secondary">{m.text_mixtape_move_current()}</span>
          {/if}
        </span>
      </label>
    {/each}
    <label class="move-option" class:is-selected={isNewList}>
      <input
        type="radio"
        name="mixtape-target"
        value={NEW_LIST}
        bind:group={selected}
      />
      <span class="move-text">
        <span class="bold">{m.button_text_mixtape_new_list()}</span>
        {#if isNewList}
          <input
            class="move-name"
            type="text"
            aria-label={m.input_label_mixtape_list_name()}
            bind:value={newName}
          />
        {/if}
      </span>
    </label>
  </fieldset>

  {#snippet footer()}
    <Button
      color="purple"
      disabled={isMoving || (isNewList && !targetName)}
      label={isUnchanged
        ? m.button_text_mixtape_stay({ name: currentName })
        : m.button_text_mixtape_move({ name: targetName })}
      onclick={confirm}
    >
      {isUnchanged
        ? m.button_text_mixtape_stay({ name: currentName })
        : m.button_text_mixtape_move({ name: targetName })}
    </Button>
  {/snippet}
</Drawer>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-mixtape-move {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
    margin: 0;
    padding: 0;
    border: 0;

    .visually-hidden {
      @include visually-hidden;
    }
  }

  .move-option {
    display: flex;
    align-items: flex-start;
    gap: var(--gap-s);
    padding: var(--gap-s);

    border-radius: var(--border-radius-m);
    box-shadow: inset 0 0 0 var(--border-thickness-xxs) var(--color-border);
    cursor: pointer;

    &.is-selected {
      box-shadow: inset 0 0 0 var(--border-thickness-xs) var(--purple-400);
    }

    input[type="radio"] {
      margin: var(--ni-2) 0 0;
      accent-color: var(--purple-400);
    }
  }

  .move-text {
    display: flex;
    flex-direction: column;
    gap: var(--ni-4);
    flex: 1;
    min-width: 0;
  }

  .move-name {
    box-sizing: border-box;
    width: 100%;
    padding: var(--ni-8) var(--ni-10);

    border: 0;
    border-radius: var(--border-radius-field);
    background: var(--color-background);
    color: var(--color-text-primary);
    font: inherit;
  }
</style>
