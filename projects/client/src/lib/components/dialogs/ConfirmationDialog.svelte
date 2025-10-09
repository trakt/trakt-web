<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import { Modal } from "flowbite-svelte";
  import { type Writable } from "svelte/store";

  // TODO: better state management than passing open as prop
  const {
    open,
    message,
    title,
    confirmText,
    onConfirm,
  }: {
    open: Writable<boolean>;
    message: string;
    title: string;
    confirmText: string;
    onConfirm: () => void;
  } = $props();
</script>

<Modal
  {title}
  form
  bind:open={$open}
  permanent
  focustrap
  onaction={({ action }) => {
    if (action !== "confirm") {
      return;
    }

    onConfirm();
  }}
  class="trakt-confirmation-dialog"
  bodyClass="trakt-confirmation-dialog-body"
  headerClass="trakt-confirmation-dialog-header"
  footerClass="trakt-confirmation-dialog-footer"
>
  <p>{message}</p>

  {#snippet footer()}
    <Button
      type="submit"
      size="small"
      value="cancel"
      color="default"
      label="TODO"
    >
      Cancel
    </Button>
    <Button
      type="submit"
      size="small"
      value="confirm"
      color="purple"
      label="TODO"
    >
      {confirmText}
    </Button>
  {/snippet}
</Modal>

<style>
  :global(.trakt-confirmation-dialog) {
    padding: var(--ni-24);
    border-radius: var(--border-radius-l);
    border: none;
    background-color: var(--color-card-background);
    color: var(--color-text-primary);
    max-width: var(--ni-380);

    /* TODO css vars */
    box-shadow:
      0px 11px 25px 0px rgba(19, 21, 23, 0.16),
      0px 45px 45px 0px rgba(19, 21, 23, 0.14),
      0px 101px 60px 0px rgba(19, 21, 23, 0.08),
      0px 179px 72px 0px rgba(19, 21, 23, 0.02),
      0px 280px 78px 0px rgba(19, 21, 23, 0);

    :global(form) {
      display: flex;
      flex-direction: column;
      gap: var(--ni-24);
    }
  }

  :global(.trakt-confirmation-dialog[open]) {
    @keyframes blurIn {
      from {
        backdrop-filter: blur(0);
      }
      to {
        backdrop-filter: blur(var(--ni-8));
      }
    }

    &::backdrop {
      animation: blurIn var(--transition-increment) ease-in-out forwards;
    }
  }

  :global(.trakt-confirmation-dialog-header h3) {
    font-size: var(--ni-14);
    font-style: normal;
    font-weight: 600;
    letter-spacing: 0.035rem;
    text-transform: uppercase;

    color: var(--color-text-secondary);
  }

  :global(.trakt-confirmation-dialog-footer) {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
</style>
