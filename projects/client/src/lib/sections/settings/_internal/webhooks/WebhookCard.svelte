<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { copyToClipboard } from "$lib/utils/clipboard/copyToClipboard.ts";
  import { time } from "$lib/utils/timing/time.ts";
  import { onDestroy } from "svelte";
  import SettingsGroupCard from "../SettingsGroupCard.svelte";
  import SettingsGroupRow from "../SettingsGroupRow.svelte";
  import SettingsPill from "../SettingsPill.svelte";
  import type { WebhookCardProps } from "./WebhookCardProps.ts";

  const COPIED_RESET_DURATION = time.seconds(2);

  const { title, description, webhook, logo, instructions }: WebhookCardProps =
    $props();

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
