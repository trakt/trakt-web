<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import EditModeIcon from "$lib/components/icons/EditModeIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useListSelection } from "$lib/features/list-selection/useListSelection.ts";
  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary";
  import BulkDeleteListHeader from "./BulkDeleteListHeader.svelte";

  const { list }: { list: MediaListSummary } = $props();

  const selection = useListSelection();
</script>

{#if selection.isEditing}
  <BulkDeleteListHeader {list} />
{:else}
  <div class="trakt-bulk-list-edit-trigger">
    <Button
      style="ghost"
      size="small"
      color="default"
      label={m.button_label_bulk_edit_list({ name: list.name })}
      onclick={() => selection.enterEdit()}
    >
      {m.button_text_bulk_edit_list()}
      {#snippet icon()}
        <EditModeIcon />
      {/snippet}
    </Button>
  </div>
{/if}

<style>
  .trakt-bulk-list-edit-trigger {
    display: flex;
    justify-content: flex-end;
    padding-block-end: var(--gap-xs);
  }
</style>
