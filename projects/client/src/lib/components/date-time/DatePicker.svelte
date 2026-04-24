<script lang="ts">
  import DateInput from "$lib/components/date-time/_internal/DateInput.svelte";
  import type { DatePickerProps } from "./models/DatePickerProps";

  const {
    value,
    maxDate,
    label,
    onChange,
    disabled,
    required,
  }: DatePickerProps = $props();
</script>

<DateInput
  type="date"
  {onChange}
  {value}
  {maxDate}
  {label}
  {disabled}
  {required}
/>
