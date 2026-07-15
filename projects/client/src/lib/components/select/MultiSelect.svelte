<script lang="ts">
  import SelectBase from "./_internal/SelectBase.svelte";
  import SelectItem from "./_internal/SelectItem.svelte";
  import type { MultiSelectProps } from "./models/MultiSelectProps.ts";
  import type { MultiSelectState } from "./models/MultiSelectState.ts";
  import * as m from "$lib/features/i18n/messages.ts";

  const {
    options,
    included = [],
    excluded = [],
    placeholder,
    disabled = false,
    onChange,
  }: MultiSelectProps = $props();

  const includedSet = $derived(new Set(included));
  const excludedSet = $derived(new Set(excluded));

  /*
    bits-ui treats included and excluded values alike as "selected", so both
    stay highlighted in the list. The tri-state cycle is resolved on change.
  */
  const value = $derived([...included, ...excluded]);

  const stateOf = (optionValue: string): MultiSelectState | undefined => {
    if (includedSet.has(optionValue)) return "included";
    if (excludedSet.has(optionValue)) return "excluded";
    return undefined;
  };

  const selectedLabel = $derived(
    value.length
      ? options
        .filter(
          (option) =>
            includedSet.has(option.value) || excludedSet.has(option.value),
        )
        .map((option) =>
          excludedSet.has(option.value)
            ? m.option_text_excluded({ label: option.label })
            : option.label
        )
        .join(", ")
      : placeholder,
  );

  const setState = (
    optionValue: string,
    next: MultiSelectState | undefined,
  ) => {
    const withoutOption = (list: string[]) =>
      list.filter((current) => current !== optionValue);

    onChange({
      included: next === "included"
        ? [...withoutOption(included), optionValue]
        : withoutOption(included),
      excluded: next === "excluded"
        ? [...withoutOption(excluded), optionValue]
        : withoutOption(excluded),
    });
  };

  /*
    Clicking or keyboard-toggling a row handles inclusion: an untouched option
    becomes included, an already included/excluded one clears. Exclusion is
    driven explicitly by the per-row toggle buttons via setState.
  */
  const onRowToggle = (next: string[]) => {
    const nextSet = new Set(next);
    const toggled = value.find((current) => !nextSet.has(current)) ??
      next.find((current) => !stateOf(current));

    if (!toggled) return;

    setState(toggled, stateOf(toggled) === undefined ? "included" : undefined);
  };
</script>

<SelectBase
  type="multiple"
  {value}
  {placeholder}
  {disabled}
  triggerLabel={selectedLabel}
  hasValue={value.length > 0}
  onValueChange={onRowToggle}
>
  {#each options as option (option.value)}
    <SelectItem
      value={option.value}
      label={option.label}
      state={stateOf(option.value)}
      excludable={option.excludable ?? true}
      onCommit={(next) => setState(option.value, next)}
    />
  {/each}
</SelectBase>
