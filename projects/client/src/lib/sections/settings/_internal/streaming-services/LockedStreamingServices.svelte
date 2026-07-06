<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import GetVIPLink from "$lib/sections/navbar/components/GetVIPLink.svelte";
  import SettingsGroupCard from "../SettingsGroupCard.svelte";
  import StreamingServiceBadge from "./StreamingServiceBadge.svelte";
  import { useStreamingConnections } from "./useStreamingConnections.ts";

  const { locked } = useStreamingConnections();
</script>

{#if ($locked ?? []).length > 0}
  <SettingsGroupCard
    title={m.header_streaming_vip_services()}
    description={m.description_streaming_vip_services()}
  >
    {#snippet action()}
      <GetVIPLink source="streaming-services-settings" />
    {/snippet}

    <ul class="trakt-locked-streaming-services">
      {#each $locked ?? [] as connection (connection.key)}
        <li class="locked-service">
          <StreamingServiceBadge
            name={connection.name}
            source={connection.id}
            logoUrl={connection.logoUrl}
            size="small"
          />
          <span class="name ellipsis">{connection.name}</span>
        </li>
      {/each}
    </ul>
  </SettingsGroupCard>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-locked-streaming-services {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(var(--ni-96), 1fr));
    gap: var(--gap-m);

    margin: 0;
    padding: var(--gap-m);

    list-style: none;
  }

  .locked-service {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--ni-6);

    min-width: 0;
  }

  .name {
    max-width: 100%;

    color: var(--color-text-secondary);
    font-size: var(--font-size-tag);
    text-align: center;
  }
</style>
