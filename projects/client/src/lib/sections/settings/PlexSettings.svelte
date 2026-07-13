<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import TabView from "$lib/components/tabs/TabView.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import PlexSync from "./_internal/plex/PlexSync.svelte";
  import PlexVipUpsell from "./_internal/plex/PlexVipUpsell.svelte";
  import PlexWebhook from "./_internal/plex/PlexWebhook.svelte";

  const TAB_PARAM = "tab";

  function toTab(value: string | null): "sync" | "webhook" {
    return value === "webhook" ? "webhook" : "sync";
  }

  const activeTab = $derived(toTab(page.url.searchParams.get(TAB_PARAM)));

  function onChange(to: string) {
    const url = new URL(page.url);
    url.searchParams.set(TAB_PARAM, to);
    // eslint-disable-next-line svelte/no-navigation-without-resolve
    goto(url, { replaceState: true, noScroll: true, keepFocus: true });
  }
</script>

{#snippet syncTab()}
  <RenderFor audience="free">
    <PlexVipUpsell
      title={m.header_plex_vip_upsell_sync()}
      description={m.description_plex_vip_upsell_sync()}
      source="plex-settings-sync"
    />
  </RenderFor>

  <RenderFor audience="vip">
    <PlexSync />
  </RenderFor>
{/snippet}

{#snippet webhookTab()}
  <RenderFor audience="free">
    <PlexVipUpsell
      title={m.header_plex_vip_upsell_webhook()}
      description={m.description_plex_vip_upsell_webhook()}
      source="plex-settings-webhook"
    />
  </RenderFor>

  <RenderFor audience="vip">
    <PlexWebhook />
  </RenderFor>
{/snippet}

<TabView
  value={activeTab}
  tabs={[
    {
      value: "sync",
      label: m.tab_text_plex_sync(),
      content: syncTab,
    },
    {
      value: "webhook",
      label: m.tab_text_plex_webhook(),
      content: webhookTab,
    },
  ]}
  {onChange}
/>
