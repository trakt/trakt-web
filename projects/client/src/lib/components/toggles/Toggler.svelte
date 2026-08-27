<script lang="ts" generics="T extends string">
  import SegmentedSelect from "$lib/components/select/SegmentedSelect.svelte";
  import type { SegmentedSelectOption } from "$lib/components/select/models/SegmentedSelectOption.ts";
  import ToggleIcon from "./ToggleIcon.svelte";
  import type { ToggleOption } from "./ToggleOption.ts";

  interface TogglerProps {
    value: T;
    onChange: (value: T) => void;
    options: ToggleOption<T>[];
    variant?: "icon" | "text";
    ariaLabel?: string;
  }

  const {
    value,
    onChange,
    options,
    variant = "icon",
    ariaLabel,
  }: TogglerProps = $props();

  const segmentedOptions = $derived<SegmentedSelectOption<T>[]>(
    options.map((option) => ({
      value: option.value,
      text: option.text(),
      label: option.label(),
      ...(option.href ? { href: option.href } : {}),
    })),
  );

  const customIconFor = (optionValue: string) =>
    options.find((option) => option.value === optionValue)?.icon;
</script>

{#snippet iconSnippet(option: SegmentedSelectOption<T>)}
  {@const customIcon = customIconFor(option.value)}
  {#if customIcon}
    {@render customIcon()}
  {:else}
    <ToggleIcon {option} />
  {/if}
{/snippet}

<SegmentedSelect
  variant={variant === "text" ? "regular" : "compact"}
  {value}
  options={segmentedOptions}
  {ariaLabel}
  icon={variant === "icon" ? iconSnippet : undefined}
  {onChange}
/>
