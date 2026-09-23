<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import CloseIcon from "$lib/components/icons/CloseIcon.svelte";
  import PlusIcon from "$lib/components/icons/PlusIcon.svelte";
  import SearchIcon from "$lib/components/icons/SearchIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import ReactionEmoji from "./ReactionEmoji.svelte";
  import type { ReactionPickerOption } from "./ReactionPickerOption.ts";
  import type { ReactionPickerProps } from "./ReactionPickerProps.ts";

  /*
    THE reaction picker. One control, both taxonomies.

    It started as `comment-actions/ReactionPicker`, sealed inside the comment
    stack. Reacting to a title is the same control doing the same job, so it
    moves here rather than being written a second time one folder over - two
    implementations of one thing is two sets of bugs to fix twice.

    The taxonomies genuinely differ and stay where they are; each call site
    flattens its own into `ReactionPickerOption` and feeds it in. The two
    layout differences are options, not components:

    - `onClose` adds the leading dismiss button, for a picker that opens in
      place rather than inside a popover that can dismiss it.
    - `quickCount` splits a long taxonomy into a quick row plus a `+` that
      opens search. A short one leaves it off and puts everything on the row.
  */
  const {
    options,
    chosen,
    onSelect,
    onClose,
    quickCount,
    preferred = [],
  }: ReactionPickerProps = $props();

  const isSplit = $derived(quickCount != null && options.length > quickCount);

  /* Preferred ids the taxonomy still knows about, so a dropped value in
     storage cannot render an empty cell. */
  const preferredOptions = $derived(
    preferred
      .map((id) => options.find((option) => option.id === id))
      .filter((option): option is ReactionPickerOption => option != null),
  );

  /*
    The viewer's own picks lead, then canonical order fills the row out. A row
    that is only ever the same six ignores the person using it; one that is
    only ever their recents hides everything they have not tried.
  */
  const quick = $derived(
    !isSplit ? options : [
      ...preferredOptions,
      ...options.filter((option) => !preferredOptions.includes(option)),
    ].slice(0, quickCount),
  );

  let isSearching = $state(false);
  let query = $state("");
  let queryInput = $state<HTMLInputElement>();

  /* The field exists before it is shown, so autofocus cannot do this - it
     fires once at mount, which here is while the quick row is still up. */
  $effect(() => {
    if (isSearching) queryInput?.focus();
  });

  const results = $derived.by(() => {
    const term = query.trim().toLowerCase();
    if (term === "") return options;

    return options.filter((option) =>
      option.label.toLowerCase().includes(term) ||
      option.id.toLowerCase().includes(term)
    );
  });
</script>

{#snippet modeToggle()}
  <ActionButton
    label={isSearching
      ? m.button_label_quick_reactions()
      : m.button_label_more_reactions()}
    onclick={() => (isSearching = !isSearching)}
    style="ghost"
  >
    <PlusIcon />
  </ActionButton>
{/snippet}

{#snippet reactionButton(option: ReactionPickerOption, index: number)}
  <div
    class="picker-cell"
    class:is-chosen={chosen === option.id}
    style="--reaction-index: {index}"
  >
    <ActionButton
      label={m.button_label_react({ reaction: option.label })}
      onclick={() => onSelect(option.id)}
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

<!--
  When the picker splits, BOTH modes stay mounted, hidden rather than removed.
  Swapping them with an `{#if}` destroys the button under the pointer as it is
  clicked, and a portal's click-outside check then asks whether a DETACHED node
  is inside the panel - it is not, so the whole popover dismissed on the way
  into search.
-->
<div
  class="trakt-reaction-picker"
  class:is-split={isSplit}
  class:is-searching={isSearching}
>
  <div class="picker-quick" hidden={isSearching}>
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

  {#if isSplit}
    <!--
      The toggle stays beside the field rather than disappearing into it. It is
      the control that opened this, and without it search was a one-way door:
      the only way back to the quick row was to dismiss the popover and start
      again.
    -->
    <div class="picker-search" hidden={!isSearching}>
      <div class="picker-search-head">
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

        {@render modeToggle()}
      </div>

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
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  /*
    No width of its own: whatever opens this - a comment bar, a popover - is
    definitely sized, and both modes live inside that. Setting one here made
    the content wider than the surface painting behind it, so the plus and the
    search field hung off the edge of the overlay.
  */
  .trakt-reaction-picker {
    /*
      A split picker is a panel in its own right and needs its own breathing
      room. An unsplit one is a bare row, placed by whatever opened it - the
      comment bar sets its own height and margin around this.
    */
    &.is-split {
      padding: var(--ni-8) var(--ni-10);

      &.is-searching {
        padding: var(--ni-12);
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
    gap: var(--gap-xxs);
  }

  /*
    Explicit, because a scoped `display` beats the global `[hidden]` rule -
    same specificity, and this stylesheet comes later. Without it the hidden
    mode stays on screen and both are visible at once.
  */
  .picker-quick[hidden],
  .picker-search[hidden] {
    display: none;
  }

  .picker-search {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);
  }

  .picker-search-head {
    display: flex;
    align-items: center;
    gap: var(--gap-xxs);
  }

  /* Takes the row's slack so the toggle keeps its size beside it. */
  .picker-field {
    flex: 1;
    min-width: 0;
  }

  /* One row, always: the quick set is a line beside a rule, and a wrap turns
     it into a grid that no longer reads as a strip off its trigger. */
  .picker-row {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    gap: var(--gap-xxs);

    /* Results are the one place a wrap is right - there can be nine of them,
       and the panel has a fixed width to wrap inside. */
    &.is-wrapping {
      flex-wrap: wrap;
    }
  }

  .picker-divider {
    align-self: stretch;
    width: var(--border-thickness-xxs);

    margin-block: var(--ni-4);
    margin-inline: var(--ni-2);

    background-color: var(--color-border);
  }

  .picker-cell {
    --animation-duration: calc(var(--transition-increment) * 2);

    border-radius: 50%;

    :global(.trakt-action-button) {
      transition: var(--transition-increment) ease-in-out;
      transition-property: background-color;

      border-radius: 50%;

      opacity: 0;

      --delay-factor: calc(var(--animation-duration) / 6);
      animation: bump-in var(--animation-duration) ease-in forwards;
      animation-delay: calc(var(--reaction-index) * var(--delay-factor));
    }

    /*
      The current pick, held lit. Theme tokens rather than a brand colour: the
      app ships FREE, VIP and DIRECTOR tier palettes, and a hardcoded purple
      ring stayed purple under all three.
    */
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
    margin: 0;
    font-size: var(--font-size-text-small);
  }
</style>
