<script lang="ts">
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import PlusIcon from "$lib/components/icons/PlusIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary.ts";

  const { list, onClick }: { list: MediaListSummary; onClick: () => void } =
    $props();
</script>

<DropdownItem
  label={m.button_label_add_from_lists({ name: list.name })}
  style="flat"
  color="default"
  variant="secondary"
  onclick={onClick}
>
  {m.button_text_add_from_lists()}

  {#snippet icon()}
    <PlusIcon />
  {/snippet}
</DropdownItem>
