<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import PlexLogo from "$lib/components/icons/PlexLogo.svelte";
  import TabView from "$lib/components/tabs/TabView.svelte";
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
  import PlexSync from "./_internal/plex/PlexSync.svelte";
  import PlexWebhook from "./_internal/plex/PlexWebhook.svelte";
  import PlexSyncV2 from "./_internal/plex-sync-v2/PlexSyncV2.svelte";
  import SettingsVipUpsell from "./_internal/SettingsVipUpsell.svelte";

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

{#snippet plexIcon()}
  <PlexLogo />
{/snippet}

{#snippet plexSyncV2()}
  <PlexSyncV2 />
{/snippet}

{#snippet syncTab()}
  {#if import.meta.env.DEV}
    {@render plexSyncV2()}
  {:else}
    <RenderForFeature
      flag={FeatureFlag.PlexSyncV2}
      audience="director"
      enabled={plexSyncV2}
    >
      <PlexSync />
    </RenderForFeature>
  {/if}
{/snippet}

{#snippet webhookTab()}
  <RenderFor audience="free">
    <SettingsVipUpsell
      icon={plexIcon}
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
