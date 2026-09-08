<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import RetryIcon from "$lib/components/icons/RetryIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
</script>

<Button
  variant="primary"
  color="purple"
  style="outline"
  onclick={() => window.location.reload()}
  label={m.button_label_retry()}
  icon={retryIcon}
>
  {m.button_text_retry()}
</Button>

{#snippet retryIcon()}
  <RetryIcon />
{/snippet}
