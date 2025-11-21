<script lang="ts">
  import DateTimePicker from "$lib/components/date-time/DateTimePicker.svelte";
  import Modal from "$lib/components/dialogs/Modal.svelte";
  import { writable } from "svelte/store";

  const {
    onConfirm,
    onCancel,
    buttonText,
  }: {
    onConfirm: (date: Date) => void;
    onCancel: () => void;
    buttonText: string;
  } = $props();

  const now = new Date();

  const selectedDate = writable<Date | undefined>(now);
  const isDisabled = $derived(!$selectedDate);

  const confirmHandler = () => {
    const date = $selectedDate;
    if (date) {
      onConfirm(date);
    }
  };
</script>

<Modal
  {onCancel}
  onConfirm={confirmHandler}
  confirmButton={{
    text: buttonText,
    label: buttonText,
    disabled: isDisabled,
  }}
>
  <DateTimePicker
    value={$selectedDate}
    maxDate={now}
    onChange={(date) => selectedDate.set(date)}
  />
</Modal>
