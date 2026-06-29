<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import DeleteIcon from "$lib/components/icons/DeleteIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useDeleteApiApplication } from "./useDeleteApiApplication.ts";

  const { app, onDeleted }: {
    app: { id: number; name: string };
    onDeleted: () => void;
  } = $props();

  const { remove } = useDeleteApiApplication();
  const confirmDelete = $derived(remove(app, onDeleted));
</script>

<ActionButton
  variant="secondary"
  style="ghost"
  color="red"
  size="small"
  label={m.button_label_delete_api_app({ name: app.name })}
  onclick={confirmDelete}
>
  <DeleteIcon />
</ActionButton>
