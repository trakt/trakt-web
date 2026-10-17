<script lang="ts">
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import RenameIcon from "$lib/components/icons/RenameIcon.svelte";

  const {
    label,
    text,
    onclick,
  }: { label: string; text: string; onclick: () => void } = $props();
</script>

<DropdownItem {onclick} {label}>
  {`${text}…`}
  {#snippet icon()}
    <RenameIcon />
  {/snippet}
</DropdownItem>
