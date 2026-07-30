<script lang="ts">
  import AndroidIcon from "$lib/components/icons/AndroidIcon.svelte";
  import AppleIcon from "$lib/components/icons/AppleIcon.svelte";
  import GlobeIcon from "$lib/components/icons/GlobeIcon.svelte";
  import TabView from "$lib/components/tabs/TabView.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import SettingsGroupCard from "../SettingsGroupCard.svelte";
  import OfficialAppTile from "./OfficialAppTile.svelte";
  import type { OfficialApp } from "./OfficialApp.ts";
  import { officialAppCatalog } from "./officialAppCatalog.ts";

  type AppStore = OfficialApp["destinations"][number]["store"];

  let activeStore = $state<AppStore>("app-store");

  const visibleApps = $derived(
    officialAppCatalog.flatMap((app) => {
      const destination = app.destinations.find(
        ({ store }) => store === activeStore,
      );
      return destination ? [{ app, destination }] : [];
    }),
  );

  const onChange = (store: string) => {
    activeStore = store as AppStore;
  };
</script>

{#snippet appleIcon()}
  <AppleIcon />
{/snippet}

{#snippet androidIcon()}
  <AndroidIcon />
{/snippet}

{#snippet webIcon()}
  <GlobeIcon />
{/snippet}

{#snippet appGrid()}
  <SettingsGroupCard>
    <ul class="official-app-grid">
      {#each visibleApps as { app, destination } (destination.href)}
        <OfficialAppTile {app} {destination} />
      {/each}
    </ul>
  </SettingsGroupCard>
{/snippet}

<div class="trakt-official-apps-gallery">
  <TabView
    value={activeStore}
    tabs={[
      {
        value: "app-store",
        label: m.tab_text_official_apps_apple(),
        icon: appleIcon,
        content: appGrid,
      },
      {
        value: "google-play",
        label: m.tab_text_official_apps_android(),
        icon: androidIcon,
        content: appGrid,
      },
      {
        value: "web",
        label: m.tab_text_official_apps_web(),
        icon: webIcon,
        content: appGrid,
      },
    ]}
    {onChange}
  />
</div>

<style>
  .trakt-official-apps-gallery {
    :global(.trakt-tab-content) {
      padding: 0;
    }
  }

  .official-app-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(var(--ni-96), 1fr));
    gap: var(--gap-m);

    margin: 0;
    padding: var(--gap-m);

    list-style: none;
  }
</style>
