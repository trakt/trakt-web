<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import CloseIcon from "$lib/components/icons/CloseIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { slide } from "svelte/transition";

  type CommentErrorProps = {
    message: string;
    onDismiss: () => void;
  };

  const { message, onDismiss }: CommentErrorProps = $props();
</script>

<div class="trakt-comment-error" transition:slide={{ duration: 150 }}>
  <p class="meta-info">{message}</p>
  <ActionButton
    size="small"
    onclick={onDismiss}
    label={m.button_label_close_error()}
    color="red"
    style="ghost"
    variant="secondary"
  >
    <CloseIcon />
  </ActionButton>
</div>

<style>
  .trakt-comment-error {
    display: flex;
    align-items: center;
    justify-content: space-between;

    color: var(--red-500);
  }
</style>
