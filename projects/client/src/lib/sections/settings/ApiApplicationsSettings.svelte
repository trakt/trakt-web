<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import PlusIcon from "$lib/components/icons/PlusIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import ApiApplicationRow from "./_internal/apps/ApiApplicationRow.svelte";
  import { useApiApplications } from "./_internal/apps/useApiApplications.ts";
  import SettingsGroupCard from "./_internal/SettingsGroupCard.svelte";
  import SettingsGroupRowSkeleton from "./_internal/SettingsGroupRowSkeleton.svelte";
  import SettingsSection from "./_internal/SettingsSection.svelte";

  const { apps, isLoading } = useApiApplications();
</script>

<SettingsSection
  title={m.heading_api_applications()}
  description={m.description_api_applications()}
  crumb={{
    href: UrlBuilder.settings.apps(),
    label: m.link_text_apps_settings(),
  }}
>
  {#snippet action()}
    <ActionButton
      href={UrlBuilder.settings.appsApiNew()}
      style="ghost"
      color="default"
      size="small"
      label={m.link_text_create_api_application()}
    >
      <PlusIcon />
    </ActionButton>
  {/snippet}

  {#if $isLoading}
    <SettingsGroupCard>
      {#each Array(3) as _, index (index)}
        <SettingsGroupRowSkeleton />
      {/each}
    </SettingsGroupCard>
  {:else if $apps.length === 0}
    <p class="secondary">{m.text_no_api_applications()}</p>
  {:else}
    <SettingsGroupCard>
      {#each $apps as app (app.key)}
        <ApiApplicationRow {app} />
      {/each}
    </SettingsGroupCard>
  {/if}
</SettingsSection>
