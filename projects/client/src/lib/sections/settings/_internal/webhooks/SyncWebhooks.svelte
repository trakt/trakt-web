<script lang="ts">
  import JellyfinLogo from "$lib/components/icons/JellyfinLogo.svelte";
  import PlexLogo from "$lib/components/icons/PlexLogo.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useQuery } from "$lib/features/query/useQuery.ts";
  import { mediaSyncConnectionsQuery } from "$lib/requests/media-sync/mediaSyncConnectionsQuery.ts";
  import { map } from "rxjs";
  import JellyfinWebhookSteps from "./JellyfinWebhookSteps.svelte";
  import { toMediaServerWebhook } from "./toMediaServerWebhook.ts";
  import WebhookCard from "./WebhookCard.svelte";

  const query = useQuery(mediaSyncConnectionsQuery({}));
  const plexWebhooks = query.pipe(
    map(({ data }) =>
      toMediaServerWebhook({
        connections: data,
        provider: "plex",
        unnamedServer: m.label_plex_server(),
      })
    ),
  );
  const jellyfinWebhooks = query.pipe(
    map(({ data }) =>
      toMediaServerWebhook({
        connections: data,
        provider: "jellyfin",
        unnamedServer: m.label_jellyfin_server(),
      })
    ),
  );
</script>

<div class="trakt-sync-webhooks">
  <header class="webhooks-header">
    <p class="bold">{m.header_sync_webhooks_live_progress()}</p>
    <p class="secondary small">
      {m.description_sync_webhooks_live_progress()}
      {m.description_sync_webhooks_unreachable_servers()}
    </p>
  </header>

  {#each $plexWebhooks ?? [] as webhook (webhook.url)}
    <WebhookCard
      title={m.label_media_server_plex()}
      description={m.description_sync_webhooks_plex({
        servers: webhook.serverNames.join(", "),
      })}
      {webhook}
    >
      {#snippet logo()}<PlexLogo />{/snippet}
    </WebhookCard>
  {/each}

  {#each $jellyfinWebhooks ?? [] as webhook (webhook.url)}
    <WebhookCard
      title={m.label_media_server_jellyfin()}
      description={m.description_sync_webhooks_jellyfin_setup({
        servers: webhook.serverNames.join(", "),
      })}
      {webhook}
    >
      {#snippet logo()}<JellyfinLogo />{/snippet}
      {#snippet instructions()}<JellyfinWebhookSteps />{/snippet}
    </WebhookCard>
  {/each}
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
</style>
