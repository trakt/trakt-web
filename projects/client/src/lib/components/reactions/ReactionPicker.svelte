<script lang="ts" generics="T extends string">
  import { tick } from "svelte";
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import CloseIcon from "$lib/components/icons/CloseIcon.svelte";
  import PlusIcon from "$lib/components/icons/PlusIcon.svelte";
  import SearchIcon from "$lib/components/icons/SearchIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import ReactionEmoji from "./ReactionEmoji.svelte";
  import type { ReactionPickerOption } from "./ReactionPickerOption.ts";
  import type { ReactionPickerProps } from "./ReactionPickerProps.ts";
  import { matchesReactionSearch } from "./matchesReactionSearch.ts";

  const {
    options,
    chosen,
    onSelect,
    onClose,
    quickCount,
    limit,
    isSearching = false,
    onToggleSearch,
  }: ReactionPickerProps<T> = $props();

  const isAtLimit = $derived(limit != null && chosen.length >= limit);

  const isSplit = $derived(quickCount != null && options.length > quickCount);

  const quick = $derived(isSplit ? options.slice(0, quickCount) : options);

  let query = $state("");
  let queryInput = $state<HTMLInputElement>();

  async function toggleSearch() {
    const willSearch = !isSearching;
    onToggleSearch?.();

    if (!willSearch) return;

    await tick();
    queryInput?.focus({ preventScroll: true });
  }

  const results = $derived(
    options.filter((option) => matchesReactionSearch(option, query)),
  );
</script>

