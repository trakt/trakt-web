<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import LoadingIndicator from "$lib/components/icons/LoadingIndicator.svelte";
  import PlexLibraryIcon from "$lib/components/icons/PlexLibraryIcon.svelte";
  import ServerIcon from "$lib/components/icons/ServerIcon.svelte";
  import Switch from "$lib/components/toggles/Switch.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import SettingsGroupCard from "../SettingsGroupCard.svelte";
  import SettingsGroupRow from "../SettingsGroupRow.svelte";
  import SyncLoadError from "../SyncLoadError.svelte";
  import PlexProfilePicker from "./PlexProfilePicker.svelte";
  import PlexProfilePickerSkeleton from "./PlexProfilePickerSkeleton.svelte";
  import type { PlexConnectState } from "./models/PlexConnectState.ts";

  const {
    state,
    onOpenSignIn,
    onChooseServer,
    onChooseAccount,
    onToggleLibrary,
    onConnect,
    onRestart,
    onClose,
  }: {
    state: PlexConnectState;
    onOpenSignIn: () => void;
    onChooseServer: (serverId: string) => void;
    onChooseAccount: (accountId: string) => void;
    onToggleLibrary: (externalId: string, enabled: boolean) => void;
    onConnect: () => void;
    onRestart: () => void;
    onClose: () => void;
  } = $props();

  function toErrorText(error: string): string {
    switch (error) {
      case "server_limit_reached":
        return m.error_text_media_sync_server_limit();
      case "connection_removing":
        return m.error_text_media_sync_server_removing();
      default:
        return m.error_text_media_sync_generic();
    }
  }
</script>

<Drawer {onClose} title={m.header_media_sync_connect()} size="auto">
  {#if state.step === "starting" || state.step === "connecting"}
    <div class="loading-container">
      <LoadingIndicator size="small" />
    </div>
  {:else if state.step === "waiting"}
    <div class="connect-step">
      <p class="secondary">{m.description_media_sync_connect_waiting()}</p>
      <div class="loading-container">
        <LoadingIndicator size="small" />
      </div>
      <Button
        size="small"
        variant="secondary"
        color="default"
        label={m.button_label_media_sync_open_plex()}
        onclick={onOpenSignIn}
      >
        {m.button_media_sync_open_plex()}
      </Button>
    </div>
  {:else if state.step === "expired" || state.step === "failed"}
    <SyncLoadError
      variant="plain"
      message={state.step === "expired"
        ? m.description_media_sync_connect_expired()
        : toErrorText(state.error)}
      onRetry={onRestart}
    />
  {:else if state.step === "choosing"}
    <SettingsGroupCard
      variant="bare"
      title={m.header_media_sync_choose_server()}
    >
      {#each state.servers as server (server.id)}
        <SettingsGroupRow
          title={server.name}
          description={server.reachable
            ? undefined
            : m.description_media_sync_server_unreachable()}
          variant="custom"
        >
          {#snippet icon()}<ServerIcon />{/snippet}
          <Button
            size="small"
            variant={server.id === state.serverId ? "primary" : "secondary"}
            color={server.id === state.serverId ? "purple" : "default"}
            label={m.button_label_media_sync_choose_server({
              server: server.name,
            })}
            disabled={!server.reachable}
            onclick={() => onChooseServer(server.id)}
          >
            {m.button_media_sync_choose_server()}
          </Button>
        </SettingsGroupRow>
      {/each}
    </SettingsGroupCard>

    {#if state.serverId && state.accounts === null}
      <PlexProfilePickerSkeleton />
    {:else if state.accounts && state.accounts.length > 1}
      <PlexProfilePicker
        accounts={state.accounts}
        pickedAccountId={state.accountId}
        onPick={onChooseAccount}
      />
    {/if}

    {#if state.serverId}
      <SettingsGroupCard
        variant="bare"
        title={m.header_media_sync_choose_libraries()}
      >
        {#if state.libraries === null}
          <div class="loading-container">
            <LoadingIndicator size="small" />
          </div>
        {:else}
          {#each state.libraries as library (library.externalId)}
            <SettingsGroupRow title={library.title} variant="custom">
              {#snippet icon()}<PlexLibraryIcon />{/snippet}
              <Switch
                label={library.title}
                checked={state.libraryIds.includes(library.externalId)}
                onclick={() =>
                  onToggleLibrary(
                    library.externalId,
                    !state.libraryIds.includes(library.externalId),
                  )}
              />
            </SettingsGroupRow>
          {/each}
        {/if}
      </SettingsGroupCard>
    {/if}

    <div class="drawer-actions">
      <Button
        size="small"
        variant="primary"
        color="purple"
        label={m.button_label_media_sync_connect_server()}
        disabled={!state.serverId || state.libraryIds.length === 0}
        onclick={onConnect}
      >
        {m.button_media_sync_connect_server()}
      </Button>
    </div>
  {/if}
</Drawer>

<style lang="scss">
  .connect-step {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);

    p {
      margin: 0;
    }
  }

  .drawer-actions {
    display: flex;
    flex-direction: column;

    padding-top: var(--gap-m);
  }

  .loading-container {
    display: flex;
    justify-content: center;

    padding: var(--gap-l);
  }
</style>
