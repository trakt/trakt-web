<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import { useDangerButton } from "$lib/components/buttons/_internal/useDangerButton";
  import RemoveIcon from "$lib/components/icons/RemoveIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { ConnectedApp } from "$lib/requests/models/ConnectedApp.ts";
  import { useRevokeConnectedApp } from "./useRevokeConnectedApp.ts";

  const { app }: { app: ConnectedApp } = $props();

  const { revoke } = useRevokeConnectedApp();
  const confirmRevoke = $derived(revoke(app));

  const {
    color,
    variant: _,
    ...events
  } = $derived(useDangerButton({ isActive: true, color: "default" }));
</script>

<Button
  variant="secondary"
  style="ghost"
  size="small"
  color={$color}
  label={m.button_label_revoke_app({ name: app.name })}
  onclick={confirmRevoke}
  {...events}
>
  {m.button_text_revoke_access()}

  {#snippet icon()}
    <RemoveIcon />
  {/snippet}
</Button>
