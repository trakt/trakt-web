<script lang="ts">
  import { goto } from "$app/navigation";
  import * as m from "$lib/features/i18n/messages.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import ApiApplicationForm from "./_internal/apps/ApiApplicationForm.svelte";
  import type { ApiApplicationFormValues } from "./_internal/apps/ApiApplicationFormValues.ts";
  import { useCreateApiApplication } from "./_internal/apps/useCreateApiApplication.ts";
  import SettingsBlock from "./_internal/SettingsBlock.svelte";
  import SettingsCrumb from "./_internal/SettingsCrumb.svelte";

  const { createApplication, isCreating } = useCreateApiApplication();

  async function handleSubmit(values: ApiApplicationFormValues) {
    const created = await createApplication(values);

    if (created) {
      // eslint-disable-next-line svelte/no-navigation-without-resolve
      goto(UrlBuilder.settings.appsApiDetail(created.id));
    }
  }

  function handleCancel() {
    // eslint-disable-next-line svelte/no-navigation-without-resolve
    goto(UrlBuilder.settings.appsApi());
  }
</script>

<div class="trakt-api-application-creator">
  <SettingsBlock
    title={m.heading_create_api_application()}
    description={m.description_create_api_application()}
  >
    {#snippet titlePrefix()}
      <SettingsCrumb
        href={UrlBuilder.settings.appsApi()}
        label={m.heading_api_applications()}
      />
    {/snippet}

    <ApiApplicationForm
      isBusy={$isCreating}
      confirmButtonText={m.button_text_create()}
      confirmButtonLabel={m.button_label_create_app()}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  </SettingsBlock>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-api-application-creator {
    width: 100%;
    max-width: var(--ni-640);

    @include for-tablet-sm-and-below {
      max-width: 100%;
    }
  }
</style>
