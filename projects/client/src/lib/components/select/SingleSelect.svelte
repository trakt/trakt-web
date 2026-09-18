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
</script>

{#snippet triggerTag()}
  {#if selectedOption?.tag}
    {@render selectedOption.tag(selectedOption)}
  {/if}
{/snippet}

<SelectBase
  type="single"
  value={value ?? undefined}
  {placeholder}
  {disabled}
  {autoWidth}
  {icon}
  {trigger}
  triggerLabel={selectedLabel}
  triggerTag={selectedOption?.tag ? triggerTag : undefined}
  hasValue={Boolean(value)}
  onValueChange={onChange}
>
  {#each options as option (option.value)}
    <SelectItem {option} />
  {/each}
</SelectBase>
