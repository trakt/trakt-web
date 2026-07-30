<script lang="ts">
  import CodeIcon from "$lib/components/icons/CodeIcon.svelte";
  import GlobeIcon from "$lib/components/icons/GlobeIcon.svelte";
  import PlugIcon from "$lib/components/icons/PlugIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import OfficialAppsGallery from "./_internal/apps/OfficialAppsGallery.svelte";
  import SettingsGroupCard from "./_internal/SettingsGroupCard.svelte";
  import SettingsGroupRow from "./_internal/SettingsGroupRow.svelte";
  import SettingsSection from "./_internal/SettingsSection.svelte";
</script>

<div class="trakt-apps-settings">
  <SettingsSection
    title={m.heading_official_apps()}
    description={m.description_official_apps()}
  >
    <OfficialAppsGallery />
  </SettingsSection>

  <SettingsGroupCard
    title={m.heading_apps_settings()}
    description={m.description_apps_settings()}
  >
    <SettingsGroupRow
      title={m.heading_connected_apps()}
      description={m.description_connected_apps()}
      variant="link"
      href={UrlBuilder.settings.appsConnected()}
    >
      {#snippet icon()}
        <PlugIcon />
      {/snippet}
    </SettingsGroupRow>

    <SettingsGroupRow
      title={m.heading_api_applications()}
      description={m.description_api_applications()}
      variant="link"
      href={UrlBuilder.settings.appsApi()}
    >
      {#snippet icon()}
        <CodeIcon />
      {/snippet}
    </SettingsGroupRow>

    <SettingsGroupRow
      title={m.heading_public_api_docs()}
      description={m.description_public_api_docs()}
      variant="link"
      href={UrlBuilder.docs.api()}
      target="_blank"
    >
      {#snippet icon()}
        <GlobeIcon />
      {/snippet}
    </SettingsGroupRow>
  </SettingsGroupCard>
</div>

<style lang="scss">
  .trakt-apps-settings {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xl);
  }
</style>
