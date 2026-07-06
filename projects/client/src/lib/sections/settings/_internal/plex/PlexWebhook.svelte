<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import CheckIcon from "$lib/components/icons/CheckIcon.svelte";
  import CopyIcon from "$lib/components/icons/CopyIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useQuery } from "$lib/features/query/useQuery.ts";
  import { plexSettingsQuery } from "$lib/requests/plex/plexSettingsQuery.ts";
  import { copyToClipboard } from "$lib/utils/clipboard/copyToClipboard.ts";
  import { map } from "rxjs";
  import { onDestroy } from "svelte";
  import SettingsGroupCard from "../SettingsGroupCard.svelte";
  import PlexHomeUsers from "./PlexHomeUsers.svelte";
  import PlexScrobblerSettings from "./PlexScrobblerSettings.svelte";

  const COPIED_RESET_MS = 2000;

  const settingsQuery = useQuery(plexSettingsQuery());
  const webhookUrl = settingsQuery.pipe(
    map((q) => q.data?.webhook.url ?? null),
  );

  let isCopied = $state(false);
  let resetTimer: ReturnType<typeof setTimeout>;

  async function handleCopy(url: string) {
    const copied = await copyToClipboard(url)
      .then(() => true)
      .catch(() => false);

    if (!copied) {
      return;
    }

    isCopied = true;
    clearTimeout(resetTimer);
    resetTimer = setTimeout(() => (isCopied = false), COPIED_RESET_MS);
  }

  onDestroy(() => clearTimeout(resetTimer));
</script>

<div class="trakt-plex-webhook">
  <SettingsGroupCard description={m.description_plex_webhook()}>
    <div class="webhook-body">
      {#if $webhookUrl}
        <div class="field">
          <span class="secondary small">{m.label_plex_webhook_url()}</span>
          <div class="value-row">
            <code class="value small">
              <span class="value-line">{$webhookUrl}</span>
            </code>
            <div class="actions">
              <ActionButton
                style="ghost"
                size="small"
                label={isCopied
                  ? m.button_label_copied()
                  : m.button_label_copy()}
                onclick={() => handleCopy($webhookUrl ?? "")}
              >
                {#if isCopied}
                  <span class="copied-icon"><CheckIcon /></span>
                {:else}
                  <CopyIcon />
                {/if}
              </ActionButton>
            </div>
          </div>
        </div>
      {:else}
        <p class="secondary small">{m.label_plex_webhook_connect_hint()}</p>
      {/if}
    </div>
  </SettingsGroupCard>

  {#if $webhookUrl}
    <PlexHomeUsers />
    <PlexScrobblerSettings />
  {/if}
</div>

<style lang="scss">
  .trakt-plex-webhook {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xl);
    min-width: 0;
  }

  .webhook-body {
    display: flex;
    flex-direction: column;
    gap: var(--gap-l);

    padding: var(--gap-m);
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: var(--ni-4);
    min-width: 0;
  }

  .value-row {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
    min-width: 0;
  }

  .value {
    flex: 1;
    min-width: 0;
  }

  .value-line {
    display: block;
    min-width: 0;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .actions {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }

  .copied-icon {
    display: flex;
    align-items: center;
    justify-content: center;

    color: var(--color-link-active);

    :global(svg) {
      width: var(--ni-18);
      height: var(--ni-18);
    }
  }
</style>
