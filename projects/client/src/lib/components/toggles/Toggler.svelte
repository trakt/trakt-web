<script lang="ts" generics="T extends string">
  import SegmentedSelect from "$lib/components/select/SegmentedSelect.svelte";
  import type { SegmentedSelectOption } from "$lib/components/select/models/SegmentedSelectOption.ts";
  import ToggleIcon from "./ToggleIcon.svelte";
  import type { ToggleOption } from "./ToggleOption.ts";

  interface TogglerProps {
    value: T;
    onChange: (value: T) => void;
    options: ToggleOption<T>[];
    variant?: "text" | "selected-icon";
    ariaLabel?: string;
    fill?: boolean;
  }

  const {
    value,
    onChange,
    options,
    variant = "selected-icon",
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

  // Word-only toggles, like a settings switch between two modes, keep the track.
  const isText = $derived(variant === "text");

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
  variant={isText ? "regular" : "selected-icon"}
  style={isText ? "default" : "pills"}
  {value}
  options={segmentedOptions}
  {ariaLabel}
  {fill}
  icon={isText ? undefined : iconSnippet}
  {onChange}
/>
