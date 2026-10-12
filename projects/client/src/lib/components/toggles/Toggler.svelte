<script lang="ts" generics="T extends string">
  import SegmentedSelect from "$lib/components/select/SegmentedSelect.svelte";
  import type { SegmentedSelectOption } from "$lib/components/select/models/SegmentedSelectOption.ts";
  import type { SelectStyle } from "$lib/components/select/models/SelectStyle.ts";
  import ToggleIcon from "./ToggleIcon.svelte";
  import type { ToggleOption } from "./ToggleOption.ts";

  interface TogglerProps {
    value: T;
    onChange: (value: T) => void;
    options: ToggleOption<T>[];
    variant?: "icon" | "text" | "selected-icon";
    style?: SelectStyle;
    ariaLabel?: string;
    fill?: boolean;
  }

  const {
    value,
    onChange,
    options,
    variant = "icon",
    style = "default",
    ariaLabel,
    fill = false,
  }: TogglerProps = $props();

  const segmentedOptions = $derived<SegmentedSelectOption<T>[]>(
    options.map((option) => ({
      value: option.value,
      text: option.text(),
      label: option.label(),
      ...(option.count != null ? { count: option.count } : {}),
      ...(option.href ? { href: option.href } : {}),
    })),
  );

  const selectVariant = $derived.by(() => {
    switch (variant) {
      case "text":
        return "regular";
      case "selected-icon":
        return "selected-icon";
      default:
        return "compact";
    }
  });

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
  variant={selectVariant}
  {style}
  {value}
  options={segmentedOptions}
  {ariaLabel}
  {fill}
  icon={variant === "text" ? undefined : iconSnippet}
  {onChange}
/>
