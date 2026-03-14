<script lang="ts">
  import Preview from "$lib/components/badge/Preview.svelte";
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import LoadingIndicator from "$lib/components/icons/LoadingIndicator.svelte";
  import { m } from "$lib/features/i18n/messages";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import Notes from "./_internal/Notes.svelte";
  import { useNotes } from "./_internal/useNotes";

  const { onClose, media }: { onClose: () => void; media: MediaEntry } =
    $props();

  const { notes, isLoading } = $derived(useNotes({ media }));
</script>

{#snippet badge()}
  <Preview />
{/snippet}

<Drawer {onClose} title={m.drawer_title_notes()} {badge}>
  {#if $isLoading}
    <LoadingIndicator />
  {:else}
    <Notes notes={$notes} />
  {/if}
</Drawer>