{#snippet modeToggle()}
  <div class="picker-toggle">
    <ActionButton
      label={isSearching
        ? m.button_label_quick_reactions()
        : m.button_label_more_reactions()}
      onclick={toggleSearch}
      style="ghost"
    >
      <span class="toggle-icon" class:is-open={isSearching}>
        <PlusIcon />
      </span>
    </ActionButton>
  </div>
{/snippet}

{#snippet reactionButton(option: ReactionPickerOption<T>, index: number)}
  {@const isChosen = chosen.includes(option.id)}
  <div
    class="picker-cell"
    class:is-chosen={isChosen}
    style="--reaction-index: {index}"
  >
    <ActionButton
      label={m.button_label_react({ reaction: option.label })}
      onclick={() => onSelect(option.id)}
      disabled={isAtLimit && !isChosen}
      style="ghost"
    >
      <ReactionEmoji
        code={option.code}
        label={option.label}
        {index}
        animation="initial"
      />
    </ActionButton>
  </div>
{/snippet}

<div
  class="trakt-reaction-picker"
  class:is-split={isSplit}
  class:is-searching={isSearching}
  style:--picker-columns={isSplit ? quick.length + 1 : null}
>
  {#if isSplit}
    <div class="picker-search" inert={!isSearching}>
      <div class="picker-search-body">
        <label class="picker-field">
          <SearchIcon />
          <input
            type="text"
            bind:this={queryInput}
            bind:value={query}
            placeholder={m.input_placeholder_search_reactions()}
            aria-label={m.input_placeholder_search_reactions()}
          />
        </label>

        {#if results.length > 0}
          <div class="picker-row is-wrapping">
            {#each results as option, index (option.id)}
              {@render reactionButton(option, index)}
            {/each}
          </div>
        {:else}
          <p class="picker-empty secondary">{m.reactions_search_empty()}</p>
        {/if}
      </div>
    </div>
  {/if}

  <div class="picker-quick">
    {#if onClose}
      <ActionButton
        label={m.button_label_close_reaction()}
        onclick={onClose}
        style="ghost"
      >
        <CloseIcon />
      </ActionButton>
    {/if}

    <div class="picker-row">
      {#each quick as option, index (option.id)}
        {@render reactionButton(option, index)}
      {/each}
    </div>

    {#if isSplit}
      <span class="picker-divider" aria-hidden="true"></span>
      {@render modeToggle()}
    {/if}
  </div>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-reaction-picker {
    /* The quick row and the search grid share one set of columns - the quick
       reactions plus the toggle - spread to the panel's edges, so every column
       of results sits under one in the row. */
    &.is-split :is(.picker-quick, .picker-row.is-wrapping) {
      display: grid;
      grid-template-columns: repeat(var(--picker-columns), var(--ni-40));
      justify-content: space-between;
      row-gap: var(--gap-xxs);
    }

    &.is-split .picker-quick {
      position: relative;

      .picker-row {
        display: contents;
      }
    }

    &:not(.is-split) {
      height: var(--ni-40);
      margin: var(--ni-8);
    }

    &.is-split {
      display: flex;
      flex-direction: var(--reaction-picker-direction, column);

      padding: var(--ni-8) var(--ni-10);

      .picker-quick {
        height: var(--ni-40);
      }
    }

    :global(svg) {
      width: var(--ni-16);
      height: var(--ni-16);

      color: var(--color-foreground);
    }
  }

  .picker-quick {
    display: flex;
    align-items: center;
  }

  .picker-search {
    display: grid;
    grid-template-rows: 0fr;
    opacity: 0;

    transition:
      grid-template-rows calc(var(--transition-increment) * 2)
        cubic-bezier(0.22, 1, 0.36, 1),
      opacity var(--transition-increment) ease-out;

    .is-searching & {
      grid-template-rows: 1fr;
      opacity: 1;
    }
  }

  .picker-search-body {
    min-height: 0;
    overflow: hidden;

    margin-inline: calc(-1 * var(--ni-4));
    padding-inline: var(--ni-4);

    display: flex;
    flex-direction: column;
    gap: var(--gap-s);

    > :global(*) {
      flex-shrink: 0;
    }

    > :first-child {
      margin-block-start: var(--ni-12);
    }
  }

  .picker-toggle :global(.trakt-action-button) {
    border-radius: 50%;
  }

  .toggle-icon {
    display: flex;
    transition: transform calc(var(--transition-increment) * 2)
      cubic-bezier(0.22, 1, 0.36, 1);

    &.is-open {
      transform: rotate(45deg);
    }
  }

  .picker-row {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;

    &.is-wrapping {
      flex-wrap: wrap;

      height: var(--ni-104);
      align-content: flex-start;
      overflow-y: auto;

      scrollbar-width: none;
      padding-block-end: var(--ni-8);
      mask-image: linear-gradient(
        to bottom,
        black calc(100% - var(--ni-16)),
        transparent
      );

      &::-webkit-scrollbar {
        display: none;
      }
    }
  }

  /* Drawn in the gap before the toggle rather than taking a column, so the
     toggle stays on the grid's last one. */
  .picker-divider {
    position: absolute;
    inset-block: var(--ni-4);
    inset-inline-end: calc(
      var(--ni-40) +
        (100% - var(--picker-columns) * var(--ni-40)) /
        (2 * (var(--picker-columns) - 1))
    );

    width: var(--border-thickness-xxs);

    background-color: var(--color-border);
  }

  .picker-cell {
    --animation-duration: calc(var(--transition-increment) * 2);

    :global(.trakt-reaction-emoji-container) {
      transition: var(--transition-increment) ease-out;
      transition-property: opacity, filter;
    }

    :global(.trakt-action-button[disabled] .trakt-reaction-emoji-container) {
      opacity: 0.35;
      filter: grayscale(1);
    }

    :global(.trakt-action-button) {
      transition: var(--transition-increment) ease-in-out;
      transition-property: background-color;

      border-radius: 50%;

      opacity: 0;

      --delay-factor: calc(var(--animation-duration) / 6);
      animation: bump-in var(--animation-duration) ease-in forwards;
      animation-delay: calc(var(--reaction-index) * var(--delay-factor));
    }

    &.is-chosen :global(.trakt-action-button) {
      background-color: var(--color-current-reaction-background);

      @include for-touch {
        background-color: var(--color-current-reaction-hover);
      }

      &:hover {
        background-color: var(--color-current-reaction-hover);
      }
    }
  }

  .picker-field {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);

    box-sizing: border-box;
    height: var(--ni-36);
    padding-inline: var(--ni-12);

    border-radius: var(--border-radius-xxl);
    background-color: color-mix(
      in srgb,
      var(--color-foreground) 7%,
      transparent
    );
    box-shadow: inset 0 0 0 var(--border-thickness-xxs) var(--color-border);

    :global(svg) {
      flex-shrink: 0;
      color: var(--color-text-secondary);
    }

    input {
      all: unset;

      min-width: 0;
      flex: 1;

      font-size: var(--font-size-text);
      color: var(--color-text-primary);

      &::placeholder {
        color: var(--color-text-secondary);
      }
    }
  }

  .picker-empty {
    display: flex;
    align-items: center;
    justify-content: center;

    height: var(--ni-104);
    padding-block-end: var(--ni-8);
    margin: 0;

    font-size: var(--font-size-text-small);
    text-align: center;
  }
</style>
