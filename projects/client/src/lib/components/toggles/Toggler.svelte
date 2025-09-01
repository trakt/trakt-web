<script lang="ts" generics="T">
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType.ts";
  import ToggleTag from "$lib/sections/components/ToggleTag.svelte";
  import type { ToggleOption } from "./ToggleOption.ts";

  interface TogglerProps {
    type: "combo" | "radio";
    value: T[];
    onChange: (value: T[]) => void;
    options: ToggleOption<T>[];
    class?: string;
  }

  const { type, value, onChange, options }: TogglerProps = $props();

  const allValues = $derived(options.map((option) => option.value));

  const handleComboChange = (optionValue: T) => {
    const isCurrentlySelected = value.includes(optionValue);

    const newValues = isCurrentlySelected
      ? value.filter((v) => v !== optionValue)
      : [...value, optionValue];

    onChange(newValues.length > 0 ? newValues : allValues);
  };

  const handleRadioChange = (optionValue: T) => {
    onChange([optionValue]);
  };

  const isSelected = (optionValue: T): boolean => {
    return value.includes(optionValue);
  };
</script>

<div
  class="trakt-toggler"
  role="group"
  data-dpad-navigation={DpadNavigationType.List}
>
  {#each options as option (option.value)}
    <ToggleTag
      navigationType={DpadNavigationType.Item}
      label={option.label}
      onclick={() =>
        type === "combo"
          ? handleComboChange(option.value)
          : handleRadioChange(option.value)}
      isPressed={isSelected(option.value)}
    >
      {#if option.content}
        {@render option.content()}
      {:else}
        {option.text}
      {/if}
    </ToggleTag>
  {/each}
</div>

<style>
  .trakt-toggler {
    display: flex;
    justify-content: center;
    gap: var(--gap-xxs);

    /* To visually align the buttons better with the header */
    padding-top: var(--ni-2);
  }
</style>
