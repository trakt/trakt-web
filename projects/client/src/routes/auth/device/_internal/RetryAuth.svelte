<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";
</script>

<div class="trakt-code-retry" data-dpad-navigation={DpadNavigationType.List}>
  <h4>{m.header_device_auth_failed()}</h4>
  <h6>{m.header_device_auth_try_again()}</h6>
  <Button
    variant="primary"
    color="purple"
    onclick={() => window.location.reload()}
    label={m.button_label_retry()}
    navigationType={DpadNavigationType.Item}
  >
    {m.button_text_retry()}
  </Button>
</div>

<style>
  .trakt-code-retry {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    gap: var(--gap-l);
  }
</style>
