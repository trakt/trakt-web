<script lang="ts">
  import CodeIcon from "$lib/components/icons/CodeIcon.svelte";
  import PlugIcon from "$lib/components/icons/PlugIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import AppCard from "./_internal/apps/AppCard.svelte";
  import AppRow from "./_internal/apps/AppRow.svelte";
</script>

<div class="trakt-apps-settings">
  <AppCard>
    <AppRow
      title={m.heading_connected_apps()}
      href={UrlBuilder.settings.appsConnected()}
    >
      {#snippet icon()}
        <PlugIcon />
      {/snippet}

      <span>{m.description_connected_apps()}</span>
    </AppRow>

    <AppRow
      title={m.heading_api_applications()}
      href={UrlBuilder.settings.appsApi()}
    >
      {#snippet icon()}
        <CodeIcon />
      {/snippet}

      <span>{m.description_api_applications()}</span>
    </AppRow>
  </AppCard>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-apps-settings {
    width: 100%;
    max-width: var(--ni-480);

    @include for-tablet-sm-and-below {
      max-width: 100%;
    }
  }
</style>
