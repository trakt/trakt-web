<script lang="ts">
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import RenameIcon from "$lib/components/icons/RenameIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary";

  const {
    list,
    isDeleting,
    onClick,
  }: { list: MediaListSummary; isDeleting: boolean; onClick: () => void } =
    $props();
</script>

<DropdownItem
  label={m.button_label_edit_list({ name: list.name })}
  style="flat"
  color="default"
  variant="secondary"
  disabled={isDeleting}
  onclick={onClick}
>
  {`${m.button_text_edit_list()}…`}

  {#snippet icon()}
    <RenameIcon />
  {/snippet}
</DropdownItem>
