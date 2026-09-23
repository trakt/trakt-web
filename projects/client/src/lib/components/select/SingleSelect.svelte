<script lang="ts">
  import SelectBase from "./_internal/SelectBase.svelte";
  import SelectItem from "./_internal/SelectItem.svelte";
  import type { SingleSelectProps } from "./models/SingleSelectProps";

  const {
    options,
    value = null,
    placeholder,
    disabled = false,
    autoWidth = false,
    onChange,
    icon,
    trigger,
  }: SingleSelectProps = $props();

  const selectedOption = $derived(
    value ? options.find((o) => o.value === value) : undefined,
  );

  const selectedLabel = $derived(selectedOption?.label ?? placeholder);

  const triggerProps = $derived(
    trigger
      ? { trigger }
      : {
          placeholder,
          triggerLabel: selectedLabel,
          hasValue: Boolean(value),
          icon,
          selectedOption,
        },
  );

</script>

<SelectBase
  type="single"
  value={value ?? undefined}
  {disabled}
  {autoWidth}
  {...triggerProps}
  onValueChange={onChange}
>
  {#each options as option (option.value)}
    <SelectItem {option} />
  {/each}
</SelectBase>
