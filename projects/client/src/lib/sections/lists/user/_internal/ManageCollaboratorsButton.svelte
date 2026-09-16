<script lang="ts">
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import GroupIcon from "$lib/components/icons/GroupIcon.svelte";
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
  label={m.button_label_manage_collaborators({ name: list.name })}
  style="flat"
  color="default"
  variant="secondary"
  disabled={isDeleting}
  onclick={onClick}
>
  {m.button_text_manage_collaborators()}

  {#snippet icon()}
    <GroupIcon />
  {/snippet}
</DropdownItem>
