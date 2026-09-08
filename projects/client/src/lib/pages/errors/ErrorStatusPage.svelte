<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import BadTakeMark from "./_internal/BadTakeMark.svelte";
  import ErrorPage from "./ErrorPage.svelte";
  import RetryAction from "./_internal/RetryAction.svelte";

  const { message }: { message?: string } = $props();
</script>

{#snippet mark()}
  <BadTakeMark />
{/snippet}

{#snippet actions()}
  <RetryAction />
{/snippet}

<ErrorPage
  title={m.page_title_unexpected_error()}
  kicker={m.error_kicker_unexpected_error()}
  message={message ?? m.error_text_unexpected_error_short()}
  {mark}
  {actions}
/>
