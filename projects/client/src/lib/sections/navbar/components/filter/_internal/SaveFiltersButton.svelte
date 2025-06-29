<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import { useStoredFilters } from "$lib/features/filters/useStoredFilters";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";
  import { m } from "$lib/paraglide/messages";

  const { onSave }: { onSave: () => void } = $props();

  const { saveFilters } = useStoredFilters();
</script>

<Button
  label={m.button_label_save_filters()}
  size="small"
  style="flat"
  color="default"
  variant="secondary"
  navigationType={DpadNavigationType.Item}
  onclick={() => {
    saveFilters();
    onSave();
  }}
>
  {m.button_text_save_filters()}
</Button>
