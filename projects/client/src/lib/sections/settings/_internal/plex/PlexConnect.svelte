<script lang="ts">
  import Button from '$lib/components/buttons/Button.svelte';
  import * as m from '$lib/features/i18n/messages.ts';
  import type { PlexAuthState } from './usePlexSync.ts';

  const {
    isConnected,
    authState,
    onStartAuth,
    onConfirmAuth,
    onCancelAuth,
    onDisconnect,
  }: {
    isConnected: boolean | null;
    authState: PlexAuthState;
    onStartAuth: () => void;
    onConfirmAuth: () => void;
    onCancelAuth: () => void;
    onDisconnect: () => void;
  } = $props();
</script>

<div class="plex-connect">
  {#if authState === 'waiting' || authState === 'connecting'}
    <p class="secondary">{m.text_plex_auth_waiting()}</p>
    <div class="plex-connect-actions">
      <Button
        size="small"
        color="default"
        onclick={onConfirmAuth}
        disabled={authState === 'connecting'}
      >
        {m.button_plex_authorized()}
      </Button>
      <Button size="small" variant="secondary" color="default" onclick={onCancelAuth}>
        {m.button_text_cancel()}
      </Button>
    </div>
  {:else if isConnected}
    <span class="secondary">{m.label_plex_connected()}</span>
    <Button
      size="small"
      variant="secondary"
      color="default"
      onclick={onDisconnect}
      disabled={authState === 'disconnecting'}
    >
      {m.button_disconnect_plex()}
    </Button>
  {:else}
    <Button
      size="small"
      color="default"
      onclick={onStartAuth}
      disabled={authState === 'connecting' || isConnected === null}
    >
      {m.button_connect_plex()}
    </Button>
  {/if}
</div>

<style>
  .plex-connect {
    display: flex;
    align-items: center;
    gap: var(--gap-m);
  }

  .plex-connect-actions {
    display: flex;
    gap: var(--gap-s);
  }
</style>
