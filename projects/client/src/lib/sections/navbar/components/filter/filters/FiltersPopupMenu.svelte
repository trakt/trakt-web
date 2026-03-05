<script lang="ts">
  import PopupMenu from "$lib/components/buttons/popup/PopupMenu.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import ResetAllButton from "../_internal/ResetAllButton.svelte";
  import SaveFiltersButton from "../_internal/SaveFiltersButton.svelte";

  const { onClose }: { onClose: () => void } = $props();
</script>

<PopupMenu
  label={m.button_label_popup_menu({ title: m.header_filters() })}
  mode="standalone"
>
  {#snippet items()}
    <ResetAllButton />
    <SaveFiltersButton onSave={onClose} />
  {/snippet}
</PopupMenu>
