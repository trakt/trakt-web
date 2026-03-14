<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import CloseIcon from "$lib/components/icons/CloseIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { slide } from "svelte/transition";
  import MessageWithLink from "../link/MessageWithLink.svelte";

  type CommentErrorProps = {
    message: string;
    onDismiss: () => void;
    href?: string;
  };

  const { message, onDismiss, href }: CommentErrorProps = $props();
</script>

<div class="trakt-dismissible-error" transition:slide={{ duration: 150 }}>
  <p class="bold">
    {#if href}
      <MessageWithLink {message} {href} target="_blank" />
    {:else}
      {message}
    {/if}
  </p>
  <ActionButton
    size="small"
    onclick={onDismiss}
    label={m.button_label_close_error()}
    color="red"
    style="ghost"
    variant="secondary"
    type="button"
  >
    <CloseIcon />
  </ActionButton>
</div>

<style>
  .trakt-dismissible-error {
    display: flex;
    align-items: center;
    justify-content: space-between;

    color: var(--red-500);

    padding: var(--ni-2);
  }
</style>
