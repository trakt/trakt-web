<script lang="ts">
  import AddIcon from "$lib/components/icons/AddIcon.svelte";
  import CheckIcon from "$lib/components/icons/CheckIcon.svelte";
  import RemoveIcon from "$lib/components/icons/RemoveIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { Select } from "bits-ui";
  import type { MultiSelectState } from "../models/MultiSelectState.ts";
  import type { SelectItemProps } from "./SelectItemProps.ts";

  const {
    value,
    label,
    state,
    excludable = true,
    onCommit,
  }: SelectItemProps = $props();

  const hasToggle = $derived(onCommit != null && excludable);

  // Keep the pointer sequence from reaching the row so bits-ui does not also
  // toggle selection - the buttons are the single source of truth.
  const block = (event: Event) => event.stopPropagation();

  const toggle = (event: MouseEvent, target: MultiSelectState) => {
    event.preventDefault();
    event.stopPropagation();
    onCommit?.(state === target ? undefined : target);
  };
</script>

{#snippet sideToggle(target: MultiSelectState)}
  <button
    type="button"
    class="toggle-side"
    class:is-include={target === "included"}
    class:is-exclude={target === "excluded"}
    aria-label={target === "included"
      ? m.button_label_include_option({ label })
      : m.button_label_exclude_option({ label })}
    aria-pressed={state === target}
    onpointerdown={block}
    onpointerup={block}
    onclick={(event) => toggle(event, target)}
  >
    {#if target === "included"}
      <AddIcon />
    {:else}
      <RemoveIcon />
    {/if}
  </button>
{/snippet}

<Select.Item {value} {label}>
  {#snippet child({ props, selected })}
    <div
      {...props}
      class="trakt-select-item"
      class:has-toggle={hasToggle}
      class:is-excluded={state === "excluded"}
      data-state={state ?? "none"}
      aria-label={state === "excluded"
        ? m.option_label_excluded({ label })
        : undefined}
    >
      {#if hasToggle}
        {@render sideToggle("included")}
      {/if}

      <span class="ellipsis capitalize">{label}</span>

      {#if hasToggle}
        {@render sideToggle("excluded")}
      {:else if selected}
        <CheckIcon />
      {/if}
    </div>
  {/snippet}
</Select.Item>

<style lang="scss">
  @use "$style/scss/mixins/index.scss" as *;

  .trakt-select-item {
    --color-background-item-hover: var(--shade-60);
    --color-foreground-item: var(--shade-700);
    --select-item-height: var(--ni-40);

    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--gap-s);

    user-select: none;
    cursor: pointer;

    height: var(--select-item-height);
    padding: var(--ni-8);
    box-sizing: border-box;

    border-radius: var(--border-radius-s);

    background-color: transparent;
    color: var(--color-foreground-item);

    transition: var(--transition-increment) ease-in-out;
    transition-property: background-color, color;

    -webkit-tap-highlight-color: transparent;

    @include for-mouse {
      &:hover {
        background-color: var(--color-background-item-hover);
      }
    }

    &[data-highlighted] {
      background-color: var(--color-background-item-hover);
    }

    /* label sits between two fixed side slots so it never shifts */
    &.has-toggle {
      display: grid;
      grid-template-columns: var(--ni-24) 1fr var(--ni-24);
      gap: var(--gap-s);
    }

    &.is-excluded .ellipsis {
      color: var(--red-500);
      text-decoration: line-through;
    }

    .ellipsis {
      text-align: start;
    }

    .toggle-side {
      all: unset;

      display: flex;
      align-items: center;
      justify-content: center;

      width: var(--ni-24);
      height: var(--ni-24);
      box-sizing: border-box;

      border-radius: var(--border-radius-xs);
      cursor: pointer;

      color: var(--shade-500);
      opacity: 0.35;

      transition: var(--transition-increment) ease-in-out;
      transition-property: background-color, color, opacity;

      @include for-mouse {
        &:hover {
          opacity: 1;
        }
      }

      &:focus-visible {
        outline: var(--border-thickness-xs) solid var(--color-foreground);
        opacity: 1;
      }
    }

    /* the chosen side stays solid regardless of hover */
    &[data-state="included"] .toggle-side.is-include {
      opacity: 1;
      color: var(--shade-10);
      background-color: var(--purple-500);
    }

    &[data-state="excluded"] .toggle-side.is-exclude {
      opacity: 1;
      color: var(--shade-10);
      background-color: var(--red-500);
    }

    :global(svg) {
      width: var(--ni-16);
      height: var(--ni-16);
      flex-shrink: 0;
    }
  }
</style>
