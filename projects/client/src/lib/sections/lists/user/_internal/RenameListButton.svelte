<script lang="ts">
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary";
  import { useRenameList } from "./useRenameList.ts";

  const { list, isDeleting }: { list: MediaListSummary; isDeleting: boolean } =
    $props();

  const { renameList, isRenaming } = $derived(useRenameList(list));
</script>

<DropdownItem
  label={m.button_label_rename_list({ name: list.name })}
  style="flat"
  color="default"
  variant="secondary"
  disabled={$isRenaming || isDeleting}
  onclick={renameList}
>
  {m.button_text_rename_list()}
</DropdownItem>
