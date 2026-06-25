<script lang="ts">
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import ReorderIcon from "$lib/components/icons/ReorderIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";

  const {
    title,
    disabled,
    text = m.button_text_reorder(),
    onclick,
  }: {
    title: string;
    disabled?: boolean;
    text?: string;
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
  {text}

  {#snippet icon()}
    <ReorderIcon />
  {/snippet}
</DropdownItem>
