<script lang="ts">
  import { Select } from "bits-ui";
  import DropdownCaretIcon from "../dropdown/DropdownCaretIcon.svelte";
  import ScrollDownIcon from "./_internal/icons/ScrollDownIcon.svelte";
  import ScrollUpIcon from "./_internal/icons/ScrollUpIcon.svelte";
  import MultiSelectItem from "./_internal/MultiSelectItem.svelte";
  import type { MultiSelectProps } from "./models/MultiSelectProps";

  const {
    options,
    value = [],
    placeholder,
    disabled = false,
    onChange,
  }: MultiSelectProps = $props();

  const selectedLabel = $derived(
    value.length
      ? options
          .filter((option) => value.includes(option.value))
          .map((option) => option.label)
          .join(", ")
      : placeholder,
  );
</script>

<Select.Root type="multiple" {value} {disabled} onValueChange={onChange}>
  <Select.Trigger class="trakt-select-trigger" aria-label={placeholder}>
    <span class="ellipsis capitalize">
      {selectedLabel}
    </span>
    <DropdownCaretIcon open={false} />
  </Select.Trigger>
  <Select.Portal>
    <Select.Content class="trakt-select-content" sideOffset={8}>
      <Select.ScrollUpButton class="trakt-select-scroll-button">
        <ScrollUpIcon />
      </Select.ScrollUpButton>

      <Select.Viewport>
        {#each options as option, i (i + option.value)}
          <MultiSelectItem value={option.value} label={option.label} />
        {/each}
      </Select.Viewport>

      <Select.ScrollDownButton class="trakt-select-scroll-button">
        <ScrollDownIcon />
      </Select.ScrollDownButton>
    </Select.Content>
  </Select.Portal>
</Select.Root>

<style lang="scss">
  @use "$style/scss/mixins/index.scss" as *;

  :global(.trakt-select-trigger) {
    --color-background-select: var(--color-background);
    --color-foreground-select: var(--color-foreground);
    --color-border-select: color-mix(
      in srgb,
      var(--purple-400) 20%,
      transparent
    );
    --button-height: var(--ni-40);

    all: unset;
    cursor: pointer;

    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--gap-s);

    height: var(--button-height);
    min-width: 0;

    padding: 0 var(--ni-12);
    box-sizing: border-box;

    border: var(--border-thickness-xxs) solid var(--color-border-select);
    border-radius: var(--ni-10);

    background-color: var(--color-background-select);
    color: var(--color-foreground-select);

    transition: var(--transition-increment) ease-in-out;
    transition-property: background-color, border-color;

    -webkit-tap-highlight-color: transparent;
  }

  :global(.trakt-select-trigger) span {
    font-size: var(--ni-12);
    letter-spacing: 0.04em;
    opacity: 0.8;
  }

  :global(.trakt-select-trigger:not([data-disabled])) {
    @include for-mouse {
      &:hover {
        --color-border-select: color-mix(
          in srgb,
          var(--purple-400) 45%,
          transparent
        );
      }

      &:focus-visible {
        outline: var(--border-thickness-xxs) solid var(--purple-400);
      }
    }
  }

  :global(.trakt-select-trigger[data-disabled]) {
    cursor: not-allowed;
    --color-foreground-select: var(--color-foreground-select-disabled);
    --color-background-select: var(--color-surface-button-disabled);
  }

  :global(.trakt-dropdown-caret) {
    width: var(--ni-12);
    height: var(--ni-12);
    flex-shrink: 0;
  }

  :global(.trakt-select-content) {
    z-index: calc(var(--layer-menu) + 1);

    width: var(--bits-select-anchor-width);
    max-height: min(var(--ni-276), var(--bits-floating-available-height));

    border-radius: var(--border-radius-m);
    background-color: var(--shade-10);
    box-shadow: var(--shadow-menu);

    padding: var(--ni-8);
  }

  :global(.trakt-select-content[data-state="open"]) {
    animation: select-fade-in var(--transition-increment) ease-out;
  }

  :global(.trakt-select-scroll-button) {
    display: flex;
    align-items: center;
    justify-content: center;

    width: 100%;
    height: var(--ni-24);

    :global(svg) {
      width: var(--ni-12);
      height: var(--ni-12);

      color: var(--shade-700);
    }
  }
</style>
