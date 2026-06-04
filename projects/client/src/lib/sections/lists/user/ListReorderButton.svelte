<script lang="ts">
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import ReorderIcon from "$lib/components/icons/ReorderIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";

  const {
    title,
    disabled,
    onclick,
  }: {
    title: string;
    disabled?: boolean;
    onclick: () => void;
  } = $props();
</script>

<DropdownItem
  label={m.button_label_reorder_list({ name: title })}
  style="flat"
  color="default"
  variant="secondary"
  {disabled}
  {onclick}
>
  {m.button_text_reorder()}

  {#snippet icon()}
    <ReorderIcon />
  {/snippet}
</DropdownItem>
