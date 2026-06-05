<script lang="ts">
  import { goto } from "$app/navigation";
  import Button from "$lib/components/buttons/Button.svelte";
  import PopupMenu from "$lib/components/buttons/popup/PopupMenu.svelte";
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import { getLocale } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { StreamingConnection } from "$lib/requests/models/StreamingConnection.ts";
  import { toHumanDate } from "$lib/utils/formatting/date/toHumanDate.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import StreamingServiceBadge from "./StreamingServiceBadge.svelte";
  import { useStreamingSyncActions } from "./useStreamingSyncActions.ts";

  const { connection }: { connection: StreamingConnection } = $props();

  const actions = useStreamingSyncActions();

  let isBusy = $state(false);

  const QUEUED_YEAR = 2000;

  const lastSyncedLabel = $derived.by(() => {
    if (!connection.lastSyncedAt) {
      return m.text_streaming_never_synced();
    }

    if (connection.lastSyncedAt.getUTCFullYear() <= QUEUED_YEAR) {
      return m.text_streaming_queued();
    }

    return toHumanDate(new Date(), connection.lastSyncedAt, getLocale());
  });

  async function run(action: () => Promise<void>) {
    isBusy = true;
    try {
      await action();
    } finally {
      isBusy = false;
    }
  }

  function goToVip() {
    // eslint-disable-next-line svelte/no-navigation-without-resolve
    goto(UrlBuilder.vip());
  }
</script>

<div
  class="trakt-streaming-service-tile"
  class:is-inactive={connection.isConnected && !connection.isActive}
>
  <StreamingServiceBadge
    name={connection.name}
    logoUrl={connection.logoUrl}
    color={connection.color}
    size="small"
  />

  <div class="info">
    <div class="name-row">
      <span class="bold ellipsis">{connection.name}</span>
      {#if connection.isConnected && !connection.isActive}
        <span class="tag inactive">{m.tag_text_inactive()}</span>
      {:else if !connection.isConnected && connection.isVip && !connection.isConnectable}
        <span class="tag vip">{m.tag_text_vip()}</span>
      {/if}
    </div>

    {#if connection.isConnected}
      <div class="details">
        {#if connection.profile}
          <span class="detail">
            <em>{m.text_streaming_profile()}:</em>
            {connection.profile}
          </span>
        {/if}
        <span class="detail">
          <em>{m.text_streaming_last_synced()}:</em>
          {lastSyncedLabel}
        </span>
      </div>
    {/if}
  </div>

  <div class="action">
    {#if connection.isConnected && connection.isActive}
      <PopupMenu size="small" label={m.button_label_sync_options()}>
        {#snippet items()}
          <DropdownItem onclick={() => run(() => actions.sync(connection.id))}>
            {m.button_text_sync_new_data()}
          </DropdownItem>
          <DropdownItem
            onclick={() => run(() => actions.sync(connection.id, true))}
          >
            {m.button_text_sync_all_data()}
          </DropdownItem>
          <DropdownItem
            color="red"
            onclick={actions.unlink({
              id: connection.id,
              name: connection.name,
            })}
          >
            {m.button_text_unlink()}
          </DropdownItem>
        {/snippet}
      </PopupMenu>
    {:else if connection.isConnected && !connection.isActive}
      <Button
        size="small"
        variant="primary"
        color="purple"
        disabled={isBusy}
        label={m.button_label_connect_streaming_service({
          service: connection.name,
        })}
        onclick={() => run(() => actions.connect(connection.id))}
      >
        {m.button_text_reconnect()}
      </Button>
      <PopupMenu size="small" label={m.button_label_sync_options()}>
        {#snippet items()}
          <DropdownItem
            color="red"
            onclick={actions.unlink({
              id: connection.id,
              name: connection.name,
            })}
          >
            {m.button_text_unlink()}
          </DropdownItem>
        {/snippet}
      </PopupMenu>
    {:else if connection.isConnectable}
      <Button
        size="small"
        variant="primary"
        color="purple"
        disabled={isBusy}
        label={m.button_label_connect_streaming_service({
          service: connection.name,
        })}
        onclick={() => run(() => actions.connect(connection.id))}
      >
        {m.button_text_connect()}
      </Button>
    {:else}
      <Button
        size="small"
        variant="primary"
        color="purple"
        label={m.button_text_upgrade()}
        onclick={goToVip}
      >
        {m.button_text_upgrade()}
      </Button>
    {/if}
  </div>
</div>

<style lang="scss">
  .trakt-streaming-service-tile {
    display: flex;
    align-items: center;
    gap: var(--gap-m);

    padding: var(--ni-12) var(--ni-16);

    border: var(--border-thickness-xs) solid transparent;
    border-radius: var(--border-radius-l);
    background-color: var(--color-card-background);
    box-shadow: var(--shadow-base);

    transition: border-color var(--transition-increment) ease-in-out;

    &:hover {
      border-color: var(--color-link-active);
    }
  }

  .info {
    flex: 1;
    min-width: 0;

    display: flex;
    flex-direction: column;
    gap: var(--ni-2);
  }

  .name-row {
    display: flex;
    align-items: baseline;
    gap: var(--gap-xs);

    min-width: 0;
  }

  .details {
    display: flex;
    flex-direction: column;

    color: var(--color-text-secondary);
    font-size: var(--font-size-tag);
  }

  .detail {
    em {
      font-style: italic;
    }
  }

  .action {
    flex-shrink: 0;

    display: flex;
    align-items: center;
    gap: var(--gap-xs);
  }

  span.tag {
    flex-shrink: 0;

    padding: var(--ni-2) var(--ni-6);
    border-radius: var(--border-radius-s);

    font-size: var(--font-size-tag);
    text-transform: uppercase;

    &.inactive {
      background-color: color-mix(
        in srgb,
        var(--color-foreground-red) 16%,
        transparent
      );
      color: var(--color-foreground-red);
    }

    &.vip {
      background-color: color-mix(
        in srgb,
        var(--color-link-active) 16%,
        transparent
      );
      color: var(--color-link-active);
    }
  }
</style>
