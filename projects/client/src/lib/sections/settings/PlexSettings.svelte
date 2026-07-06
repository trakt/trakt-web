<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import TabView from "$lib/components/tabs/TabView.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import PlexSync from "./_internal/plex/PlexSync.svelte";
  import PlexWebhook from "./_internal/plex/PlexWebhook.svelte";
  import { usePlexSync } from "./_internal/plex/usePlexSync.ts";

  const plex = usePlexSync();

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
  <PlexSync {plex} />
{/snippet}

{#snippet webhookTab()}
  <PlexWebhook />
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
