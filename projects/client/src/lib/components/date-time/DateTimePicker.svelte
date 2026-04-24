<script lang="ts">
  import DateInput from "./_internal/DateInput.svelte";
  import type { DatePickerProps } from "./models/DatePickerProps";

  const { value, maxDate, label, onChange, disabled }: DatePickerProps =
    $props();
</script>

<DateInput
  type="datetime-local"
  {value}
  {maxDate}
  {label}
  {onChange}
  {disabled}
/>
