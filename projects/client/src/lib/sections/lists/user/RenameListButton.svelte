<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import RenameIcon from "$lib/components/icons/RenameIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary";
  import { useRenameList } from "./_internal/useRenameList";

  const { list }: { list: MediaListSummary } = $props();

  const { renameList, isEditable, isRenaming } = $derived(useRenameList(list));
</script>

<RenderFor audience="authenticated">
  {#if $isEditable}
    <ActionButton
      label={m.button_label_rename_list({ name: list.name })}
      onclick={renameList}
      style="ghost"
      disabled={$isRenaming}
    >
      <RenameIcon />
    </ActionButton>
  {/if}
</RenderFor>
