<script lang="ts">
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import { useStoredFilters } from "$lib/features/filters/useStoredFilters";
  import { m } from "$lib/paraglide/messages";

  const { onSave }: { onSave: () => void } = $props();

  const { saveFilters } = useStoredFilters();
</script>

<DropdownItem
  label={m.button_label_save_filters()}
  style="flat"
  color="default"
  variant="secondary"
  onclick={() => {
    saveFilters();
    onSave();
  }}
>
  {m.button_text_save_filters()}
</DropdownItem>
