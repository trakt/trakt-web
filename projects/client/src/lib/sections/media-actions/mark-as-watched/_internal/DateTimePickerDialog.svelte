<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import DateTimePicker from "$lib/components/date-time/DateTimePicker.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { writable } from "$lib/utils/store/WritableSubject.ts";
  import Modal from "flowbite-svelte/Modal.svelte";

  const {
    onConfirm,
    onCancel,
    buttonText,
  }: {
    onConfirm: (date: Date) => void;
    onCancel: () => void;
    buttonText: string;
  } = $props();

  let isOpen = $state(true);

  const now = new Date();

  const selectedDate = writable<Date | undefined>(now);
  const isDisabled = $derived(!$selectedDate);

  // FIXME: extract common Modal component
</script>

<Modal
  form
  bind:open={isOpen}
  permanent
  focustrap
  oncancel={onCancel}
  onaction={({ action }) => {
    if (action === "confirm" && $selectedDate) {
      onConfirm($selectedDate);
      return;
    }

    onCancel();
  }}
  class="trakt-modal-dialog"
  classes={{
    header: "trakt-modal-dialog-header",
    body: "trakt-modal-dialog-body",
    footer: "trakt-modal-dialog-footer",
  }}
>
  <DateTimePicker
    value={$selectedDate}
    maxDate={now}
    onChange={(date) => selectedDate.set(date)}
  />

  {#snippet footer()}
    <Button
      size="small"
      value="cancel"
      color="default"
      label={m.button_text_cancel()}
    >
      {m.button_text_cancel()}
    </Button>
    <Button
      type="submit"
      size="small"
      value="confirm"
      variant="primary"
      color="purple"
      label={buttonText}
      disabled={isDisabled}
    >
      {buttonText}
    </Button>
  {/snippet}
</Modal>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  :global(.trakt-modal-dialog) {
    padding: var(--ni-24);
    border-radius: var(--border-radius-l);
    border: none;
    background-color: var(--color-dialog-background);
    color: var(--color-text-primary);

    max-width: var(--ni-480);
    min-width: var(--ni-320);

    box-shadow: var(--popup-shadow);

    :global(form) {
      display: flex;
      flex-direction: column;
      gap: var(--ni-24);
    }

    @include for-mobile {
      --dialog-offset: var(--ni-24);
      --dialog-width: calc(100dvw - (2 * var(--dialog-offset)));

      box-sizing: border-box;

      width: var(--dialog-width);
      max-width: var(--dialog-width);
      min-width: 0;

      margin: 0 auto;

      top: auto;
      bottom: calc(var(--dialog-offset) + env(safe-area-inset-bottom, 0));
    }
  }

  :global(.trakt-modal-dialog[open]) {
    @keyframes blurIn {
      from {
        backdrop-filter: blur(0);
      }
      to {
        backdrop-filter: blur(var(--ni-8));
      }
    }

    &::backdrop {
      pointer-events: none;
      animation: blurIn var(--transition-increment) ease-in-out forwards;
    }
  }

  :global(.trakt-modal-dialog-header) {
    display: none;
  }

  :global(.trakt-modal-dialog-footer) {
    display: flex;
    align-items: center;
    justify-content: space-between;

    @include for-mobile {
      flex-direction: column-reverse;
      align-items: stretch;

      gap: var(--ni-8);
    }
  }
</style>
