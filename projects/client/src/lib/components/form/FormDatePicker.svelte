<script lang="ts">
  import DatePicker from "$lib/components/date-time/DatePicker.svelte";
  import { writable } from "$lib/utils/store/WritableSubject";
  import FormElementWrapper from "./_internal/FormElementWrapper.svelte";
  import type { FormDatePickerProps } from "./models/FormDatePickerProps";
  import type { ValidationProps } from "./models/ValidationProps";

  const {
    onChange,
    disabled = false,
    value,
    label,
    maxDate,
    required,
    validation,
  }: FormDatePickerProps = $props();

  const errorText = writable<string | undefined>(undefined);

  const handleChange = (newValue: Date | undefined) => {
    if (validation) {
      const isValid = validation.isValid(newValue);
      errorText.set(isValid ? undefined : validation.errorText);
    }

    onChange(newValue);
  };

  const hasError = $derived(Boolean($errorText));
</script>

<FormElementWrapper
  validation={validation
    ? ({
        errorText: validation.errorText,
        isValid: () => !$errorText,
      } satisfies ValidationProps)
    : undefined}
  {hasError}
>
  <DatePicker
    {value}
    {maxDate}
    {label}
    {disabled}
    {required}
    onChange={handleChange}
  />
</FormElementWrapper>
