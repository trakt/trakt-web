<script lang="ts">
  import type { Snippet } from "svelte";

  const { children }: { children: Snippet } = $props();
</script>

<ul class="trakt-dropdown-group">
  {@render children()}
</ul>

<style lang="scss">
  // One elevated card with flush, hairline-divided rows. Children are
  // DropdownItems, rendered as rows by setting the item's own configuration
  // tokens here: they inherit down the list, so no outside-in overrides and no
  // !important are needed.
  .trakt-dropdown-group {
    all: unset;

    --dropdown-item-radius: 0;
    --dropdown-item-height: auto;
    --dropdown-item-padding-block: var(--ni-14);
    --dropdown-item-padding-inline: var(--ni-16);
    --dropdown-item-background: transparent;
    --dropdown-item-background-hover: var(--color-select-item-hover);
    --dropdown-item-background-selected: var(--color-select-item-hover);
    --dropdown-item-background-active: var(--color-select-item-hover);
    --dropdown-item-foreground: var(--color-text-primary);

    display: grid;
    grid-template-columns: 100%;

    background: var(--color-option-list-background);
    border: var(--ni-1) solid var(--color-option-list-border);
    border-radius: var(--border-radius-l);
    overflow: hidden;

    // Destructive actions keep their red as a safety cue.
    :global(li[data-color="red"]) {
      --dropdown-item-foreground: var(--red-600);
    }

    // Flush rows carry no fill, so dim the label to keep a disabled cue.
    :global(li[disabled="true"]) {
      --dropdown-item-foreground: var(--color-text-secondary);
    }

    :global(li:not(:last-child)) {
      border-block-end: var(--ni-1) solid var(--color-option-list-separator);
    }
  }
</style>
