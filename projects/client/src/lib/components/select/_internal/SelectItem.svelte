<script lang="ts">
  import CheckIcon from "$lib/components/icons/CheckIcon.svelte";
  import { Select } from "bits-ui";
  import type { Snippet } from "svelte";
  import type { SelectOption } from "../models/SelectOption.ts";

  const {
    option,
    leading,
  }: {
    option: SelectOption;
    leading?: Snippet<[SelectOption]>;
  } = $props();
</script>

<Select.Item value={option.value} label={option.label}>
  {#snippet child({ props, selected })}
    <div {...props} class="trakt-select-item">
      {#if leading}
        <span class="trakt-select-item-leading" aria-hidden="true">
          {@render leading(option)}
        </span>
      {/if}
      <span class="trakt-select-item-label ellipsis capitalize">
        {option.label}
      </span>
      {#if selected}
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

    :global(svg) {
      flex-shrink: 0;
    }
  }

  .trakt-select-item-label {
    flex: 1;
    min-width: 0;
  }

  .trakt-select-item-leading {
    display: flex;
    align-items: center;
    justify-content: center;

    flex-shrink: 0;
  }
</style>
