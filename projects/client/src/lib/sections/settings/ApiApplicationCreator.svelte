<script lang="ts">
  import { goto } from "$app/navigation";
  import * as m from "$lib/features/i18n/messages.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import ApiApplicationFormSection from "./_internal/apps/ApiApplicationFormSection.svelte";
  import type { ApiApplicationFormValues } from "./_internal/apps/ApiApplicationFormValues.ts";
  import { useCreateApiApplication } from "./_internal/apps/useCreateApiApplication.ts";

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

<ApiApplicationFormSection
  title={m.heading_create_api_application()}
  description={m.description_create_api_application()}
  crumbHref={UrlBuilder.settings.appsApi()}
  crumbLabel={m.heading_api_applications()}
  isBusy={$isCreating}
  confirmButtonText={m.button_text_create()}
  confirmButtonLabel={m.button_label_create_app()}
  onSubmit={handleSubmit}
  onCancel={handleCancel}
/>
