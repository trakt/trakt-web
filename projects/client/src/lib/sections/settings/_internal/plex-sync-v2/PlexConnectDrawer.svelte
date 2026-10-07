<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import LoadingIndicator from "$lib/components/icons/LoadingIndicator.svelte";
  import PlexLibraryIcon from "$lib/components/icons/PlexLibraryIcon.svelte";
  import ServerIcon from "$lib/components/icons/ServerIcon.svelte";
  import Switch from "$lib/components/toggles/Switch.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaSyncFeed } from "$lib/requests/media-sync/models/MediaSyncFeed.ts";
  import SettingsGroupCard from "../SettingsGroupCard.svelte";
  import SettingsGroupRow from "../SettingsGroupRow.svelte";
  import SyncLoadError from "../SyncLoadError.svelte";
  import type { PlexConnectState } from "./models/PlexConnectState.ts";
  import type { PlexConnectStep } from "./models/PlexConnectStep.ts";
  import PlexConnectProgress from "./PlexConnectProgress.svelte";
  import PlexFeedSwitches from "./PlexFeedSwitches.svelte";
  import PlexProfilePicker from "./PlexProfilePicker.svelte";
  import { toConnectSteps } from "./toConnectSteps.ts";

  const {
    flow,
    onOpenSignIn,
    onChooseServer,
    onChooseAccount,
    onToggleFeed,
    onToggleLibrary,
    onConnect,
    onRestart,
    onClose,
  }: {
    flow: PlexConnectState;
    onOpenSignIn: () => void;
    onChooseServer: (serverId: string) => void;
    onChooseAccount: (accountId: string) => void;
    onToggleFeed: (feed: MediaSyncFeed) => void;
    onToggleLibrary: (externalId: string, enabled: boolean) => void;
    onConnect: () => void;
    onRestart: () => void;
    onClose: () => void;
  } = $props();

  const STEP_TITLES: Record<PlexConnectStep, () => string> = {
    "sign-in": m.header_media_sync_sign_in,
    server: m.header_media_sync_choose_server,
    profile: m.header_media_sync_profiles,
    sync: m.header_media_sync_what_to_sync,
  };

  let chosenStep = $state<PlexConnectStep>("server");

  const steps = $derived(
    toConnectSteps({
      hasProfiles: flow.step === "choosing" &&
        (flow.accounts?.length ?? 0) > 1,
    }),
  );

  const step = $derived.by((): PlexConnectStep => {
    if (flow.step === "starting" || flow.step === "waiting") {
      return "sign-in";
    }
    if (flow.step === "connecting") return "sync";
    return chosenStep;
  });

  const isServerReady = $derived(
    flow.step === "choosing" &&
      flow.serverId != null &&
      flow.libraries != null &&
      flow.accounts != null,
  );

  const canConnect = $derived(
    flow.step === "choosing" &&
      flow.libraryIds.length > 0 &&
      flow.feeds.length > 0,
  );

  function goTo(offset: number) {
    const next = steps[steps.indexOf(step) + offset];
    if (next && next !== "sign-in") chosenStep = next;
  }

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
  {#snippet footer()}
    {#if flow.step !== "expired" && flow.step !== "failed"}
      <div class="wizard-actions">
        {#if step !== "sign-in" && step !== "server"}
          <Button
            size="small"
            variant="secondary"
            color="default"
            label={m.button_label_media_sync_back()}
            disabled={flow.step === "connecting"}
            onclick={() => goTo(-1)}
          >
            {m.button_media_sync_back()}
          </Button>
          {#if step === "sync"}
            <Button
              size="small"
              variant="primary"
              color="purple"
              label={m.button_label_media_sync_connect_server()}
              disabled={!canConnect || flow.step === "connecting"}
              onclick={onConnect}
            >
              {m.button_media_sync_connect_server()}
            </Button>
          {:else}
            <Button
              size="small"
              variant="primary"
              color="purple"
              label={m.button_label_media_sync_next()}
              disabled={!isServerReady}
              onclick={() => goTo(1)}
            >
              {m.button_media_sync_next()}
            </Button>
          {/if}
        {/if}
      </div>
    {/if}
  {/snippet}

  {#if flow.step === "expired" || flow.step === "failed"}
    <SyncLoadError
      variant="plain"
      message={flow.step === "expired"
        ? m.description_media_sync_connect_expired()
        : toErrorText(flow.error)}
      onRetry={() => {
        chosenStep = "server";
        onRestart();
      }}
    />
  {:else}
    <div class="trakt-plex-connect-wizard">
      <PlexConnectProgress
        current={steps.indexOf(step) + 1}
        total={steps.length}
        title={STEP_TITLES[step]()}
      />

      <div>
        {#if step === "sign-in"}
          <div class="sign-in">
            <p class="secondary">
              {m.description_media_sync_connect_waiting()}
            </p>
            <div class="loading-container">
              <LoadingIndicator size="small" />
            </div>
            <Button
              size="small"
              variant="secondary"
              color="default"
              label={m.button_label_media_sync_open_plex()}
              disabled={flow.step !== "waiting"}
              onclick={onOpenSignIn}
            >
              {m.button_media_sync_open_plex()}
            </Button>
          </div>
        {:else if flow.step === "choosing" && step === "server"}
          <SettingsGroupCard variant="bare">
            {#each flow.servers as server (server.id)}
              {@const isChosen = server.id === flow.serverId}
              <SettingsGroupRow
                title={server.name}
                description={server.reachable
                  ? undefined
                  : m.description_media_sync_server_unreachable()}
                variant="custom"
              >
                {#snippet icon()}<ServerIcon />{/snippet}
                {#if isChosen && isServerReady}
                  <Button
                    size="small"
                    variant="primary"
                    color="purple"
                    label={m.button_label_media_sync_continue({
                      server: server.name,
                    })}
                    onclick={() => goTo(1)}
                  >
                    {m.button_media_sync_continue()}
                  </Button>
                {:else if isChosen}
                  <Button
                    size="small"
                    variant="secondary"
                    color="purple"
                    label={m.button_media_sync_loading()}
                    disabled
                  >
                    {m.button_media_sync_loading()}
                  </Button>
                {:else}
                  <Button
                    size="small"
                    variant="secondary"
                    color="default"
                    label={m.button_label_media_sync_choose_server({
                      server: server.name,
                    })}
                    disabled={!server.reachable}
                    onclick={() => onChooseServer(server.id)}
                  >
                    {m.button_media_sync_choose_server()}
                  </Button>
                {/if}
              </SettingsGroupRow>
            {/each}
          </SettingsGroupCard>
        {:else if flow.step === "choosing" && step === "profile" &&
          flow.accounts}
          <PlexProfilePicker
            accounts={flow.accounts}
            pickedAccountId={flow.accountId}
            onPick={onChooseAccount}
            hasTitle={false}
          />
        {:else if flow.step === "choosing" && step === "sync"}
          <div class="sync-choices">
            <PlexFeedSwitches feeds={flow.feeds} onToggle={onToggleFeed} />
            <SettingsGroupCard
              variant="bare"
              title={m.header_media_sync_choose_libraries()}
            >
              {#each flow.libraries ?? [] as library (library.externalId)}
                <SettingsGroupRow title={library.title} variant="custom">
                  {#snippet icon()}<PlexLibraryIcon />{/snippet}
                  <Switch
                    label={library.title}
                    checked={flow.libraryIds.includes(library.externalId)}
                    onclick={() =>
                      onToggleLibrary(
                        library.externalId,
                        !flow.libraryIds.includes(library.externalId),
                      )}
                  />
                </SettingsGroupRow>
              {/each}
            </SettingsGroupCard>
          </div>
        {:else}
          <div class="loading-container">
            <LoadingIndicator size="small" />
          </div>
        {/if}
      </div>

    </div>
  {/if}
</Drawer>

<style lang="scss">
  .trakt-plex-connect-wizard {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);

    p {
      margin: 0;
    }
  }

  .sign-in,
  .sync-choices {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);
  }

  .wizard-actions {
    min-height: var(--ni-40);
    display: flex;
    justify-content: flex-end;
    gap: var(--gap-s);
  }

  .loading-container {
    display: flex;
    justify-content: center;

    padding: var(--gap-l);
  }
</style>
