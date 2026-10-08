<script lang="ts" generics="T extends string">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import CloseIcon from "$lib/components/icons/CloseIcon.svelte";
  import PlusIcon from "$lib/components/icons/PlusIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import ReactionPickerCell from "./ReactionPickerCell.svelte";
  import type { ReactionPickerOption } from "./ReactionPickerOption.ts";
  import type { ReactionPickerProps } from "./ReactionPickerProps.ts";

  const {
    options,
    chosen,
    onSelect,
    onClose,
    quickCount,
    limit,
    isExpanded = false,
    onToggleExpanded,
  }: ReactionPickerProps<T> = $props();

  const isSplit = $derived(quickCount != null && options.length > quickCount);

  const quick = $derived(isSplit ? options.slice(0, quickCount) : options);
  const rest = $derived(isSplit ? options.slice(quickCount) : []);
</script>

{#snippet modeToggle()}
  <div class="picker-toggle">
    <ActionButton
      label={isExpanded
        ? m.button_label_quick_reactions()
        : m.button_label_more_reactions()}
      onclick={onToggleExpanded}
      style="ghost"
    >
      <span class="toggle-icon" class:is-open={isExpanded}>
        <PlusIcon />
      </span>
    </ActionButton>
  </div>
{/snippet}

{#snippet reactionButton(option: ReactionPickerOption<T>, index: number)}
  <ReactionPickerCell {option} {index} {chosen} {limit} {onSelect} />
{/snippet}

<div
  class="trakt-reaction-picker"
  class:is-split={isSplit}
  class:is-expanded={isExpanded}
  style:--picker-columns={isSplit ? quick.length + 1 : null}
>
  {#if isSplit}
    <div class="picker-more" inert={!isExpanded}>
      <div class="picker-more-body">
        <div class="picker-more-card">
          <div class="picker-row is-wrapping">
            {#each rest as option, index (option.id)}
              {@render reactionButton(option, index)}
            {/each}
          </div>
        </div>
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
    /* The quick row and the full grid share one set of columns - the quick
       reactions plus the toggle - spread to the panel's edges, so every column
       below sits under one in the row. */
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

  .picker-more {
    display: grid;
    grid-template-rows: 0fr;
    opacity: 0;

    transition:
      grid-template-rows calc(var(--transition-increment) * 2)
        cubic-bezier(0.22, 1, 0.36, 1),
      opacity var(--transition-increment) ease-out;

    .is-expanded & {
      grid-template-rows: 1fr;
      opacity: 1;
    }
  }

  .picker-more-body {
    min-height: 0;
    overflow: hidden;

    margin-inline: calc(-1 * var(--ni-4));
  }

  .picker-more-card {
    margin-block: 0 var(--ni-12);
    padding: var(--ni-8) var(--ni-4) 0;

    :global([data-popup-position="bottom"]) & {
      margin-block: var(--ni-12) 0;
    }

    background: var(--color-reaction-distribution-background);
    border-radius: var(--border-radius-xxl);
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

      height: var(--ni-152);
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

</style>
