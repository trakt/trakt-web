<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import ConnectedAppRow from "./_internal/apps/ConnectedAppRow.svelte";
  import { useConnectedApps } from "./_internal/apps/useConnectedApps.ts";
  import SettingsGroupCard from "./_internal/SettingsGroupCard.svelte";
  import SettingsGroupRowSkeleton from "./_internal/SettingsGroupRowSkeleton.svelte";
  import SettingsSection from "./_internal/SettingsSection.svelte";

  const { apps, isLoading } = useConnectedApps();
</script>

<SettingsSection
  title={m.heading_connected_apps()}
  description={m.description_connected_apps()}
  crumb={{
    href: UrlBuilder.settings.apps(),
    label: m.link_text_apps_settings(),
  }}
>
  {#if $isLoading}
    <SettingsGroupCard>
      {#each Array(3) as _, index (index)}
        <SettingsGroupRowSkeleton />
      {/each}
    </SettingsGroupCard>
  {:else if $apps.length === 0}
    <p class="secondary">{m.text_no_connected_apps()}</p>
  {:else}
    <SettingsGroupCard>
      {#each $apps as app (app.key)}
        <ConnectedAppRow {app} />
      {/each}
    </SettingsGroupCard>
  {/if}
</SettingsSection>
