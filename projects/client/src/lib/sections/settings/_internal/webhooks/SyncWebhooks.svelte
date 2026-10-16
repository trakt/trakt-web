<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import PlexLogo from "$lib/components/icons/PlexLogo.svelte";
  import ServerIcon from "$lib/components/icons/ServerIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useQuery } from "$lib/features/query/useQuery.ts";
  import { mediaSyncConnectionsQuery } from "$lib/requests/media-sync/mediaSyncConnectionsQuery.ts";
  import { copyToClipboard } from "$lib/utils/clipboard/copyToClipboard.ts";
  import { time } from "$lib/utils/timing/time.ts";
  import { map } from "rxjs";
  import { onDestroy } from "svelte";
  import SettingsGroupCard from "../SettingsGroupCard.svelte";
  import SettingsGroupRow from "../SettingsGroupRow.svelte";
  import SettingsPill from "../SettingsPill.svelte";
  import { toPlexWebhook } from "./toPlexWebhook.ts";

  const COPIED_RESET_DURATION = time.seconds(2);

  const query = useQuery(mediaSyncConnectionsQuery({}));
  const webhook = query.pipe(
    map(({ data }) => toPlexWebhook(data, m.label_plex_server())),
  );

  let isCopied = $state(false);
  const copyLabel = $derived(
    isCopied ? m.button_label_copied() : m.button_label_copy(),
  );
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
    resetTimer = setTimeout(() => (isCopied = false), COPIED_RESET_DURATION);
  }

  onDestroy(() => clearTimeout(resetTimer));
</script>

<div class="trakt-sync-webhooks">
  <header class="webhooks-header">
    <p class="bold">{m.header_sync_webhooks_live_progress()}</p>
    <p class="secondary small">
      {m.description_sync_webhooks_live_progress()}
      {m.description_sync_webhooks_unreachable_servers()}
    </p>
  </header>

  {#if $webhook}
    <SettingsGroupCard>
      <SettingsGroupRow
        title={m.label_media_server_plex()}
        description={m.description_sync_webhooks_plex({
          servers: $webhook.serverNames.join(", "),
        })}
        variant="custom"
      >
        {#snippet icon()}<PlexLogo />{/snippet}
        {#snippet tag()}
          <SettingsPill
            label={m.label_sync_webhooks_server_count({
              count: $webhook.serverNames.length,
            })}
          />
        {/snippet}
        {#snippet children()}{/snippet}
      </SettingsGroupRow>
      <div class="webhook-field">
        <code class="value small">
          <span class="value-line">{$webhook.url}</span>
        </code>
        <Button
          size="small"
          color="default"
          label={copyLabel}
          onclick={() => handleCopy($webhook.url)}
        >
          {copyLabel}
        </Button>
      </div>
    </SettingsGroupCard>
  {/if}

  <SettingsGroupCard>
    <SettingsGroupRow
      title={m.label_media_server_jellyfin()}
      description={m.description_sync_webhooks_jellyfin()}
      variant="custom"
    >
      {#snippet icon()}<ServerIcon />{/snippet}
      {#snippet tag()}
        <SettingsPill label={m.label_sync_webhooks_soon()} />
      {/snippet}
      {#snippet children()}{/snippet}
    </SettingsGroupRow>
  </SettingsGroupCard>
</div>

<style lang="scss">
  .trakt-sync-webhooks {
    display: flex;
    flex-direction: column;
    gap: var(--gap-l);
    min-width: 0;
  }

  .webhooks-header {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xxs);
  }

  .webhook-field {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
    min-width: 0;

    padding: var(--gap-s) var(--gap-m);
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
</style>
