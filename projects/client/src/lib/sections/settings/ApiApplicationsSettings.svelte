<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import { useQuery } from "$lib/features/query/useQuery.ts";
  import { apiApplicationsQuery } from "$lib/requests/queries/apps/apiApplicationsQuery.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import { map } from "rxjs";
  import ApiApplicationRow from "./_internal/apps/ApiApplicationRow.svelte";
  import AppCard from "./_internal/apps/AppCard.svelte";
  import SettingsBlock from "./_internal/SettingsBlock.svelte";
  import SettingsCrumb from "./_internal/SettingsCrumb.svelte";

  const apiApplications = useQuery(apiApplicationsQuery()).pipe(
    map((query) => query.data ?? []),
  );
</script>

<div class="trakt-api-applications-settings">
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
      <AppCard>
        {#each $apiApplications as app (app.key)}
          <ApiApplicationRow {app} />
        {/each}
      </AppCard>
    {/if}
  </SettingsBlock>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-api-applications-settings {
    width: 100%;
    max-width: var(--ni-480);

    @include for-tablet-sm-and-below {
      max-width: 100%;
    }
  }
</style>
