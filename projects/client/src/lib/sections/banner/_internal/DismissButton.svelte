<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import CloseIcon from "$lib/components/icons/CloseIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";

  const { onDismiss }: { onDismiss: () => void } = $props();
</script>

<trakt-banner-dismiss-button>
  <ActionButton
    onclick={onDismiss}
    label={m.button_label_dismiss()}
    size="small"
    style="ghost"
  >
    <CloseIcon />
  </ActionButton>
</trakt-banner-dismiss-button>

<style>
  trakt-banner-dismiss-button {
    :global(.trakt-action-button[data-style="ghost"]) {
      color: var(--shade-10);
    }
  }
</style>
