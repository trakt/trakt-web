<script lang="ts">
  import DropdownCaretIcon from "$lib/components/dropdown/DropdownCaretIcon.svelte";
  import { Select } from "bits-ui";
  import type { Snippet } from "svelte";
  import ScrollDownIcon from "./icons/ScrollDownIcon.svelte";
  import ScrollUpIcon from "./icons/ScrollUpIcon.svelte";

  type SelectSingleProps = {
    type: "single";
    value: string | undefined;
    onValueChange: (value: string) => void;
  };

  type SelectMultipleProps = {
    type: "multiple";
    value: string[];
    onValueChange: (value: string[]) => void;
  };

  type SelectBaseProps = {
    placeholder: string;
    disabled?: boolean;
    triggerLabel: string;
    hasValue: boolean;
    children: Snippet;
    autoWidth?: boolean;
    trigger?: Snippet<[{ props: Record<string, unknown>; open: boolean }]>;
  } & (SelectSingleProps | SelectMultipleProps);

  const {
    placeholder,
    disabled,
    triggerLabel,
    hasValue,
    children,
    autoWidth = false,
    trigger,
    ...rest
  }: SelectBaseProps = $props();

  let open = $state(false);
</script>

{#snippet shell()}
  <Select.Trigger>
    {#snippet child({ props })}
      {#if trigger}
        {@render trigger({ props, open })}
      {:else}
        <button
          {...props}
          class="trakt-select-trigger"
          aria-label={placeholder}
          data-has-value={hasValue}
        >
          <span class="ellipsis capitalize">{triggerLabel}</span>
          <DropdownCaretIcon {open} />
        </button>
      {/if}
    {/snippet}
  </Select.Trigger>
  <Select.Portal>
    <Select.Content sideOffset={8} forceMount>
      {#snippet child({ props, wrapperProps, open: contentOpen })}
        {#if contentOpen}
          <div {...wrapperProps}>
            <div {...props} class="trakt-select-content" data-auto-width={autoWidth}>
              <Select.ScrollUpButton>
                {#snippet child({ props: scrollProps })}
                  <div {...scrollProps} class="trakt-select-scroll-button">
                    <ScrollUpIcon />
                  </div>
                {/snippet}
              </Select.ScrollUpButton>

              <Select.Viewport>
                {@render children()}
              </Select.Viewport>

              <Select.ScrollDownButton>
                {#snippet child({ props: scrollProps })}
                  <div {...scrollProps} class="trakt-select-scroll-button">
                    <ScrollDownIcon />
                  </div>
                {/snippet}
              </Select.ScrollDownButton>
            </div>
          </div>
        {/if}
      {/snippet}
    </Select.Content>
  </Select.Portal>
{/snippet}

{#if rest.type === "single"}
  <Select.Root
    type="single"
    value={rest.value}
    {disabled}
    onValueChange={rest.onValueChange}
    bind:open
  >
    {@render shell()}
  </Select.Root>
{:else}
  <Select.Root
    type="multiple"
    value={rest.value}
    {disabled}
    onValueChange={rest.onValueChange}
    bind:open
  >
    {@render shell()}
  </Select.Root>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index.scss" as *;

  .trakt-select-trigger {
    --color-foreground-select: var(--color-foreground);
    --color-border-select: var(--shade-300);
    --button-height: var(--ni-40);

    all: unset;
    cursor: pointer;

    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--gap-s);

    height: var(--button-height);
    overflow: hidden;
    min-width: 0;

    span {
      flex: 1;
      min-width: 0;
    }

    padding: var(--ni-12);
    box-sizing: border-box;

    border-radius: var(--border-radius-m);
    border: var(--border-thickness-xxs) solid var(--color-border-select);

    background-color: var(--color-background-select);
    color: var(--color-foreground-select);

    transition: var(--transition-increment) ease-in-out;
    transition-property: background-color, color, border-color;

    -webkit-tap-highlight-color: transparent;

    &:not([data-disabled]) {
      @include for-mouse {
        &:hover,
        &:focus-visible {
          background-color: var(--color-foreground-select);
          color: var(--color-background-select);
          border-color: var(--color-background-select);
        }

        &:focus-visible {
          outline: var(--border-thickness-xs) solid
            var(--color-foreground-select);
        }
      }
    }

    &[data-has-value="true"] {
      border-color: var(--blue-500);
    }

    &[data-disabled] {
      cursor: not-allowed;
      --color-foreground-select: var(--color-foreground-select-disabled);
      --color-background-select: var(--color-surface-button-disabled);
    }

    :global(.trakt-dropdown-caret) {
      width: var(--ni-12);
      height: var(--ni-12);
      flex-shrink: 0;
    }
  }

  .trakt-select-content[data-auto-width="true"] {
    width: max-content;
    min-width: var(--bits-select-anchor-width);
  }

  .trakt-select-content {
    z-index: calc(var(--layer-menu) + 1);

    width: var(--bits-select-anchor-width);
    max-height: min(var(--ni-276), var(--bits-floating-available-height));

    border-radius: var(--border-radius-m);
    background-color: var(--shade-10);
    box-shadow: var(--shadow-menu);

    padding: var(--ni-8);

    &[data-state="open"] {
      animation: select-fade-in var(--transition-increment) ease-out;
    }
  }

  .trakt-select-scroll-button {
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
