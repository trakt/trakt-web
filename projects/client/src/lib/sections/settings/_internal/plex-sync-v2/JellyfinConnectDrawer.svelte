<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import LoadingIndicator from "$lib/components/icons/LoadingIndicator.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { JellyfinSignIn } from "$lib/requests/media-sync/jellyfinAuthRequest.ts";
  import type { MediaSyncFeed } from "$lib/requests/media-sync/models/MediaSyncFeed.ts";
  import SyncLoadError from "../SyncLoadError.svelte";
  import HistoryStartChoice from "./HistoryStartChoice.svelte";
  import { JELLYFIN_FEEDS } from "./JELLYFIN_FEEDS.ts";
  import JellyfinQuickConnectCode from "./JellyfinQuickConnectCode.svelte";
  import JellyfinSignInStep from "./JellyfinSignInStep.svelte";
  import type { JellyfinConnectState } from "./models/JellyfinConnectState.ts";
  import type { JellyfinSignInDraft } from "./models/JellyfinSignInDraft.ts";
  import type { PlexConnectStep } from "./models/PlexConnectStep.ts";
  import PlexConnectProgress from "./PlexConnectProgress.svelte";
  import SyncChoices from "./SyncChoices.svelte";
  import { toConnectSteps } from "./toConnectSteps.ts";
  import { toJellyfinErrorText } from "./toJellyfinErrorText.ts";
  import { toJellyfinSignIn } from "./toJellyfinSignIn.ts";

  const {
    flow,
    onSignIn,
    onBackToSignIn,
    onToggleFeed,
    onChooseImportHistory,
    onToggleLibrary,
    onConnect,
    onClose,
  }: {
    flow: JellyfinConnectState;
    onSignIn: (credentials: JellyfinSignIn) => void;
    onBackToSignIn: () => void;
    onToggleFeed: (feed: MediaSyncFeed) => void;
    onChooseImportHistory: (importHistory: boolean) => void;
    onToggleLibrary: (externalId: string, enabled: boolean) => void;
    onConnect: () => void;
    onClose: () => void;
  } = $props();

  const STEP_TITLES: Partial<Record<PlexConnectStep, () => string>> = {
    "sign-in": m.header_media_sync_sign_in_jellyfin,
    sync: m.header_media_sync_what_to_sync,
    history: m.header_media_sync_watch_history,
  };

  let draft = $state<JellyfinSignInDraft>({
    serverUrl: "",
    method: "quick-connect",
    username: "",
    password: "",
  });
  let chosenStep = $state<PlexConnectStep>("sync");

  const credentials = $derived(toJellyfinSignIn(draft));

  const steps = $derived(
    toConnectSteps({
      provider: "jellyfin",
      hasProfiles: false,
      hasHistory: flow.step !== "choosing" || flow.feeds.includes("history"),
    }),
  );

  const step = $derived.by((): PlexConnectStep => {
    if (flow.step === "choosing") return chosenStep;
    if (flow.step === "connecting") return "sync";
    return "sign-in";
  });

  const canConnect = $derived(
    flow.step === "choosing" &&
      flow.libraryIds.length > 0 &&
      flow.feeds.length > 0,
  );

  function goTo(offset: number) {
    const next = steps[steps.indexOf(step) + offset];
    if (next && next !== "sign-in") chosenStep = next;
  }

  function signIn() {
    if (credentials) onSignIn(credentials);
  }
</script>

<Drawer
  {onClose}
  title={m.header_media_sync_connect_jellyfin()}
  size="auto"
>
  {#snippet footer()}
    {#if flow.step !== "expired" && flow.step !== "failed"}
      <div class="wizard-actions">
        {#if flow.step === "waiting"}
          <Button
            size="small"
            variant="secondary"
            color="default"
            label={m.button_label_media_sync_back()}
            onclick={onBackToSignIn}
          >
            {m.button_media_sync_back()}
          </Button>
        {:else if step === "sign-in"}
          <Button
            size="small"
            variant="primary"
            color="purple"
            label={m.button_label_jellyfin_sign_in()}
            disabled={!credentials ||
              (flow.step === "signing-in" && flow.isSubmitting)}
            onclick={signIn}
          >
            {m.button_media_sync_continue()}
          </Button>
        {:else}
          {#if step !== "sync"}
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
          {/if}
          {#if step === steps.at(-1)}
            <Button
              size="small"
              variant="primary"
              color="purple"
              label={m.button_label_jellyfin_connect_server()}
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
              disabled={!canConnect}
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
        ? m.description_jellyfin_connect_expired()
        : toJellyfinErrorText(flow.error)}
      onRetry={() => {
        chosenStep = "sync";
        onBackToSignIn();
      }}
    />
  {:else}
    <div class="trakt-jellyfin-connect-wizard">
      <PlexConnectProgress
        current={steps.indexOf(step) + 1}
        total={steps.length}
        title={STEP_TITLES[step]?.() ?? ""}
      />

      <div>
        {#if flow.step === "waiting"}
          <JellyfinQuickConnectCode
            code={flow.code}
            serverName={flow.serverName}
          />
        {:else if flow.step === "signing-in"}
          <JellyfinSignInStep
            {draft}
            error={flow.error}
            isSubmitting={flow.isSubmitting}
            onChange={(next) => (draft = next)}
            onSubmit={signIn}
          />
        {:else if flow.step === "choosing" && step === "sync"}
          <SyncChoices
            feeds={flow.feeds}
            available={JELLYFIN_FEEDS}
            libraries={flow.libraries}
            libraryIds={flow.libraryIds}
            {onToggleFeed}
            {onToggleLibrary}
          />
        {:else if flow.step === "choosing" && step === "history"}
          <HistoryStartChoice
            importHistory={flow.importHistory}
            alwaysFullNote={m.description_media_sync_history_always_full_jellyfin()}
            onChoose={onChooseImportHistory}
          />
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
  .trakt-jellyfin-connect-wizard {
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
