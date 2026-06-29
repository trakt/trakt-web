<script lang="ts">
  import { goto } from "$app/navigation";
  import * as m from "$lib/features/i18n/messages.ts";
  import { fromRune } from "$lib/utils/store/fromRune.svelte.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import ApiApplicationForm from "./_internal/apps/ApiApplicationForm.svelte";
  import type { ApiApplicationFormValues } from "./_internal/apps/ApiApplicationFormValues.ts";
  import { useApiApplication } from "./_internal/apps/useApiApplication.ts";
  import { useUpdateApiApplication } from "./_internal/apps/useUpdateApiApplication.ts";
  import SettingsBlock from "./_internal/SettingsBlock.svelte";
  import SettingsCrumb from "./_internal/SettingsCrumb.svelte";

  const { appId }: { appId: number } = $props();

  const { updateApplication, isUpdating } = useUpdateApiApplication();

  const appId$ = fromRune(() => appId);
  const { app: app$ } = useApiApplication(appId$);
  const app = $derived($app$);

  const initial = $derived(
    app
      ? {
        name: app.name,
        description: app.description ?? "",
        redirectUriText: app.redirectUris.join("\n"),
        originsText: app.origins.join("\n"),
      }
      : undefined,
  );

  async function handleSubmit(values: ApiApplicationFormValues) {
    const updated = await updateApplication({ id: appId, ...values });

    if (updated) {
      // eslint-disable-next-line svelte/no-navigation-without-resolve
      goto(UrlBuilder.settings.appsApiDetail(appId));
    }
  }

  function handleCancel() {
    // eslint-disable-next-line svelte/no-navigation-without-resolve
    goto(UrlBuilder.settings.appsApiDetail(appId));
  }
</script>

<div class="trakt-api-application-editor">
  {#if app && initial}
    <SettingsBlock
      title={m.heading_edit_api_application()}
      description={m.description_edit_api_application()}
    >
      {#snippet titlePrefix()}
        <SettingsCrumb
          href={UrlBuilder.settings.appsApiDetail(appId)}
          label={app.name}
        />
      {/snippet}

      <ApiApplicationForm
        {initial}
        isBusy={$isUpdating}
        confirmButtonText={m.button_text_save()}
        confirmButtonLabel={m.button_label_save_app()}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </SettingsBlock>
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-api-application-editor {
    width: 100%;
    max-width: var(--ni-640);

    @include for-tablet-sm-and-below {
      max-width: 100%;
    }
  }
</style>
