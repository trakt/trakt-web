<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import { useStoredFilters } from "$lib/features/filters/useStoredFilters";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";
  import { m } from "$lib/paraglide/messages";

  const { saveFilters } = useStoredFilters();
</script>

<Button
  label={m.filter_save_label()}
  size="small"
  style="flat"
  color="default"
  variant="secondary"
  navigationType={DpadNavigationType.Item}
  onclick={saveFilters}
>
  {m.filter_save()}
</Button>
