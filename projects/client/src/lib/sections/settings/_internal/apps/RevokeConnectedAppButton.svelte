<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import RemoveIcon from "$lib/components/icons/RemoveIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { ConnectedApp } from "$lib/requests/models/ConnectedApp.ts";
  import { useRevokeConnectedApp } from "./useRevokeConnectedApp.ts";

  const { app }: { app: ConnectedApp } = $props();

  const { revoke } = useRevokeConnectedApp();
  const confirmRevoke = $derived(revoke(app));
</script>

<div class="trakt-revoke-connected-app-button">
  <Button
    variant="secondary"
    style="ghost"
    color="red"
    label={m.button_label_revoke_app({ name: app.name })}
    onclick={confirmRevoke}
  >
    {m.button_text_revoke_access()}

    {#snippet icon()}
      <RemoveIcon />
    {/snippet}
  </Button>
</div>

<style lang="scss">
  .trakt-revoke-connected-app-button {
    display: contents;

    :global(.trakt-button) {
      --scale-factor-button: 1.15;
    }
  }
</style>
