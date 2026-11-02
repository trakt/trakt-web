<script lang="ts">
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent.ts";
  import { useTrack } from "$lib/features/analytics/useTrack.ts";
  import Button from "$lib/components/buttons/Button.svelte";
  import { getLocale } from "$lib/features/i18n/index.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaSyncWebhookRefusal } from "$lib/requests/media-sync/models/MediaSyncConnection.ts";
  import { copyToClipboard } from "$lib/utils/clipboard/copyToClipboard.ts";
  import { toHumanTimeAgo } from "$lib/utils/formatting/date/toHumanTimeAgo.ts";
  import { time } from "$lib/utils/timing/time.ts";
  import { onDestroy } from "svelte";
  import SettingsGroupCard from "../SettingsGroupCard.svelte";
  import SettingsGroupRow from "../SettingsGroupRow.svelte";
  import SettingsPill from "../SettingsPill.svelte";
  import type { WebhookCardProps } from "./WebhookCardProps.ts";

  const COPIED_RESET_DURATION = time.seconds(2);
  const REFUSAL_TEXT: Record<MediaSyncWebhookRefusal, () => string> = {
    unreadable_event: m.text_jellyfin_webhook_status_unreadable_event,
    other_server: m.text_jellyfin_webhook_status_other_server,
    other_account: m.text_jellyfin_webhook_status_other_account,
    not_vip: m.text_jellyfin_webhook_status_not_vip,
  };

  const {
    provider,
    title,
    description,
    webhook,
    logo,
    instructions,
  }: WebhookCardProps = $props();
  const { track } = useTrack(AnalyticsEvent.CopyWebhook);

  const status = $derived.by(() => {
    if (provider !== "jellyfin") return null;

    if (webhook.refusal) {
      return { text: REFUSAL_TEXT[webhook.refusal](), isWarning: true };
    }

    if (!webhook.seenAt) {
      return {
        text: m.text_jellyfin_webhook_status_never_received(),
        isWarning: false,
      };
    }

    return {
      text: m.text_jellyfin_webhook_status_working({
        time: toHumanTimeAgo(new Date(), webhook.seenAt, getLocale()),
      }),
      isWarning: false,
    };
  });

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

    track({ provider });
    isCopied = true;
    clearTimeout(resetTimer);
    resetTimer = setTimeout(() => (isCopied = false), COPIED_RESET_DURATION);
  }

  onDestroy(() => clearTimeout(resetTimer));
</script>

<div class="trakt-webhook-card">
  <SettingsGroupCard>
    <SettingsGroupRow {title} {description} variant="custom">
      {#snippet icon()}{@render logo()}{/snippet}
      {#snippet tag()}
        <SettingsPill
          label={m.label_sync_webhooks_server_count({
            count: webhook.serverNames.length,
          })}
        />
      {/snippet}
      {#snippet children()}{/snippet}
    </SettingsGroupRow>
    <div class="webhook-field">
      <code class="value small">
        <span class="value-line">{webhook.url}</span>
      </code>
      <Button
        size="small"
        color="default"
        label={copyLabel}
        onclick={() => handleCopy(webhook.url)}
      >
        {copyLabel}
      </Button>
    </div>
    {#if status}
      <p
        class="webhook-status small"
        class:secondary={!status.isWarning}
        data-warning={status.isWarning}
      >
        {status.text}
      </p>
    {/if}
    {@render instructions?.()}
  </SettingsGroupCard>
</div>

<style lang="scss">
  .trakt-webhook-card {
    .webhook-field {
      display: flex;
      align-items: center;
      gap: var(--gap-xs);
      min-width: 0;

      padding: var(--gap-s) var(--gap-m);
    }

    .webhook-status {
      margin: 0;
      padding: 0 var(--gap-m) var(--gap-s);

      &[data-warning="true"] {
        color: var(--orange-500);
      }
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
  }
</style>
