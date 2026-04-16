<script lang="ts">
  import { page } from "$app/state";
  import * as m from "$lib/features/i18n/messages.ts";
  import ImportGuidelinesDrawer from "./_internal/import/ImportGuidelinesDrawer.svelte";
  import {
    ImportDrawers,
    importDrawerNavigation,
  } from "./_internal/import/importDrawerNavigation.ts";
  import { IMPORT_SOURCE_CONFIGS } from "./import/ImportTypes.ts";

  const { drawer, close } = $derived(
    importDrawerNavigation(page.url.searchParams),
  );

  const guidelines = $derived.by(() => {
    if (drawer === ImportDrawers.JsonGuidelines)
      return IMPORT_SOURCE_CONFIGS["trakt-json"].guide.guidelines;
    if (drawer === ImportDrawers.CsvGuidelines)
      return IMPORT_SOURCE_CONFIGS["trakt-csv"].guide.guidelines;
  });
</script>

{#if drawer === ImportDrawers.JsonGuidelines && guidelines}
  <ImportGuidelinesDrawer
    title={m.header_import_json_guidelines()}
    {guidelines}
    onClose={close}
  />
{/if}

{#if drawer === ImportDrawers.CsvGuidelines && guidelines}
  <ImportGuidelinesDrawer
    title={m.header_import_csv_guidelines()}
    {guidelines}
    onClose={close}
  />
{/if}
