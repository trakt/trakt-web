<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import PopupMenu from "$lib/components/buttons/popup/PopupMenu.svelte";
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import { getLocale } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { StreamingConnection } from "$lib/requests/models/StreamingConnection.ts";
  import { toHumanDate } from "$lib/utils/formatting/date/toHumanDate.ts";
  import StreamingServiceBadge from "./StreamingServiceBadge.svelte";
  import { useStreamingServicesActions } from "./useStreamingServicesActions.ts";

  const { connection }: { connection: StreamingConnection } = $props();

  const actions = useStreamingServicesActions();

  let isBusy = $state(false);

  const isConnectAction = $derived(
    !connection.isConnected && connection.isConnectable,
  );

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
</script>

{#snippet tileContent()}
  <StreamingServiceBadge
    name={connection.name}
    source={connection.id}
    logoUrl={connection.logoUrl}
    size="small"
  />

  <div class="info">
    <div class="name-row">
      <span class="bold ellipsis">{connection.name}</span>
      {#if connection.isConnected && !connection.isActive}
        <span class="tag inactive">{m.tag_text_inactive()}</span>
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
          <span class="last-synced capitalize">{lastSyncedLabel}</span>
        </span>
      </div>
    {/if}
  </div>

  <div class="action">
    {#if connection.isConnected && connection.isActive}
      <PopupMenu
        size="small"
        label={m.button_label_sync_options()}
        title={m.button_label_sync_options()}
        mode="standalone"
      >
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
      <PopupMenu
        size="small"
        label={m.button_label_sync_options()}
        title={m.button_label_sync_options()}
      >
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
    {:else if isConnectAction}
      <span class="connect-cue bold">
        {m.button_text_connect()}
      </span>
    {/if}
  </div>
{/snippet}

{#if isConnectAction}
  <button
    class="trakt-streaming-service-tile"
    type="button"
    disabled={isBusy}
    aria-label={m.button_label_connect_streaming_service({
      service: connection.name,
    })}
    onclick={() => run(() => actions.connect(connection.id))}
  >
    {@render tileContent()}
  </button>
{:else}
  <div
    class="trakt-streaming-service-tile"
    class:is-inactive={connection.isConnected && !connection.isActive}
  >
    {@render tileContent()}
  </div>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-streaming-service-tile {
    display: flex;
    align-items: center;
    gap: var(--gap-m);

    width: 100%;
    box-sizing: border-box;
    padding: var(--ni-14) var(--ni-16);

    text-align: start;
    background: transparent;
    border: none;
    color: inherit;
    font: inherit;

    transition: background var(--transition-increment) ease-in-out;

    &:is(button) {
      cursor: pointer;

      &:disabled {
        cursor: default;
        opacity: var(--de-emphasized-opacity);
      }
    }

    @include for-mouse {
      &:hover {
        background: color-mix(in srgb, var(--color-foreground) 5%, transparent);

        .connect-cue {
          background: var(--color-background-purple-hover);
        }
      }
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

  .last-synced {
    display: inline-block;
  }

  .action {
    flex-shrink: 0;

    display: flex;
    align-items: center;
    gap: var(--gap-xs);
  }

  .connect-cue {
    flex-shrink: 0;

    display: inline-flex;
    align-items: center;
    justify-content: center;

    height: var(--ni-40);
    padding: 0 var(--ni-12);
    box-sizing: border-box;
    border-radius: calc(var(--border-radius-m) * 0.8);

    background: var(--color-background-purple);
    color: var(--color-foreground-purple);

    font-size: var(--font-size-text-small);
    white-space: nowrap;

    transition: background var(--transition-increment) ease-in-out;
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
  }
</style>
