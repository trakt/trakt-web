<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import SettingsGroupCard from "../SettingsGroupCard.svelte";
  import StreamingServiceTile from "./StreamingServiceTile.svelte";
  import { useStreamingConnections } from "./useStreamingConnections.ts";

  // Actionable services (connected, or connectable on the current plan - e.g.
  // HBO Max for free users). VIP-gated services live in their own section
  // (LockedStreamingServices) so the actionable ones are not buried among
  // upgrade prompts.
  const { available } = useStreamingConnections();

  const inactiveNames = $derived(
    ($available ?? [])
      .filter((connection) => connection.isConnected && !connection.isActive)
      .map((connection) => connection.name),
  );
</script>

<div class="trakt-streaming-services">
  {#if inactiveNames.length > 0}
    <div class="trakt-streaming-warning" role="alert">
      {m.text_reconnect_streaming_warning({
        services: inactiveNames.join(", "),
      })}
    </div>
  {/if}

  {#if ($available ?? []).length > 0}
    <SettingsGroupCard>
      {#each $available ?? [] as connection (connection.key)}
        <StreamingServiceTile {connection} />
      {/each}
    </SettingsGroupCard>
  {/if}
</div>

<style lang="scss">
  .trakt-streaming-services {
    display: flex;
    flex-direction: column;
    gap: var(--gap-l);
  }

  .trakt-streaming-warning {
    padding: var(--ni-12) var(--ni-16);

    border-radius: var(--border-radius-m);
    background-color: color-mix(in srgb, var(--color-foreground-red) 12%, transparent);
    color: var(--color-foreground-red);
  }

  // Service rows reset their own border (button-based rows), so re-assert the
  // 1px divider here — scoped to this section so other group cards are untouched.
  .trakt-streaming-services
    :global(.trakt-streaming-service-tile + .trakt-streaming-service-tile) {
    border-top: var(--border-thickness-xxs) solid
      color-mix(in srgb, var(--color-foreground) 8%, transparent);
  }
</style>
