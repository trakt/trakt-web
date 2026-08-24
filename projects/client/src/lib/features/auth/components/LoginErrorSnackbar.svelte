<script lang="ts">
  import Snackbar from "$lib/components/snackbar/Snackbar.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { loginErrorStore } from "../_internal/loginErrorStore.ts";
  import { LoginErrorType } from "../models/LoginErrorType.ts";

  const error$ = loginErrorStore.error$;

  const content = $derived.by(() => {
    switch ($error$) {
      case LoginErrorType.RateLimited:
        return {
          title: m.text_login_rate_limited_title(),
          message: m.text_login_rate_limited_message(),
        };
      case LoginErrorType.Unreachable:
        return {
          title: m.text_login_failed_title(),
          message: m.text_login_failed_message(),
        };
      default:
        return null;
    }
  });
</script>

{#if content}
  <Snackbar
    open
    title={content.title}
    message={content.message}
    variant="error"
    onDismiss={() => loginErrorStore.clear()}
  />
{/if}
