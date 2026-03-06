<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import DateTimePicker from "$lib/components/date-time/DateTimePicker.svelte";
  import Modal from "$lib/components/dialogs/Modal.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { writable } from "$lib/utils/store/WritableSubject.ts";

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

  function handleConfirm() {
    if (!$selectedDate) return;
    onConfirm($selectedDate);
  }
</script>

<Modal onClose={onCancel}>
  <DateTimePicker
    value={$selectedDate}
    maxDate={now}
    onChange={(date) => selectedDate.set(date)}
  />

  {#snippet footer()}
    <Button
      size="small"
      color="default"
      label={m.button_text_cancel()}
      onclick={onCancel}
    >
      {m.button_text_cancel()}
    </Button>
    <Button
      size="small"
      variant="primary"
      color="purple"
      label={buttonText}
      disabled={isDisabled}
      onclick={handleConfirm}
    >
      {buttonText}
    </Button>
  {/snippet}
</Modal>
