<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import { ConfirmationType } from "$lib/features/confirmation/models/ConfirmationType.ts";
  import { useConfirm } from "$lib/features/confirmation/useConfirm.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { PlexAuthState } from "./usePlexSync.ts";

  const { confirm } = useConfirm();

  const {
    isConnected,
    authState,
    onStartAuth,
    onDisconnect,
  }: {
    isConnected: boolean | null;
    authState: PlexAuthState;
    onStartAuth: () => void;
    onDisconnect: () => void;
  } = $props();
</script>

<div class="trakt-plex-connect">
  {#if isConnected}
    <Button
      size="small"
      color="default"
      label={m.button_label_plex_disconnect()}
      onclick={confirm({
        type: ConfirmationType.DisconnectPlex,
        onConfirm: onDisconnect,
      })}
      disabled={authState === "disconnecting"}
    >
      {m.button_disconnect_plex()}
    </Button>
  {:else}
    <Button
      size="small"
      color="default"
      label={m.button_label_plex_connect()}
      onclick={onStartAuth}
      disabled={authState === "connecting" || isConnected === null}
    >
      {m.button_connect_plex()}
    </Button>
  {/if}
</div>

<style>
  .trakt-plex-connect {
    display: flex;
    align-items: center;
    gap: var(--gap-m);
  }
</style>
