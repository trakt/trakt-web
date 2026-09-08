<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import RetryIcon from "$lib/components/icons/RetryIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import BadTakeMark from "./_internal/BadTakeMark.svelte";
  import ErrorPage from "./ErrorPage.svelte";

  const { message }: { message?: string } = $props();
</script>

<ErrorPage
  title={m.page_title_unexpected_error()}
  kicker={m.error_kicker_unexpected_error()}
  message={message ?? m.error_text_unexpected_error_short()}
  {mark}
  {actions}
/>

{#snippet mark()}
  <BadTakeMark />
{/snippet}

{#snippet actions()}
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
{/snippet}

{#snippet retryIcon()}
  <RetryIcon />
{/snippet}
