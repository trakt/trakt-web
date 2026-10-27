<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";

  const steps = $derived([
    m.text_jellyfin_webhook_step_install(),
    m.text_jellyfin_webhook_step_add_destination(),
    m.text_jellyfin_webhook_step_paste_url(),
    m.text_jellyfin_webhook_step_notification_types(),
    m.text_jellyfin_webhook_step_item_types(),
    m.text_jellyfin_webhook_step_send_all_properties(),
    m.text_jellyfin_webhook_step_user_filter(),
  ]);
</script>

<div class="trakt-jellyfin-webhook-steps">
  <p class="bold small">{m.header_jellyfin_webhook_steps()}</p>
  <ol class="steps secondary small">
    {#each steps as step, index (index)}
      <li>{step}</li>
    {/each}
  </ol>
</div>

<style lang="scss">
  .trakt-jellyfin-webhook-steps {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);

    padding: var(--gap-s) var(--gap-m) var(--gap-m);
  }

  .steps {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xxs);

    margin: 0;
    padding-inline-start: var(--gap-l);
  }
</style>
