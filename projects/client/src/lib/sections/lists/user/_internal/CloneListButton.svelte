<script lang="ts">
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import CopyIcon from "$lib/components/icons/CopyIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary";

  const {
    list,
    disabled,
    onClick,
  }: {
    list: MediaListSummary;
    disabled?: boolean;
    onClick: () => void;
  } = $props();
</script>

<DropdownItem
  label={m.button_label_clone_list({ name: list.name })}
  style="flat"
  color="default"
  variant="secondary"
  {disabled}
  onclick={onClick}
>
  {m.button_text_clone_list()}

  {#snippet icon()}
    <CopyIcon />
  {/snippet}
</DropdownItem>
