<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import Snackbar from "$lib/components/snackbar/Snackbar.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { time } from "$lib/utils/timing/time.ts";
  import { onMount } from "svelte";

  // Must match the ref the legacy Rails unsubscribe endpoints append when they
  // redirect here after flipping the user's email preference.
  const UNSUBSCRIBE_REF = "trakt-og-unsubscribe";
  const DISMISS_DURATION = time.seconds(10);

  let isConfirmationVisible = $state(false);

  onMount(() => {
    if (page.url.searchParams.get("ref") !== UNSUBSCRIBE_REF) {
      return;
    }

    isConfirmationVisible = true;

    const url = new URL(page.url);
    url.searchParams.delete("ref");
    goto(url, { replaceState: true });
  });
</script>

{#if isConfirmationVisible}
  <Snackbar
    open
    title={m.text_email_unsubscribe_title()}
    message={m.text_email_unsubscribe_message()}
    dismissDurationMs={DISMISS_DURATION}
    onDismiss={() => (isConfirmationVisible = false)}
  />
{/if}
