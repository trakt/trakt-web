<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import PlusIcon from "$lib/components/icons/PlusIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useQuery } from "$lib/features/query/useQuery.ts";
  import { apiApplicationsQuery } from "$lib/requests/queries/apps/apiApplicationsQuery.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import { map } from "rxjs";
  import ApiApplicationRow from "./_internal/apps/ApiApplicationRow.svelte";
  import SettingsBlock from "./_internal/SettingsBlock.svelte";
  import SettingsCrumb from "./_internal/SettingsCrumb.svelte";
  import SettingsGroupCard from "./_internal/SettingsGroupCard.svelte";

  const apiApplications = useQuery(apiApplicationsQuery()).pipe(
    map((query) => query.data ?? []),
  );
</script>

<div class="trakt-api-applications-settings">
  <div class="card-actions">
    <ActionButton
      href={UrlBuilder.settings.appsApiNew()}
      style="ghost"
      color="default"
      size="small"
      label={m.link_text_create_api_application()}
    >
      <PlusIcon />
    </ActionButton>
  </div>

  <SettingsBlock
    title={m.heading_api_applications()}
    description={m.description_api_applications()}
  >
    {#snippet titlePrefix()}
      <SettingsCrumb
        href={UrlBuilder.settings.apps()}
        label={m.link_text_apps_settings()}
      />
    {/snippet}

    {#if $apiApplications.length === 0}
      <p class="secondary">{m.text_no_api_applications()}</p>
    {:else}
      <SettingsGroupCard>
        {#each $apiApplications as app (app.key)}
          <ApiApplicationRow {app} />
        {/each}
      </SettingsGroupCard>
    {/if}
  </SettingsBlock>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-api-applications-settings {
    position: relative;

    width: 100%;
    max-width: var(--ni-640);

    @include for-tablet-sm-and-below {
      max-width: 100%;
    }
  }

  .card-actions {
    position: absolute;
    inset-block-start: 0;
    inset-inline-end: 0;

    display: flex;
    align-items: center;
    gap: var(--gap-xs);
  }

  .trakt-api-applications-settings :global(.trakt-settings-block-header) {
    padding-inline-end: var(--ni-48);
  }
</style>
