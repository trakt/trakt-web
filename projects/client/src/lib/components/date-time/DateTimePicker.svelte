<script lang="ts">
  import DateInput from "./_internal/DateInput.svelte";
  import type { DatePickerProps } from "./models/DatePickerProps";

  const {
    value,
    minDate,
    maxDate,
    label,
    onChange,
    disabled,
  }: DatePickerProps = $props();
</script>

<DateInput
  type="datetime-local"
  {value}
  {minDate}
  {maxDate}
  {label}
  {onChange}
  {disabled}
/>
