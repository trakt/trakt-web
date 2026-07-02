<script lang="ts">
  import { goto } from "$app/navigation";
  import * as m from "$lib/features/i18n/messages.ts";
  import { fromRune } from "$lib/utils/store/fromRune.svelte.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import ApiApplicationFormSection from "./_internal/apps/ApiApplicationFormSection.svelte";
  import ApiApplicationFormSkeleton from "./_internal/apps/ApiApplicationFormSkeleton.svelte";
  import type { ApiApplicationFormValues } from "./_internal/apps/ApiApplicationFormValues.ts";
  import { useApiApplication } from "./_internal/apps/useApiApplication.ts";
  import { useUpdateApiApplication } from "./_internal/apps/useUpdateApiApplication.ts";

  const { appId }: { appId: number } = $props();

  const { updateApplication, isUpdating } = useUpdateApiApplication();

  const appId$ = fromRune(() => appId);
  const { app: app$, isLoading: isLoading$ } = useApiApplication(appId$);
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

{#if app && initial}
  <ApiApplicationFormSection
    title={m.heading_edit_api_application()}
    description={m.description_edit_api_application()}
    crumbHref={UrlBuilder.settings.appsApiDetail(appId)}
    crumbLabel={app.name}
    {initial}
    isBusy={$isUpdating}
    confirmButtonText={m.button_text_save()}
    confirmButtonLabel={m.button_label_save_app()}
    onSubmit={handleSubmit}
    onCancel={handleCancel}
  />
{:else if $isLoading$}
  <ApiApplicationFormSkeleton
    title={m.heading_edit_api_application()}
    description={m.description_edit_api_application()}
  />
{/if}
