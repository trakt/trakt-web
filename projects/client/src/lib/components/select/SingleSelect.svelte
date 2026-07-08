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
    trigger,
  }: SingleSelectProps = $props();

  const selectedLabel = $derived(
    value
      ? (options.find((o) => o.value === value)?.label ?? placeholder)
      : placeholder,
  );

</script>

<SelectBase
  type="single"
  value={value ?? undefined}
  {placeholder}
  {disabled}
  {autoWidth}
  {trigger}
  triggerLabel={selectedLabel}
  hasValue={Boolean(value)}
  onValueChange={onChange}
>
  {#each options as option (option.value)}
    <SelectItem value={option.value} label={option.label} />
  {/each}
</SelectBase>
