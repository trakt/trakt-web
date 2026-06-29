<script lang="ts">
  import CodeIcon from "$lib/components/icons/CodeIcon.svelte";
  import { getLocale } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { ApiApplication } from "$lib/requests/models/ApiApplication.ts";
  import { toHumanDate } from "$lib/utils/formatting/date/toHumanDate.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import SettingsGroupRow from "../SettingsGroupRow.svelte";

  const { app }: { app: ApiApplication } = $props();

  const createdOn = $derived(
    toHumanDate(new Date(), app.createdAt, getLocale()),
  );

  const description = $derived(
    app.description || m.text_app_created_on({ date: createdOn }),
  );
</script>

<SettingsGroupRow
  title={app.name}
  {description}
  variant="link"
  href={UrlBuilder.settings.appsApiDetail(app.id)}
>
  {#snippet icon()}
    <CodeIcon />
  {/snippet}
</SettingsGroupRow>
