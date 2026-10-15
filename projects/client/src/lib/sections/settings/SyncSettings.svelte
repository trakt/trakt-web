<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import PlexLogo from "$lib/components/icons/PlexLogo.svelte";
  import TabView from "$lib/components/tabs/TabView.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import PlexSyncV2 from "./_internal/plex-sync-v2/PlexSyncV2.svelte";
  import SettingsVipUpsell from "./_internal/SettingsVipUpsell.svelte";
  import SyncWebhooks from "./_internal/webhooks/SyncWebhooks.svelte";

  const TAB_PARAM = "tab";

  function toTab(value: string | null): "servers" | "webhooks" {
    return value === "webhooks" || value === "webhook" ? "webhooks" : "servers";
  }

  const activeTab = $derived(toTab(page.url.searchParams.get(TAB_PARAM)));

  function onChange(to: string) {
    const url = new URL(page.url);
    url.searchParams.set(TAB_PARAM, to);
    // eslint-disable-next-line svelte/no-navigation-without-resolve
    goto(url, { replaceState: true, noScroll: true, keepFocus: true });
  }
</script>

{#snippet plexIcon()}
  <PlexLogo />
{/snippet}

{#snippet serversTab()}
  <PlexSyncV2 />
{/snippet}

{#snippet webhooksTab()}
  <RenderFor audience="free">
    <SettingsVipUpsell
      icon={plexIcon}
      title={m.header_plex_vip_upsell_webhook()}
      description={m.description_plex_vip_upsell_webhook()}
      source="plex-settings-webhook"
    />
  </RenderFor>

  <RenderFor audience="vip">
    <SyncWebhooks />
  </RenderFor>
{/snippet}

<TabView
  value={activeTab}
  tabs={[
    {
      value: "servers",
      label: m.tab_text_sync_servers(),
      content: serversTab,
    },
    {
      value: "webhooks",
      label: m.tab_text_sync_webhooks(),
      content: webhooksTab,
    },
  ]}
  {onChange}
/>
