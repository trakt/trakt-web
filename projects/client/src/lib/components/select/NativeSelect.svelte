<script lang="ts" generics="T">
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";
  import type { Snippet } from "svelte";

  type SelectOption = {
    value: T;
    text: string;
    label: string;
  };

  const {
    value,
    options,
    icon,
    onChange,
    getDisplayText,
  }: {
    value: T;
    options: SelectOption[];
    icon?: Snippet;
    onChange: (value: T) => void;
    getDisplayText?: (value: T) => string;
  } = $props();

  const displayText = getDisplayText
    ? getDisplayText(value)
    : (options.find((option) => option.value === value)?.text ?? "");
</script>

<div class="native-select-container">
  {#if icon}
    <div class="native-select-icon">
      {@render icon()}
    </div>
  {/if}

  <span class="native-select-display">{displayText}</span>

  <select
    onchange={(ev) => onChange(ev.currentTarget.value as T)}
    data-dpad-navigation={DpadNavigationType.Item}
  >
    {#each options as option}
      <option
        selected={value === option.value}
        value={option.value}
        aria-label={option.label}
      >
        {option.text}
      </option>
    {/each}
  </select>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .native-select-container {
    --icon-size: var(--ni-16);

    position: relative;
    height: var(--ni-28);

    display: flex;
    align-items: center;
    gap: var(--gap-xs);

    color: var(--color-text-primary);
    font-size: var(--ni-16);

    border-radius: var(--border-radius-s);

    &:has(select:focus-visible) {
      outline-offset: var(--ni-2);
      outline: var(--border-thickness-xs) solid var(--purple-500);
    }

    @include for-mouse {
      &:hover {
        background-color: var(--cm-background-30);
      }
    }
  }

  .native-select-icon {
    width: var(--icon-size);

    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .native-select-display {
    pointer-events: none;
  }

  select {
    position: absolute;

    width: 100%;
    height: 100%;

    cursor: pointer;

    border: none;
    background-color: transparent;

    appearance: none;
    opacity: 0;
  }
</style>
