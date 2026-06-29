<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import { useQuery } from "$lib/features/query/useQuery.ts";
  import { connectedAppsQuery } from "$lib/requests/queries/apps/connectedAppsQuery.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import { map } from "rxjs";
  import AppCard from "./_internal/apps/AppCard.svelte";
  import ConnectedAppRow from "./_internal/apps/ConnectedAppRow.svelte";
  import SettingsBlock from "./_internal/SettingsBlock.svelte";
  import SettingsCrumb from "./_internal/SettingsCrumb.svelte";

  const connectedApps = useQuery(connectedAppsQuery()).pipe(
    map((query) => query.data ?? []),
  );
</script>

<div class="trakt-connected-apps-settings">
  <SettingsBlock
    title={m.heading_connected_apps()}
    description={m.description_connected_apps()}
  >
    {#snippet titlePrefix()}
      <SettingsCrumb
        href={UrlBuilder.settings.apps()}
        label={m.link_text_apps_settings()}
      />
    {/snippet}

    {#if $connectedApps.length === 0}
      <p class="secondary">{m.text_no_connected_apps()}</p>
    {:else}
      <AppCard>
        {#each $connectedApps as app (app.key)}
          <ConnectedAppRow {app} />
        {/each}
      </AppCard>
    {/if}
  </SettingsBlock>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-connected-apps-settings {
    width: 100%;
    max-width: var(--ni-480);

    @include for-tablet-sm-and-below {
      max-width: 100%;
    }
  }
</style>
