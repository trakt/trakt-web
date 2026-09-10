<script lang="ts">
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import EditModeIcon from "$lib/components/icons/EditModeIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import GlobalParameterEscaper from "$lib/features/parameters/GlobalParameterEscaper.svelte";
  import type { SmartList } from "$lib/requests/queries/users/smartListQuery";
  import { toSmartListFilterParams } from "$lib/sections/smart-lists/toSmartListFilterParams";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  const { list }: { list: SmartList } = $props();

  const href = $derived(
    UrlBuilder.lists.smart.edit(
      list.slug,
      toSmartListFilterParams(list.filters),
    ),
  );
</script>

<GlobalParameterEscaper enabled>
  <DropdownItem
    style="flat"
    variant="secondary"
    label={m.button_label_edit_list({ name: list.title })}
    {href}
  >
    {m.button_text_edit_list()}

    {#snippet icon()}
      <EditModeIcon />
    {/snippet}
  </DropdownItem>
</GlobalParameterEscaper>
