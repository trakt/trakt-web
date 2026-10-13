<script lang="ts">
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import RenameIcon from "$lib/components/icons/RenameIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";

  const { onclick }: { onclick: () => void } = $props();
</script>

<DropdownItem
  {onclick}
  label={m.button_label_edit_comment()}
>
  {`${m.button_text_edit_comment()}…`}
  {#snippet icon()}
    <RenameIcon />
  {/snippet}
</DropdownItem>
