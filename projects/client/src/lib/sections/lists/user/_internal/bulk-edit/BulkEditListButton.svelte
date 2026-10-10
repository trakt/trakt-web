<script lang="ts">
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import EditModeIcon from "$lib/components/icons/EditModeIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";

  const {
    name,
    disabled,
    onclick,
  }: {
    name: string;
    disabled?: boolean;
    onclick: () => void;
  } = $props();
</script>

<DropdownItem
  label={m.button_label_bulk_edit_list({ name })}
  style="flat"
  color="default"
  variant="secondary"
  {disabled}
  {onclick}
>
  {m.button_text_bulk_edit_list()}

  {#snippet icon()}
    <EditModeIcon />
  {/snippet}
</DropdownItem>
