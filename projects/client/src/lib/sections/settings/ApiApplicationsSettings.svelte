<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import CodeIcon from "$lib/components/icons/CodeIcon.svelte";
  import PlusIcon from "$lib/components/icons/PlusIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import ApiApplicationRow from "./_internal/apps/ApiApplicationRow.svelte";
  import { useApiApplications } from "./_internal/apps/useApiApplications.ts";
  import SettingsGroupCard from "./_internal/SettingsGroupCard.svelte";
  import SettingsGroupRowSkeleton from "./_internal/SettingsGroupRowSkeleton.svelte";
  import SettingsSection from "./_internal/SettingsSection.svelte";
  import SettingsVipUpsell from "./_internal/SettingsVipUpsell.svelte";

  const { apps, isLoading } = useApiApplications();
</script>

{#snippet codeIcon()}
  <CodeIcon />
{/snippet}

<SettingsSection
  title={m.heading_api_applications()}
  description={m.description_api_applications()}
  crumb={{
    href: UrlBuilder.settings.apps(),
    label: m.link_text_apps_settings(),
  }}
>
  {#snippet action()}
    <RenderFor audience="vip">
      <ActionButton
        href={UrlBuilder.settings.appsApiNew()}
        style="ghost"
        color="default"
        size="small"
        label={m.link_text_create_api_application()}
      >
        <PlusIcon />
      </ActionButton>
    </RenderFor>
  {/snippet}

  <RenderFor audience="free">
    <SettingsVipUpsell
      icon={codeIcon}
      title={m.heading_api_application_vip_only()}
      description={m.text_api_application_vip_only()}
      source="api-applications"
    />
  </RenderFor>

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
