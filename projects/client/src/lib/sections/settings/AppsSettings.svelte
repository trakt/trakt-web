<script lang="ts">
  import CodeIcon from "$lib/components/icons/CodeIcon.svelte";
  import PlugIcon from "$lib/components/icons/PlugIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import SettingsGroupCard from "./_internal/SettingsGroupCard.svelte";
  import SettingsGroupRow from "./_internal/SettingsGroupRow.svelte";
</script>

<div class="trakt-apps-settings">
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
  </SettingsGroupCard>
</div>

<style lang="scss">
  .trakt-apps-settings {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xl);
  }
</style>
