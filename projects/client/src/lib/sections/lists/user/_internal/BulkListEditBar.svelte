<script lang="ts">
  import { useListSelection } from "$lib/features/list-selection/useListSelection.ts";
  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary";
  import BulkDeleteListHeader from "./BulkDeleteListHeader.svelte";

  const { list }: { list: MediaListSummary } = $props();

  const selection = useListSelection();
</script>

{#if selection.isEditing}
  <BulkDeleteListHeader {list} />
{/if}
