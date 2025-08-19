<script lang="ts">
  import ToggleTag from "$lib/sections/components/ToggleTag.svelte";
  import type { Writable } from "svelte/store";
  import type { ToggleOption } from "./ToggleOption.ts";

  interface TogglerProps {
    type: "combo" | "radio";
    value: Writable<string[]>;
    options: ToggleOption[];
    class?: string;
  }

  const { type, value, options, class: className }: TogglerProps = $props();

  const allValues = $derived(options.map((option) => option.value));

  const handleComboChange = (optionValue: string) => {
    const currentValues = $value;
    const isCurrentlySelected = currentValues.includes(optionValue);

    const newValues = isCurrentlySelected
      ? currentValues.filter((v) => v !== optionValue)
      : [...currentValues, optionValue];

    value.set(newValues.length > 0 ? newValues : allValues);
  };

  const handleRadioChange = (optionValue: string) => {
    value.set([optionValue]);
  };

  const isSelected = (optionValue: string): boolean => {
    return $value.includes(optionValue);
  };
</script>

<div class={`toggler ${className || ""}`} role="group">
  {#each options as option (option.value)}
    <ToggleTag
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
        {option.label}
      {/if}
    </ToggleTag>
  {/each}
</div>

<style>
  .toggler {
    display: flex;
    justify-content: center;
    gap: var(--gap-xxs);

    /* To visually align the buttons better with the header */
    padding-top: var(--ni-2);
  }
</style>
